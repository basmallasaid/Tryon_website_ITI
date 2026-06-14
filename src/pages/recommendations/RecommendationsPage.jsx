import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Sparkles, Sun, Cloud, CloudRain, CloudSnow, Wind } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useWardrobe } from "../../context/WardrobeContext";
import { getAllRecommendations } from "../../api/recommendationsApi";
import { fetchAndCacheDailyOutfit, getCachedDailyOutfit } from "../../utils/dailyRecommendation";
import { translateOutfit } from "../../utils/translate";
import EmptyState from "../../components/EmptyState";
import LoadingScreen from "../../components/LoadingScreen";
import OutfitDetailModal from "../../components/OutfitDetailModal";

function getGreeting(t) {
  const hour = new Date().getHours();
  if (hour < 12) return t("recommendation.greetingMorning");
  if (hour < 18) return t("recommendation.greetingAfternoon");
  return t("recommendation.greetingEvening");
}

function toLocalDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDate(dateStr, locale = "en-US") {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale, { month: "short", day: "numeric" });
}

function deduplicateByDate(entries) {
  const map = {};
  entries.forEach((entry) => {
    const dateKey = entry.created_at ? toLocalDateKey(new Date(entry.created_at)) : null;
    if (dateKey && (!map[dateKey] || new Date(entry.created_at) > new Date(map[dateKey].created_at))) {
      map[dateKey] = entry;
    }
  });
  return map;
}

function buildWeekFromSaturday() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysSinceSaturday = (dayOfWeek + 1) % 7;
  const saturday = new Date(now);
  saturday.setDate(now.getDate() - daysSinceSaturday);
  saturday.setHours(0, 0, 0, 0);
  const week = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(saturday);
    day.setDate(saturday.getDate() + i);
    week.push(day);
  }
  return week;
}

const DAY_NAMES = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
function getShortDay(dayName) { return dayName.slice(0, 3); }

function WeatherIcon({ condition }) {
  const c = (condition || "").toLowerCase();
  if (c.includes("rain") || c.includes("drizzle") || c.includes("thunder")) return <CloudRain className="w-5 h-5 text-blue-400" />;
  if (c.includes("cloud") || c.includes("overcast")) return <Cloud className="w-5 h-5 text-gray-400" />;
  if (c.includes("snow") || c.includes("sleet") || c.includes("ice")) return <CloudSnow className="w-5 h-5 text-blue-200" />;
  if (c.includes("wind") || c.includes("breeze")) return <Wind className="w-5 h-5 text-teal-400" />;
  if (c.includes("clear") || c.includes("sunny")) return <Sun className="w-5 h-5 text-amber-400" />;
  return <Sun className="w-5 h-5 text-amber-400" />;
}

const imgSrc = (image) => {
  if (!image) return null;
  if (typeof image === "string") {
    if (image.startsWith("data:") || image.startsWith("http")) return image;
    return `data:image/jpeg;base64,${image}`;
  }
  if (image.url) return image.url;
  if (image.uri) return image.uri;
  return null;
};

function getItemName(item, isArabic) {
  if (isArabic && item.name_ar) return item.name_ar;
  return item.name || "";
}

function getItemStyle(item, isArabic) {
  if (isArabic && item.style_ar) return item.style_ar;
  return item.style || item.category || "";
}

