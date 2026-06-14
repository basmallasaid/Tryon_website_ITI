import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Sparkles, ChevronRight, ChevronLeft, Heart, Star, Sun, Cloud, CloudRain, CloudSnow, Wind } from "lucide-react";
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
    return history.filter((h) => {
      const hKey = toLocalDateKey(new Date(h.created_at));
      const todayKey = toLocalDateKey(new Date());
      return hKey !== todayKey;
    });
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

  // --- عرض حالة التحميل ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F6F7]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#8ED321]" />
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

  // --- 2. حالة الـ Dashboard (إذا وجدت داتا) ---
  return (
    <div className="min-h-screen bg-[#F5F6F7] text-[#1E1E24]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Greeting & Weather */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0D1117]">
              {getGreeting(t)}, {userName || t("recommendation.guest")}! 👋
            </h1>
            <p className="text-gray-500 font-medium mt-1">{t("recommendation.subtitle")}</p>
          </div>
          {weather && (
            <div className="flex items-center gap-6 bg-white border border-slate-100 rounded-[1.5rem] px-6 py-4 shadow-sm min-w-[320px]">
              <div className="flex items-center gap-3 border-r border-slate-50 pr-6">
                <WeatherIcon condition={weather.condition} />
                <div>
                  <span className="text-2xl font-bold block leading-none">{weather.temp ?? "25"}°C</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{weather.condition || "Clear Sky"}</span>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="text-center">
                  <CloudRain className="w-4 h-4 text-blue-300 mx-auto" />
                  <span className="text-[10px] font-bold mt-1 block">24°C</span>
                </div>
                <div className="text-center">
                  <Cloud className="w-4 h-4 text-slate-300 mx-auto" />
                  <span className="text-[10px] font-bold mt-1 block">{weather.humidity}%</span>
                </div>
                <div className="text-center">
                  <Wind className="w-4 h-4 text-teal-300 mx-auto" />
                  <span className="text-[10px] font-bold mt-1 block">{weather.wind_speed}</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Today's Recommendation Banner */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[#0D1117]">{t("recommendation.todaysRecommendation")}</h2>
            <button className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-black">
              {t("recommendation.viewDetails")} <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden shadow-sm bg-white">
            {todayOutfit?.compositeImage ? (
              <img src={imgSrc(todayOutfit.compositeImage)} alt="Outfit" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50"><Sparkles className="w-12 h-12 text-slate-200" /></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10">
              <h3 className="text-white text-4xl font-bold mb-3">{t("recommendation.todaysLook")}</h3>
              <p className="text-white/80 max-w-md text-sm leading-relaxed">
                Perfect for today's warm weather and your light wardrobe pieces. A balanced mix of comfort and professionalism.
              </p>
            </div>
          </div>
        </section>

        {/* Why We Chose This */}
        {todayOutfit && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-[#0D1117] mb-6">{t("recommendation.whyWeChoseThis")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentItems.slice(0, 2).map((item, idx) => (
                <div key={idx} className="bg-white rounded-[2rem] p-6 border border-slate-50 shadow-sm">
                  <div className="aspect-[4/3] bg-[#F3F4F6] rounded-2xl mb-5 flex items-center justify-center p-6 overflow-hidden">
                    <img src={imgSrc(item.image)} alt={item.name} className="max-h-full object-contain mix-blend-multiply transition-transform hover:scale-110" />
                  </div>
                  <h4 className="font-bold text-sm mb-3">{item.name || "Clothing Item"}</h4>
                  <span className="text-[10px] font-bold text-[#8ED321] border border-[#8ED321] px-3 py-1 rounded-full uppercase">
                    {item.style || "Smart Casual"}
                  </span>
                </div>
              ))}

              <div className="bg-[#8ED321] rounded-[2rem] p-10 text-white flex flex-col justify-center relative overflow-hidden">
                <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-white/10 rotate-12" />
                <div className="flex items-center gap-3 mb-5">
                  <Sparkles className="w-6 h-6 fill-white" />
                  <h3 className="text-2xl font-bold italic tracking-tight">{t("recommendation.aiAnalysis")}</h3>
                </div>
                <p className="text-sm font-medium leading-relaxed opacity-95 relative z-10">
                  {aiAnalysis ? Object.values(aiAnalysis).filter(v => typeof v === 'string').join(". ") : t("recommendation.defaultAnalysis")}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* History Gallery */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-[#0D1117]">{t("recommendation.historyTitle")}</h2>
            <div className="flex gap-2">
              <button onClick={() => scrollHistory("left")} className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={() => scrollHistory("right")} className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>

          <div ref={historyScrollRef} className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x">
            {historyCards.map((entry) => (
              <div key={entry._id} className="min-w-[280px] bg-white rounded-[2rem] overflow-hidden border border-slate-50 shadow-sm snap-start group">
                <div className="h-[300px] bg-[#EDF6EA] relative flex items-center justify-center p-8 transition-colors group-hover:bg-[#E5EBE5]">
                  <img src={imgSrc(entry.outfits?.[0]?.compositeImage)} alt="History" className="w-full h-full object-contain mix-blend-multiply" />
                  <div className="absolute top-4 right-4 bg-[#8ED321] text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                    {entry.outfits?.[0]?.score || "90"}% match
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-sm truncate">{entry.outfits?.[0]?.items?.[0]?.name || "Spring Outfit"}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Recommended: {formatDate(entry.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Weekly Forecast */}
        <section>
          <h2 className="text-xl font-bold text-[#0D1117] mb-6">{t("recommendation.weeklyTitle")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {weeklyOutfits.map((day) => (
              <div
                key={day.date}
                className={`rounded-[1.5rem] p-4 text-center border transition-all ${
                  day.isToday ? "bg-[#8ED321] border-[#8ED321] text-white shadow-lg" : "bg-white border-slate-100"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className={`text-xs font-bold uppercase tracking-widest ${day.isToday ? "text-white" : "text-slate-400"}`}>
                    {getShortDay(day.dayName)}
                  </span>
                  <p className={`text-sm font-bold ${day.isToday ? "text-white" : "text-[#0D1117]"}`}>
                    {formatDate(day.date)}
                  </p>
                  <div className="mt-3">
                    {day.hasOutfit ? (
                      <Sparkles className={`w-5 h-5 ${day.isToday ? "text-white" : "text-[#8ED321]"}`} />
                    ) : (
                      <Sun className="w-5 h-5 text-slate-100" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}