import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Sparkles, ChevronRight, ChevronLeft, Heart, Star, Sun, Cloud, CloudRain, CloudSnow, Wind } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useWardrobe } from "../../context/WardrobeContext";
import { getAllRecommendations, requestRecommendations } from "../../api/recommendationsApi";

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

function getShortDay(dayName) {
  return dayName.slice(0, 3);
}

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
  const topItem = currentItems.find((i) => i.category === "top" || i.category === "outerwear");
  const bottomItem = currentItems.find((i) => i.category === "bottom");
  const shoeItem = currentItems.find((i) => i.category === "shoes");

  const historyCards = useMemo(() => {
    return history.filter((h) => {
      const hKey = toLocalDateKey(new Date(h.created_at));
      const todayKey = toLocalDateKey(new Date());
      return hKey !== todayKey;
    });
  }, [history]);

  const scrollHistory = (direction) => {
    if (historyScrollRef.current) {
      const scrollAmount = 300;
      historyScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#F5F6F7",
        color: "#1E1E24",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Greeting & Weather Section */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0D1117]">
              {getGreeting(t)}, {userName || t("recommendation.guest")}! 👋
            </h1>
            <p className="text-base font-semibold text-[#1E1E24] mt-1">
              {t("recommendation.subtitle")}
            </p>
          </div>
          {weather && (
            <div className="flex items-center gap-4 bg-white border border-[#D5D9DE] rounded-xl px-4 py-3 min-w-[200px]">
              <WeatherIcon condition={weather.condition || weather.description} />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#161D16]">
                  {weather.temp ?? weather.temperature ?? "—"}°
                </span>
                <span className="text-xs font-medium text-[#3D4A3D] capitalize">
                  {weather.condition || weather.description || ""}
                </span>
              </div>
              <div className="border-l border-[#BCCBB9] pl-4 flex gap-3">
                {weather.humidity != null && (
                  <div className="text-center">
                    <div className="flex justify-center">
                      <Cloud className="w-3 h-3 text-blue-400" />
                    </div>
                    <span className="text-xs font-bold text-[#161D16]">{weather.humidity}%</span>
                  </div>
                )}
                {weather.wind_speed != null && (
                  <div className="text-center">
                    <div className="flex justify-center">
                      <Wind className="w-3 h-3 text-teal-400" />
                    </div>
                    <span className="text-xs font-bold text-[#161D16]">{weather.wind_speed}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Today's Recommendation Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#121826]">
              {t("recommendation.todaysRecommendation")}
            </h2>
            {todayOutfit && (
              <button
                onClick={() => setSelectedOutfit(todayOutfit)}
                className="flex items-center gap-2 text-sm font-medium text-[#1E1E24] hover:opacity-70 transition-opacity cursor-pointer"
              >
                {t("recommendation.viewDetails")}
                <ChevronRight className={`w-4 h-4 ${isArabic ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-[404px] bg-white border border-[#BCCBB9] rounded-2xl">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
            </div>
          ) : todayOutfit ? (
            <div className="relative bg-white border border-[#BCCBB9] rounded-2xl overflow-hidden h-[404px]">
              {todayOutfit.compositeImage ? (
                <img
                  src={imgSrc(todayOutfit.compositeImage)}
                  alt="Today's outfit"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 text-lime-400 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-500">{t("recommendation.outfitReady")}</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 flex flex-col justify-end p-8 sm:p-10">
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {t("recommendation.todaysLook")}
                </h3>
                <p className="text-base sm:text-lg text-white/80 max-w-md">
                  {weather?.condition
                    ? t("recommendation.weatherBasedDesc", {
                        condition: weather.condition,
                        temp: weather.temp ?? weather.temperature ?? "",
                      })
                    : t("recommendation.recommendedForYou")}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[404px] bg-white border border-[#BCCBB9] rounded-2xl">
              <div className="text-center">
                <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">{t("recommendation.noOutfit")}</p>
                <p className="text-gray-400 text-sm mt-1">{t("recommendation.addItemsHint")}</p>
              </div>
            </div>
          )}
        </section>

        {/* Why We Chose This Section */}
        {todayOutfit && currentItems.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#121826] mb-6">
              {t("recommendation.whyWeChoseThis")}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {currentItems.slice(0, 2).map((item, idx) => (
                <div
                  key={item._id || item.id || idx}
                  className="bg-white border border-[#D5D9DE] rounded-xl p-4 flex flex-col"
                >
                  <div className="bg-gray-100 rounded-lg h-[184px] flex items-center justify-center overflow-hidden mb-3">
                    {item.image ? (
                      <img
                        src={imgSrc(item.image)}
                        alt={item.name || "Clothing item"}
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <Sparkles className="w-12 h-12 text-gray-300" />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[#161D16] tracking-wider uppercase mb-2">
                    {item.name || item.category || t("recommendation.clothingItem")}
                  </p>
                  {(item.style || item.pattern) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full border border-[#8ED321] text-xs font-medium text-[#8ED321] w-fit">
                      {(item.style || item.pattern || "").toUpperCase()}
                    </span>
                  )}
                </div>
              ))}
              <div className="bg-[#8ED321] rounded-xl p-8 sm:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-7 h-7 text-[#F1F5F9] fill-[#F1F5F9]" />
                  <h3 className="text-2xl font-bold text-[#F1F5F9]">
                    {t("recommendation.aiAnalysis")}
                  </h3>
                </div>
                <p className="text-base leading-relaxed text-[#F1F5F9]/90">
                  {aiAnalysis
                    ? Object.entries(aiAnalysis)
                        .filter(([k]) => k !== "weatherScore" && k !== "totalScore")
                        .map(([, v]) => (typeof v === "string" ? v : ""))
                        .filter(Boolean)
                        .join(". ") || t("recommendation.defaultAnalysis")
                    : t("recommendation.defaultAnalysis")}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Score Display */}
        {todayOutfit?.score != null && (
          <div className="flex items-center gap-2 mb-8">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="text-lg font-bold text-[#1E1E24]">
              {todayOutfit.score}%
            </span>
            {aiAnalysis?.totalScore != null && (
              <span className="text-sm text-gray-500">
                {t("recommendation.matchScore")}
              </span>
            )}
          </div>
        )}

        {/* History Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#161D16]">
              {t("recommendation.historyTitle")}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollHistory("left")}
                className="w-7 h-7 flex items-center justify-center rounded-full border border-[#BCCBB9] hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <ChevronLeft className={`w-4 h-4 text-[#161D16] ${isArabic ? "rotate-180" : ""}`} />
              </button>
              <button
                onClick={() => scrollHistory("right")}
                className="w-7 h-7 flex items-center justify-center rounded-full border border-[#BCCBB9] hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <ChevronRight className={`w-4 h-4 text-[#161D16] ${isArabic ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {historyLoading && history.length === 0 ? (
            <div className="flex items-center justify-center h-[200px]">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
            </div>
          ) : historyCards.length > 0 ? (
            <div
              ref={historyScrollRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {historyCards.map((entry) => {
                const outfit = entry.outfits?.[0] || null;
                const items = outfit?.items || [];
                const top = items.find((i) => i.category === "top" || i.category === "outerwear");
                const bottom = items.find((i) => i.category === "bottom");
                return (
                  <div
                    key={entry._id}
                    className="flex-shrink-0 w-[280px] bg-white border border-[#BCCBB9] rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-[322px] bg-[#EDF6EA] flex items-center justify-center p-6">
                      {outfit?.compositeImage ? (
                        <img
                          src={imgSrc(outfit.compositeImage)}
                          alt="History outfit"
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      ) : (
                        <div className="text-center">
                          <Sparkles className="w-10 h-10 text-gray-300 mx-auto" />
                        </div>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 bg-[#22C55E] rounded-lg px-2 py-1">
                      <span className="text-xs font-bold text-white">
                        {outfit?.score != null ? `${outfit.score}%` : t("recommendation.matched")}
                      </span>
                    </div>
                    <div className="p-4 relative">
                      {top && (
                        <p className="text-sm font-semibold text-[#161D16] tracking-wider truncate">
                          {top.name || t("recommendation.top")}
                        </p>
                      )}
                      {bottom && (
                        <p className="text-xs font-medium text-[#3D4A3D] truncate">
                          {bottom.name || t("recommendation.bottom")}
                        </p>
                      )}
                      {!top && !bottom && (
                        <p className="text-sm text-gray-400">{t("recommendation.savedOutfit")}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{formatDate(entry.created_at)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] bg-white border border-dashed border-[#BCCBB9] rounded-xl">
              <div className="text-center">
                <Heart className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm font-medium">
                  {t("recommendation.noHistory")}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Weekly Overview Section */}
        <section>
          <h2 className="text-2xl font-bold text-[#161D16] mb-6">
            {t("recommendation.weeklyTitle")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {weeklyOutfits.map((day) => (
              <div
                key={day.dayName}
                className={`rounded-xl p-4 text-center border transition-all ${
                  day.isToday
                    ? "bg-[#8ED321] border-[#8ED321] text-white"
                    : day.hasOutfit
                      ? "bg-white border-[#BCCBB9]"
                      : "bg-white border-dashed border-gray-200"
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className={`text-sm font-bold ${day.isToday ? "text-white" : "text-[#161D16]"}`}>
                    {getShortDay(day.dayName)}
                  </span>
                  {day.isToday && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20 text-white">
                      {t("recommendation.today")}
                    </span>
                  )}
                </div>
                <p className={`text-xs ${day.isToday ? "text-white/80" : "text-gray-400"}`}>
                  {formatDate(day.date)}
                </p>
                {day.hasOutfit ? (
                  <div className="mt-2">
                    <Sparkles className={`w-5 h-5 mx-auto ${day.isToday ? "text-white" : "text-lime-400"}`} />
                  </div>
                ) : (
                  <div className="mt-2">
                    <Sun className="w-5 h-5 mx-auto text-gray-200" />
                    <p className="text-[10px] text-gray-300 mt-1">{t("recommendation.noOutfitForDay")}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