export default function RecommendationsPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const dateLocale = isArabic ? "ar-EG" : "en-US";
  const { user } = useAuth();
  const { items: wardrobeItems, loading: wardrobeLoading } = useWardrobe();
  const navigate = useNavigate();

  const [todaysOutfit, setTodaysOutfit] = useState(null);
  const [todaysWeather, setTodaysWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const translatedRef = useRef({});

  const userName = useMemo(() => {
    if (!user) return "";
    const profile = user.profile || user.user?.profile;
    const first = profile?.first_name || user?.first_name || user?.firstName || user?.user?.firstName || "";
    return first.split(" ")[0];
  }, [user]);

  const translateIfNeeded = useCallback(async (outfit) => {
    if (!isArabic || !outfit) return outfit;
    const cacheKey = outfit.compositeImage || JSON.stringify(outfit.items);
    if (translatedRef.current[cacheKey]) return translatedRef.current[cacheKey];
    const translated = await translateOutfit(outfit);
    translatedRef.current[cacheKey] = translated;
    return translated;
  }, [isArabic]);

  const fetchHistory = useCallback(async () => {
    try {
      const data = await getAllRecommendations();
      setHistory(data.history || []);
    } catch {
    }
  }, []);

  const fetchDailyRecommendation = useCallback(async () => {
    try {
      const cached = getCachedDailyOutfit();
      if (cached?.outfits?.[0]) {
        const translated = await translateIfNeeded(cached.outfits[0]);
        setTodaysOutfit(translated);
        setTodaysWeather(cached.weather || cached.outfits[0]?.weather || null);
        await fetchHistory();
        return;
      }

      try {
        const result = await fetchAndCacheDailyOutfit();
        if (result?.outfits?.[0]) {
          const translated = await translateIfNeeded(result.outfits[0]);
          setTodaysOutfit(translated);
          setTodaysWeather(result.weather || result.outfits[0]?.weather || null);
        }
      } catch {
        setError(t("recommendation.errorFetching"));
      }

      await fetchHistory();
    } catch {
    } finally {
      setLoading(false);
    }
  }, [fetchHistory, t, translateIfNeeded]);

  useEffect(() => {
    if (user) {
      fetchDailyRecommendation();
    } else {
      setLoading(false);
    }
  }, [user, fetchDailyRecommendation]);

  const weeklyOutfits = useMemo(() => {
    const todayKey = toLocalDateKey(new Date());
    const byDate = deduplicateByDate(history);
    if (todaysOutfit && !byDate[todayKey]) {
      byDate[todayKey] = {
        _id: "today",
        outfits: [todaysOutfit],
        weather: todaysWeather || todaysOutfit?.weather || null,
        created_at: new Date().toISOString(),
      };
    }
    const weekDates = buildWeekFromSaturday();
    return weekDates.map((dayDate, idx) => {
      const dateKey = toLocalDateKey(dayDate);
      const entry = byDate[dateKey] || null;
      return {
        dayName: DAY_NAMES[idx],
        dayIndex: idx,
        date: dateKey,
        entry,
        hasOutfit: !!entry,
        isToday: dateKey === todayKey,
      };
    });
  }, [history, todaysOutfit, todaysWeather]);

  const weather = todaysWeather || weeklyOutfits.find((d) => d.isToday)?.entry?.weather || history[0]?.weather || null;
  const todayEntry = weeklyOutfits.find((d) => d.isToday);
  const todayOutfit = todaysOutfit || todayEntry?.entry?.outfits?.[0] || history[0]?.outfits?.[0] || null;
  const currentItems = todayOutfit?.items || [];

  if (loading || wardrobeLoading) {
    return <LoadingScreen visible />;
  }

  if (wardrobeItems.length === 0) {
    return (
      <EmptyState
        message={t('wardrobe.empty')}
        description={t('wardrobe.emptyDesc')}
        buttonText={t('wardrobe.addFirstItem')}
        onButtonClick={() => navigate("/wardrobe")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-text-secondary pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {error && (
          <div className="rounded-2xl border border-[var(--error-border)] bg-[var(--error-bg)] px-6 py-4 text-sm text-[var(--error-text)] font-medium">
            {error}
          </div>
        )}

        {/* --- HEADER --- */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-black font-roboto text-text-primary tracking-tight">
              {getGreeting(t)}, <span className="text-brand-secondary">{userName || t("recommendation.guest")}!</span>
            </h1>
            <p className="text-text-disabled font-medium text-lg">{t("recommendation.subtitle")}</p>
          </div>
          {weather && (
            <div className="bg-surface-elevated border border-[var(--border)] rounded-[2rem] px-8 py-5 shadow-sm flex items-center gap-8 min-w-[340px]">
              <div className="flex items-center gap-4 border-r border-[var(--border)] pr-8">
                <WeatherIcon condition={weather.condition} />
                <div>
                  <span className="text-3xl font-black block leading-none text-text-primary">{weather.temperature ?? "25"}°C</span>
                  <span className="text-[10px] font-bold text-text-disabled uppercase tracking-widest mt-1 block">{weather.condition || "Clear Sky"}</span>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-center space-y-1">
                  <Cloud className="w-4 h-4 text-slate-400 mx-auto" />
                  <span className="text-xs font-bold text-text-primary block">{weather.humidity}%</span>
                </div>
                <div className="text-center space-y-1">
                  <Wind className="w-4 h-4 text-teal-400 mx-auto" />
                  <span className="text-xs font-bold text-text-primary block">{weather.windSpeed}</span>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* --- MAIN HERO SECTION --- */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black font-roboto text-text-primary tracking-tight">
              {t("recommendation.todaysRecommendation")}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Main Big Image */}
            <div className="lg:col-span-8 relative h-[500px] lg:h-[600px] rounded-[3rem] overflow-hidden shadow-xl bg-surface-elevated group">
              {todayOutfit?.compositeImage || todayOutfit?.items?.[0]?.image ? (
                <img src={imgSrc(todayOutfit.compositeImage || todayOutfit?.items?.[0]?.image)} alt="Main Outfit" className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[var(--bg-secondary)]"><Sparkles className="w-16 h-16 text-text-disabled" /></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end">
                <span className="bg-brand-secondary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest w-fit mb-4">{t("recommendation.todayChoice")}</span>
                <h3 className="text-white text-4xl lg:text-5xl font-black mb-3">{t("recommendation.todaysLook")}</h3>
                <p className="text-white/80 max-w-xl font-medium leading-relaxed">{t("recommendation.weatherDescription")}</p>
              </div>
            </div>

            {/* Right: Outfit Details */}
            <div className="lg:col-span-4 flex flex-col gap-6 justify-end">
              <div className="bg-surface-elevated border border-[var(--border)] rounded-[2rem] p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-1 bg-brand-secondary rounded-full" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-brand-secondary">{t("recommendation.outfitDetails")}</h3>
                </div>
                <div className="flex flex-col gap-3">
                  {currentItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-[var(--bg-secondary)] rounded-2xl p-3 border border-[var(--border)]">
                      <div className="w-16 h-16 bg-surface-elevated rounded-xl overflow-hidden p-1.5 flex items-center justify-center shrink-0">
                        <img src={imgSrc(item.image)} className="w-full h-full object-contain" alt={getItemName(item, isArabic)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-text-primary truncate">{getItemName(item, isArabic) || t("recommendation.clothingItem")}</h4>
                        <span className="text-[10px] font-black text-brand-secondary uppercase tracking-wider">{getItemStyle(item, isArabic) || "Casual"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- WEEKLY OUTFITS --- */}
        <section>
          <h2 className="text-2xl font-black font-roboto text-text-primary tracking-tight mb-8">{t("recommendation.weeklyTitle")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {weeklyOutfits.map((day) => {
              const outfitImage = day.entry?.outfits?.[0]?.compositeImage || day.entry?.outfits?.[0]?.items?.[0]?.image || null;
              return (
                <button
                  key={day.date}
                  onClick={() => day.hasOutfit && setSelectedDay(day)}
                  disabled={!day.hasOutfit}
                  className={`rounded-[2rem] overflow-hidden border-2 transition-all duration-500 text-left ${
                    day.hasOutfit ? "cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]" : "cursor-default"
                  } ${
                    day.isToday
                      ? "border-brand-secondary shadow-xl scale-105 bg-surface-elevated"
                      : "border-[var(--border)] bg-surface-elevated"
                  }`}
                >
                  <div className="p-4 text-center">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${day.isToday ? "text-brand-secondary" : "text-text-disabled"}`}>{getShortDay(day.dayName)}</span>
                    <p className={`text-sm font-bold mt-1 ${day.isToday ? "text-brand-secondary" : "text-text-primary"}`}>{formatDate(day.date, dateLocale)}</p>
                  </div>
                  <div className="h-[180px] flex items-center justify-center p-4 bg-[var(--bg-secondary)]">
                    {day.hasOutfit && outfitImage ? (
                      <img src={imgSrc(outfitImage)} alt={day.dayName} className="w-full h-full object-contain" />
                    ) : (
                      <Sun className={`w-8 h-8 ${day.isToday ? "text-brand-secondary/30" : "text-text-disabled"}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

      </div>

      {selectedDay && (
        <OutfitDetailModal
          outfit={selectedDay.entry?.outfits?.[0]}
          dayName={selectedDay.dayName}
          date={selectedDay.date}
          isArabic={isArabic}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}
