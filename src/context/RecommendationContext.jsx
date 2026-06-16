import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { getAllRecommendations } from "../api/recommendationsApi";
import { getRecommendations, saveRecommendations } from "../services/indexedDB";
import {
  findTodayInHistory,
  getLocalDateKey,
  getCachedDailyOutfit,
  fetchAndCacheDailyOutfit,
} from "../utils/dailyRecommendation";
import { translateOutfit } from "../utils/translate";

const COOLDOWN_MS = 5 * 60 * 1000;

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
  const lastFetchTimeRef = useRef(0);
  const postMadeForDateRef = useRef(null);
  const isFetchingRef = useRef(false);

  const setLanguage = useCallback((lang) => {
    isArabicRef.current = lang === "ar";
  }, []);

  const translateIfNeeded = useCallback(async (outfit) => {
    if (!isArabicRef.current || !outfit) return outfit;
    const cacheKey = outfit.compositeImage || outfit.composite_image || outfit.items?.[0]?.name || "";
    if (translatedRef.current[cacheKey]) return translatedRef.current[cacheKey];
    const translated = await translateOutfit(outfit);
    translatedRef.current[cacheKey] = translated;
    return translated;
  }, []);

  const fetchHistory = useCallback(async (userId) => {
    try {
      const data = await getAllRecommendations();
      const entries = data.history || [];
      setHistory(entries);
      if (userId) saveRecommendations(userId, entries).catch(() => {});
      return entries;
    } catch {
      return [];
    }
  }, []);

  const mergeCompositeImage = useCallback((entry) => {
    if (!entry?.outfits?.[0]) return null;
    const outfit = entry.outfits[0];
    return {
      ...outfit,
      composite_image: outfit.compositeImage || entry.composite_image || null,
    };
  }, []);

  const fetchDailyRecommendation = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;

    if (lastFetchTimeRef.current > 0 && timeSinceLastFetch < COOLDOWN_MS) {
      isFetchingRef.current = false;
      setLoading(false);
      return;
    }

    const userId = user?.id || user?._id;
    const hour = new Date().getHours();
    const todayKey = getLocalDateKey(new Date());

    if (!userId) {
      isFetchingRef.current = false;
      setTodaysOutfit(null);
      setTodaysWeather(null);
      setHistory([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      try {
        const cachedRecs = await getRecommendations(userId);
        if (cachedRecs?.length) {
          const cachedToday = findTodayInHistory(cachedRecs);
          if (cachedToday?.outfits?.[0]) {
            const outfit = mergeCompositeImage(cachedToday);
            const translated = await translateIfNeeded(outfit);
            setTodaysOutfit(translated);
            setTodaysWeather(cachedToday.weather || null);
            setHistory(cachedRecs);
            setLoading(false);
          }
        }
      } catch { /* IndexedDB unavailable */ }

      const historyData = await fetchHistory(userId);

      const todayEntry = findTodayInHistory(historyData);

      if (todayEntry?.outfits?.[0]) {
        const outfit = mergeCompositeImage(todayEntry);
        const translated = await translateIfNeeded(outfit);
        setTodaysOutfit(translated);
        setTodaysWeather(todayEntry.weather || null);
        lastFetchTimeRef.current = Date.now();
        setLoading(false);
        return;
      }

      if (hour < 6) {
        setTodaysOutfit(null);
        setTodaysWeather(null);
        lastFetchTimeRef.current = Date.now();
        setLoading(false);
        return;
      }

      if (postMadeForDateRef.current === todayKey) {
        lastFetchTimeRef.current = Date.now();
        setLoading(false);
        return;
      }

      const cached = getCachedDailyOutfit();
      if (cached?.outfits?.[0]) {
        postMadeForDateRef.current = todayKey;
        const outfit = {
          ...cached.outfits[0],
          composite_image: cached.outfits[0]?.compositeImage || cached.composite_image || null,
        };
        const translated = await translateIfNeeded(outfit);
        setTodaysOutfit(translated);
        setTodaysWeather(cached.weather || null);
        lastFetchTimeRef.current = Date.now();
        setLoading(false);
        return;
      }

      try {
        const result = await fetchAndCacheDailyOutfit();
        postMadeForDateRef.current = todayKey;

        if (result?.outfits?.[0]) {
          const outfit = {
            ...result.outfits[0],
            composite_image: result.outfits[0]?.compositeImage || null,
          };
          const translated = await translateIfNeeded(outfit);
          setTodaysOutfit(translated);
          setTodaysWeather(result.weather || null);

          const syntheticEntry = {
            _id: "today_" + todayKey,
            outfits: result.outfits,
            weather: result.weather,
            composite_image: result.outfits[0]?.compositeImage || null,
            created_at: new Date().toISOString(),
          };
          setHistory((prev) => {
            const updated = [...prev, syntheticEntry];
            if (userId) saveRecommendations(userId, updated).catch(() => {});
            return updated;
          });
        }
      } catch {
        const cached = getCachedDailyOutfit();
        if (cached?.outfits?.[0]) {
          const outfit = {
            ...cached.outfits[0],
            composite_image: cached.outfits[0]?.compositeImage || cached.composite_image || null,
          };
          const translated = await translateIfNeeded(outfit);
          setTodaysOutfit(translated);
          setTodaysWeather(cached.weather || null);
        } else {
          setError("Failed to fetch recommendation. Please try again.");
        }
      }

      lastFetchTimeRef.current = Date.now();
    } catch (err) {
      console.error("[RecommendationContext]", err);
      try {
        const cached = getCachedDailyOutfit();
        if (cached?.outfits?.[0]) {
          const outfit = {
            ...cached.outfits[0],
            composite_image: cached.outfits[0]?.compositeImage || cached.composite_image || null,
          };
          const translated = await translateIfNeeded(outfit);
          setTodaysOutfit(translated);
          setTodaysWeather(cached.weather || null);
        }
      } catch { /* offline */ }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [fetchHistory, user, translateIfNeeded, mergeCompositeImage]);

  useEffect(() => {
    if (user) {
      translatedRef.current = {};
      const todayKey = getLocalDateKey(new Date());
      if (postMadeForDateRef.current !== todayKey) {
        postMadeForDateRef.current = null;
      }
      fetchDailyRecommendation();
    } else {
      setTodaysOutfit(null);
      setTodaysWeather(null);
      setHistory([]);
      setLoading(false);
      lastFetchTimeRef.current = 0;
      translatedRef.current = {};
      postMadeForDateRef.current = null;
    }
  }, [user, fetchDailyRecommendation]);

  const refetch = useCallback(async () => {
    lastFetchTimeRef.current = 0;
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
