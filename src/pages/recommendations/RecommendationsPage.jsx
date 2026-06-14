import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Sparkles, ChevronLeft, ChevronRight, Sun, Cloud, CloudRain, CloudSnow, Wind } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useWardrobe } from "../../context/WardrobeContext";
import { getAllRecommendations, requestRecommendations } from "../../api/recommendationsApi";
import EmptyState from "../../components/EmptyState";

// --- الدوال المساعدة (بدون أي تغيير) ---
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

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatFullDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
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

export default function RecommendationsPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { user } = useAuth();
  const { items: wardrobeItems } = useWardrobe();
  const navigate = useNavigate();

  // --- States & Logic (بدون أي تغيير) ---
  const [todaysOutfit, setTodaysOutfit] = useState(null);
  const [todaysWeather, setTodaysWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [, setSelectedOutfit] = useState(null);
  const historyScrollRef = useRef(null);

  const userName = useMemo(() => {
    if (!user) return "";
    const profile = user.profile || user.user?.profile;
    const first = profile?.first_name || user?.first_name || user?.firstName || user?.user?.firstName || "";
    return first.split(" ")[0];
  }, [user]);

  const fetchHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const data = await getAllRecommendations();
      setHistory(data.history || []);
    } catch (e) {
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const fetchDailyRecommendation = useCallback(async () => {
    try {
      const today = toLocalDateKey(new Date());
      const storedKey = `daily_outfit_date_${user?._id}`;
      const cachedDate = localStorage.getItem(storedKey);
      const cachedData = localStorage.getItem(`daily_outfit_data_${user?._id}`);

      if (cachedDate === today && cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (parsed?.outfits?.[0]) {
            setTodaysOutfit(parsed.outfits[0]);
            setTodaysWeather(parsed.weather || parsed.outfits[0]?.weather || null);
            await fetchHistory();
            return;
          }
        } catch (e) {}
      }

      const currentHour = new Date().getHours();
      if (currentHour >= 6) {
        try {
          const result = await requestRecommendations();
          if (result.outfits?.[0]) {
            setTodaysOutfit(result.outfits[0]);
            setTodaysWeather(result.weather || result.outfits[0]?.weather || null);
            localStorage.setItem(storedKey, today);
            localStorage.setItem(`daily_outfit_data_${user?._id}`, JSON.stringify(result));
          }
        } catch (e) {
          setError(t("recommendation.errorFetching"));
        }
      }
      await fetchHistory();
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, [fetchHistory, user, t]);

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
  const aiAnalysis = todayOutfit?.breakdown;
  const currentItems = todayOutfit?.items || [];

  const historyCards = useMemo(() => {
    return history.filter((h) => toLocalDateKey(new Date(h.created_at)) !== toLocalDateKey(new Date()));
  }, [history]);

  const scrollHistory = (direction) => {
    if (historyScrollRef.current) {
      const scrollAmount = 400;
      historyScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--border)] border-t-brand-secondary" />
      </div>
    );
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
        
        {/* --- HEADER --- */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-black font-roboto text-text-primary tracking-tight">
              {getGreeting(t)}, <span className="text-brand-secondary">{userName || t("recommendation.guest")}!</span> 👋
            </h1>
            <p className="text-text-disabled font-medium text-lg">{t("recommendation.subtitle")}</p>
          </div>
          {weather && (
            <div className="bg-surface-elevated border border-[var(--border)] rounded-[2rem] px-8 py-5 shadow-sm flex items-center gap-8 min-w-[340px]">
              <div className="flex items-center gap-4 border-r border-[var(--border)] pr-8">
                <WeatherIcon condition={weather.condition} />
                <div>
                  <span className="text-3xl font-black block leading-none text-text-primary">{weather.temp ?? "25"}°C</span>
                  <span className="text-[10px] font-bold text-text-disabled uppercase tracking-widest mt-1 block">{weather.condition || "Clear Sky"}</span>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-center space-y-1">
                  <CloudRain className="w-4 h-4 text-blue-300 mx-auto" />
                  <span className="text-xs font-bold text-text-primary block">24°C</span>
                </div>
                <div className="text-center space-y-1">
                  <Cloud className="w-4 h-4 text-slate-300 mx-auto" />
                  <span className="text-xs font-bold text-text-primary block">{weather.humidity}%</span>
                </div>
                <div className="text-center space-y-1">
                  <Wind className="w-4 h-4 text-teal-300 mx-auto" />
                  <span className="text-xs font-bold text-text-primary block">{weather.wind_speed}</span>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* --- MAIN HERO SECTION: Bento Layout --- */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black font-roboto text-text-primary tracking-tight">
              {t("recommendation.todaysRecommendation")}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Main Big Image */}
            <div className="lg:col-span-8 relative h-[500px] lg:h-[600px] rounded-[3rem] overflow-hidden shadow-xl bg-surface-elevated group">
              {todayOutfit?.compositeImage ? (
                <img src={imgSrc(todayOutfit.compositeImage)} alt="Main Outfit" className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[var(--bg-secondary)]"><Sparkles className="w-16 h-16 text-text-disabled" /></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end">
                <span className="bg-brand-secondary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest w-fit mb-4">Today's Choice</span>
                <h3 className="text-white text-4xl lg:text-5xl font-black mb-3">{t("recommendation.todaysLook")}</h3>
                <p className="text-white/80 max-w-xl font-medium leading-relaxed">Perfect for today's warm weather and your light wardrobe pieces. A balanced mix of comfort and professionalism.</p>
              </div>
            </div>

            {/* Right: Items + AI Analysis */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                {currentItems.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="bg-surface-elevated border border-[var(--border)] rounded-[2rem] p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
                    <div className="w-24 h-24 bg-[var(--bg-secondary)] rounded-2xl overflow-hidden p-2 flex items-center justify-center shrink-0">
                      <img src={imgSrc(item.image)} className="max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-sm text-text-primary truncate">{item.name || "Clothing"}</h4>
                      <span className="text-[10px] font-black text-brand-secondary uppercase mt-1 block tracking-wider">{item.style || "Casual"}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Analysis Card */}
              {todaysOutfit && (
                <div className="bg-brand-secondary rounded-[2rem] p-6 text-white flex flex-col justify-center relative overflow-hidden flex-1">
                  <Sparkles className="absolute -top-6 -right-6 w-28 h-28 text-white/10 rotate-12" />
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-5 h-5 fill-white" />
                    <h3 className="text-lg font-black tracking-tight">{t("recommendation.aiAnalysis")}</h3>
                  </div>
                  <p className="text-sm font-medium leading-relaxed opacity-95 relative z-10">
                    {aiAnalysis ? Object.values(aiAnalysis).filter(v => typeof v === 'string').join(". ") : t("recommendation.defaultAnalysis")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* --- HISTORY SECTION --- */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black font-roboto text-text-primary tracking-tight">{t("recommendation.historyTitle")}</h2>
            <div className="flex gap-2">
              <button onClick={() => scrollHistory("left")} className="w-10 h-10 flex items-center justify-center rounded-xl border border-[var(--border)] bg-surface-elevated hover:bg-brand-secondary hover:text-white transition-all"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={() => scrollHistory("right")} className="w-10 h-10 flex items-center justify-center rounded-xl border border-[var(--border)] bg-surface-elevated hover:bg-brand-secondary hover:text-white transition-all"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>

          <div ref={historyScrollRef} className="flex gap-6 overflow-x-auto pb-8 no-scrollbar snap-x">
            {historyCards.map((entry) => (
              <div key={entry._id} className="min-w-[300px] bg-surface-elevated rounded-[2.5rem] overflow-hidden border border-[var(--border)] shadow-sm snap-start group transition-transform hover:-translate-y-1">
                <div className="h-[320px] bg-[var(--bg-secondary)] relative flex items-center justify-center p-8">
                  <img src={imgSrc(entry.outfits?.[0]?.compositeImage)} alt="History" className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-5 right-5 bg-brand-secondary text-white text-[10px] font-black px-2.5 py-1 rounded-lg">
                    {entry.outfits?.[0]?.score || "90"}% match
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-black text-sm truncate text-text-primary">{entry.outfits?.[0]?.items?.[0]?.name || "Look"}</h4>
                  <p className="text-[10px] text-text-disabled font-bold uppercase mt-1 tracking-widest">{formatDate(entry.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- WEEKLY FORECAST --- */}
        <section className="bg-text-primary rounded-[3rem] p-10 lg:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/10 blur-[100px] rounded-full" />
          <h2 className="text-2xl font-black mb-10 relative z-10">{t("recommendation.weeklyTitle")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 relative z-10">
            {weeklyOutfits.map((day) => (
              <div
                key={day.date}
                className={`rounded-[2rem] p-6 text-center border transition-all duration-500 ${
                  day.isToday ? "bg-brand-secondary border-brand-secondary shadow-xl scale-105" : "bg-white/5 border-white/10"
                }`}
              >
                <span className={`text-[10px] font-black uppercase tracking-widest ${day.isToday ? "text-white" : "text-white/40"}`}>{getShortDay(day.dayName)}</span>
                <p className={`text-sm font-bold mt-1 ${day.isToday ? "text-white" : "text-white/80"}`}>{formatDate(day.date)}</p>
                <div className="mt-6 flex justify-center">
                  {day.hasOutfit ? (
                    <div className={`p-3 rounded-2xl ${day.isToday ? 'bg-white/20' : 'bg-brand-secondary/20'}`}>
                      <Sparkles className={`w-6 h-6 ${day.isToday ? "text-white" : "text-brand-secondary"}`} />
                    </div>
                  ) : (
                    <Sun className="w-6 h-6 text-white/10" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}