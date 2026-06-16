import { useState, useEffect, useMemo, memo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Sparkles, Sun, Cloud, CloudRain, CloudSnow, Wind } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useWardrobe } from "../../context/WardrobeContext";
import { useRecommendation } from "../../context/RecommendationContext";
import { getLocalDateKey } from "../../utils/dailyRecommendation";
import EmptyState from "../../components/EmptyState";
import LoadingScreen from "../../components/LoadingScreen";
import OutfitDetailModal from "../../components/OutfitDetailModal";

function getGreeting(t) {
  const hour = new Date().getHours();
  if (hour < 12) return t("recommendation.greetingMorning");
  if (hour < 18) return t("recommendation.greetingAfternoon");
  return t("recommendation.greetingEvening");
}

function formatDate(dateStr, locale = "en-US") {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale, { month: "short", day: "numeric" });
}

function deduplicateByDate(entries) {
  const map = {};
  entries.forEach((entry) => {
    const entryDate = entry.created_at || entry.createdAt;
    if (!entryDate) return;
    const dateKey = getLocalDateKey(entryDate);
    if (!dateKey) return;
    if (!map[dateKey] || new Date(entryDate) > new Date(map[dateKey].created_at || map[dateKey].createdAt)) {
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

const WeatherIcon = memo(function WeatherIcon({ condition }) {
  const c = (condition || "").toLowerCase();
  if (c.includes("rain") || c.includes("drizzle") || c.includes("thunder")) return <CloudRain className="w-5 h-5 text-blue-400" />;
  if (c.includes("cloud") || c.includes("overcast")) return <Cloud className="w-5 h-5 text-gray-400" />;
  if (c.includes("snow") || c.includes("sleet") || c.includes("ice")) return <CloudSnow className="w-5 h-5 text-blue-200" />;
  if (c.includes("wind") || c.includes("breeze")) return <Wind className="w-5 h-5 text-teal-400" />;
  return <Sun className="w-5 h-5 text-amber-400" />;
});

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
  const { todaysOutfit, todaysWeather, history, loading: recLoading, error, setLanguage } = useRecommendation();
  const navigate = useNavigate();

  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language, setLanguage]);

  const wardrobeMap = useMemo(() => {
    const map = new Map();
    for (const item of wardrobeItems) {
      map.set(item._id || item.id, item);
    }
    return map;
  }, [wardrobeItems]);

  const userName = useMemo(() => {
    if (!user) return "";
    const profile = user.profile || user.user?.profile;
    const first = profile?.first_name || user?.first_name || user?.firstName || user?.user?.firstName || "";
    return first.split(" ")[0];
  }, [user]);

  const weeklyOutfits = useMemo(() => {
    const todayKey = getLocalDateKey(new Date());
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
      const dateKey = getLocalDateKey(dayDate);
      const entry = byDate[dateKey] || null;
      const outfit = entry?.outfits?.[0] || null;
      return {
        dayName: DAY_NAMES[idx],
        dayIndex: idx,
        date: dateKey,
        entry,
        outfitImage: entry?.composite_image || outfit?.composite_image || outfit?.compositeImage || outfit?.items?.[0]?.image || null,
        hasOutfit: !!entry,
        isToday: dateKey === todayKey,
      };
    });
  }, [history, todaysOutfit, todaysWeather]);

  const weather = todaysWeather || weeklyOutfits.find((d) => d.isToday)?.entry?.weather || null;
  const todayEntry = weeklyOutfits.find((d) => d.isToday);
  const todayOutfitEntry = todayEntry?.entry || null;
  const todayOutfit = todayOutfitEntry?.outfits?.[0] || null;
  const currentItems = useMemo(() => {
    const topId = todayOutfit?.top_id;
    const bottomId = todayOutfit?.bottom_id;
    const top = topId ? wardrobeMap.get(topId) : null;
    const bottom = bottomId ? wardrobeMap.get(bottomId) : null;
    return [top, bottom].filter(Boolean);
  }, [todayOutfit, wardrobeMap]);
  const todayCompositeImage = todayOutfitEntry?.composite_image || todayOutfit?.composite_image || todayOutfit?.compositeImage || currentItems[0]?.image || null;

  if (recLoading || wardrobeLoading) {
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
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-8 sm:space-y-12">
        {error && (
          <div className="rounded-2xl border border-[var(--error-border)] bg-[var(--error-bg)] px-6 py-4 text-sm text-[var(--error-text)] font-medium">
            {error}
          </div>
        )}

        {/* --- HEADER --- */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black font-roboto text-text-primary tracking-tight">
              {getGreeting(t)}, <span className="text-brand-secondary">{userName || t("recommendation.guest")}!</span>
            </h1>
            <p className="text-text-disabled font-medium text-sm sm:text-lg">{t("recommendation.subtitle")}</p>
          </div>
          {weather && (
            <div className="bg-surface-elevated border border-[var(--border)] rounded-[2rem] px-4 sm:px-8 py-4 sm:py-5 shadow-sm flex items-center gap-4 sm:gap-8 w-full md:w-auto max-w-full">
              <div className="flex items-center gap-3 sm:gap-4 border-r border-[var(--border)] pr-4 sm:pr-8">
                <WeatherIcon condition={weather.condition} />
                <div>
                  <span className="text-2xl sm:text-3xl font-black block leading-none text-text-primary">{weather.temperature ?? "25"}°C</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-text-disabled uppercase tracking-widest mt-1 block">{weather.condition || "Clear Sky"}</span>
                </div>
              </div>
              <div className="flex gap-4 sm:gap-6">
                <div className="text-center space-y-1">
                  <Cloud className="w-4 h-4 text-slate-400 mx-auto" />
                  <span className="text-[10px] sm:text-xs font-bold text-text-primary block">{weather.humidity}%</span>
                </div>
                <div className="text-center space-y-1">
                  <Wind className="w-4 h-4 text-teal-400 mx-auto" />
                  <span className="text-[10px] sm:text-xs font-bold text-text-primary block">{weather.windSpeed}</span>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* --- MAIN HERO SECTION --- */}
        <section>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-black font-roboto text-text-primary tracking-tight">
              {t("recommendation.todaysRecommendation")}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Main Big Image */}
            <div className="lg:col-span-8 relative h-[350px] sm:h-[450px] lg:h-[600px] rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-xl bg-surface-elevated group">
              {todayCompositeImage ? (
                <img src={imgSrc(todayCompositeImage)} alt="Main Outfit" loading="lazy" className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[var(--bg-secondary)]"><Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-text-disabled" /></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-5 sm:p-8 lg:p-10 flex flex-col justify-end">
                <span className="bg-brand-secondary text-white text-[9px] sm:text-[10px] font-black px-3 sm:px-4 py-1 sm:py-1.5 rounded-full uppercase tracking-widest w-fit mb-3 sm:mb-4">{t("recommendation.todayChoice")}</span>
                <h3 className="text-white text-2xl sm:text-3xl lg:text-5xl font-black mb-2 sm:mb-3">{t("recommendation.todaysLook")}</h3>
                <p className="text-white/80 max-w-xl font-medium leading-relaxed text-sm sm:text-base">{t("recommendation.weatherDescription")}</p>
              </div>
            </div>

            {/* Right: Outfit Details */}
            <div className="lg:col-span-4 flex flex-col gap-6 justify-end">
              <div className="bg-surface-elevated border border-[var(--border)] rounded-[2rem] p-4 sm:p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-6 h-1 bg-brand-secondary rounded-full" />
                  <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-brand-secondary">{t("recommendation.outfitDetails")}</h3>
                </div>
                <div className="flex flex-col gap-2 sm:gap-3">
                  {currentItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-[var(--bg-secondary)] rounded-2xl p-2.5 sm:p-3 border border-[var(--border)]">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-surface-elevated rounded-xl overflow-hidden p-1.5 flex items-center justify-center shrink-0">
                        <img src={imgSrc(item.image)} className="w-full h-full object-contain" alt={getItemName(item, isArabic)} loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-text-primary truncate">{getItemName(item, isArabic) || t("recommendation.clothingItem")}</h4>
                        <span className="text-[9px] sm:text-[10px] font-black text-brand-secondary uppercase tracking-wider">{getItemStyle(item, isArabic) || "Casual"}</span>
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
          <h2 className="text-xl sm:text-2xl font-black font-roboto text-text-primary tracking-tight mb-6 sm:mb-8">{t("recommendation.weeklyTitle")}</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 lg:gap-4">
            {weeklyOutfits.map((day) => (
                <button
                  key={day.date}
                  onClick={() => day.hasOutfit && setSelectedDay(day)}
                  disabled={!day.hasOutfit}
                  className={`rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border-2 transition-all duration-500 text-left ${
                    day.hasOutfit ? "cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]" : "cursor-default"
                  } ${
                    day.isToday
                      ? "border-brand-secondary shadow-xl scale-105 bg-surface-elevated"
                      : "border-[var(--border)] bg-surface-elevated"
                  }`}
                >
                  <div className="p-2.5 sm:p-4 text-center">
                    <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${day.isToday ? "text-brand-secondary" : "text-text-disabled"}`}>{getShortDay(day.dayName)}</span>
                    <p className={`text-[10px] sm:text-sm font-bold mt-0.5 sm:mt-1 ${day.isToday ? "text-brand-secondary" : "text-text-primary"}`}>{formatDate(day.date, dateLocale)}</p>
                  </div>
                  <div className="h-[100px] sm:h-[140px] lg:h-[180px] flex items-center justify-center p-2.5 sm:p-4 bg-[var(--bg-secondary)]">
                    {day.hasOutfit && day.outfitImage ? (
                      <img src={imgSrc(day.outfitImage)} alt={day.dayName} loading="lazy" className="w-full h-full object-contain" />
                    ) : (
                      <Sun className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${day.isToday ? "text-brand-secondary/30" : "text-text-disabled"}`} />
                    )}
                  </div>
                </button>
              ))}
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
