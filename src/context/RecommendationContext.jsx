import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { getAllRecommendations } from "../api/recommendationsApi";
import {
  getRecentRecommendationFromHistory,
  getCachedDailyOutfit,
  fetchAndCacheDailyOutfit,
} from "../utils/dailyRecommendation";
import { translateOutfit } from "../utils/translate";

const RecommendationContext = createContext();

export function RecommendationProvider({ children }) {
  const { user } = useAuth();
  const [todaysOutfit, setTodaysOutfit] = useState(null);
  const [todaysWeather, setTodaysWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isArabicRef = useRef(false);
  const translatedRef = useRef({});
  const fetchedRef = useRef(false);

  const setLanguage = useCallback((lang) => {
    isArabicRef.current = lang === "ar";
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const data = await getAllRecommendations();
      const entries = data.history || [];
      setHistory(entries);
      return entries;
    } catch {
      return [];
    }
  }, []);

  const fetchDailyRecommendation = useCallback(async () => {
    if (fetchedRef.current) {
      setLoading(false);
      return;
    }

    const doArabic = isArabicRef.current;

    const translateIfNeeded = async (outfit) => {
      if (!doArabic || !outfit) return outfit;
      const cacheKey = outfit.compositeImage || outfit.items?.[0]?.name || "";
      if (translatedRef.current[cacheKey]) return translatedRef.current[cacheKey];
      const translated = await translateOutfit(outfit);
      translatedRef.current[cacheKey] = translated;
      return translated;
    };

    try {
      setLoading(true);
      setError(null);

      const historyData = await fetchHistory();

      const recentFromHistory = getRecentRecommendationFromHistory(historyData);
      if (recentFromHistory?.outfits?.[0]) {
        const translated = await translateIfNeeded(recentFromHistory.outfits[0]);
        setTodaysOutfit(translated);
        setTodaysWeather(recentFromHistory.weather || recentFromHistory.outfits[0]?.weather || null);
        fetchedRef.current = true;
        return;
      }

      const cached = getCachedDailyOutfit();
      if (cached?.outfits?.[0]) {
        const translated = await translateIfNeeded(cached.outfits[0]);
        setTodaysOutfit(translated);
        setTodaysWeather(cached.weather || cached.outfits[0]?.weather || null);
        fetchedRef.current = true;
        return;
      }

      try {
        const result = await fetchAndCacheDailyOutfit();
        if (result?.outfits?.[0]) {
          const translated = await translateIfNeeded(result.outfits[0]);
          setTodaysOutfit(translated);
          setTodaysWeather(result.weather || result.outfits[0]?.weather || null);
        }
        await fetchHistory();
        fetchedRef.current = true;
      } catch {
        setError("Failed to fetch recommendation. Please try again.");
      }
    } catch (err) {
      console.error("[RecommendationContext]", err);
    } finally {
      setLoading(false);
    }
  }, [fetchHistory]);

  useEffect(() => {
    if (user) {
      fetchedRef.current = false;
      translatedRef.current = {};
      fetchDailyRecommendation();
    } else {
      setTodaysOutfit(null);
      setTodaysWeather(null);
      setHistory([]);
      setLoading(false);
      fetchedRef.current = false;
      translatedRef.current = {};
    }
  }, [user, fetchDailyRecommendation]);

  const refetch = useCallback(async () => {
    fetchedRef.current = false;
    translatedRef.current = {};
    await fetchDailyRecommendation();
  }, [fetchDailyRecommendation]);

  return (
    <RecommendationContext.Provider
      value={{
        todaysOutfit,
        todaysWeather,
        history,
        loading,
        error,
        setLanguage,
        refetch,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
}

export function useRecommendation() {
  return useContext(RecommendationContext);
}
