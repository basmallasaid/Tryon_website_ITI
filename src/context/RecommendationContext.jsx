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

const RecommendationContext = createContext();

const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes between server fetches

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
  const postMadeForDateRef = useRef(null); // Tracks which date the POST was made for

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

  /**
   * Merge composite_image from entry level onto the outfit object.
   * Mongoose strict mode strips compositeImage from outfits subdocuments,
   * but saves composite_image at the Recommendation document level.
   */
  const mergeCompositeImage = useCallback((entry) => {
    if (!entry?.outfits?.[0]) return null;
    const outfit = entry.outfits[0];
    return {
      ...outfit,
      composite_image: outfit.compositeImage || entry.composite_image || null,
    };
  }, []);

  /**
   * Fetch full history from server, cache in IndexedDB.
   */
  const fetchHistory = useCallback(async (userId) => {
    try {
      console.log("[Recommendation] GET /recommendations — fetching history");
      const data = await getAllRecommendations();
      const entries = data.history || [];
      console.log("[Recommendation] Server returned", entries.length, "history entries");
      if (entries.length > 0) {
        entries.forEach((e) => {
          console.log("[Recommendation]   _id=", e._id, "created_at=", e.created_at, "outfits=", e.outfits?.length);
        });
      }
      setHistory(entries);
      if (userId) saveRecommendations(userId, entries).catch(() => {});
      return entries;
    } catch (err) {
      console.error("[Recommendation] GET /recommendations failed:", err.message);
      return [];
    }
  }, []);

  /**
   * Main entry point: fetch today's recommendation.
   *
   * Flow:
   * 1. Cooldown — skip if fetched within 5 min
   * 2. Try IndexedDB cache for instant display
   * 3. GET /recommendations → fetch full history from server
   * 4. Find today's entry by matching created_at date to today
   * 5. If found → set outfit, cache in IndexedDB, done
   * 6. If not found + before 6 AM → set null (empty card), done
   * 7. If not found + after 6 AM + no POST today → POST /recommendations
   * 8. On error → fall back to local cache
   */
  const fetchDailyRecommendation = useCallback(async () => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;

    // Cooldown check
    if (lastFetchTimeRef.current > 0 && timeSinceLastFetch < COOLDOWN_MS) {
      const remaining = Math.round((COOLDOWN_MS - timeSinceLastFetch) / 1000);
      console.log("[Recommendation] Cooldown active —", remaining, "s remaining, skipping fetch");
      setLoading(false);
      return;
    }

    const userId = user?.id || user?._id;
    const hour = new Date().getHours();
    const todayKey = getLocalDateKey(new Date());

    console.log("[Recommendation] checkAndFetchDaily — today=", todayKey, "hour=", hour, "userId=", userId ? String(userId).substring(0, 8) : null);

    if (!userId) {
      console.log("[Recommendation] No userId — clearing state");
      setTodaysOutfit(null);
      setTodaysWeather(null);
      setHistory([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // ── Step 1: Try IndexedDB cache for instant display ──
      try {
        const cachedRecs = await getRecommendations(userId);
        if (cachedRecs?.length) {
          console.log("[Recommendation] IndexedDB cache hit —", cachedRecs.length, "entries");
          const cachedToday = findTodayInHistory(cachedRecs);
          if (cachedToday?.outfits?.[0]) {
            console.log("[Recommendation] Serving from IndexedDB cache (instant)");
            const outfit = mergeCompositeImage(cachedToday);
            const translated = await translateIfNeeded(outfit);
            setTodaysOutfit(translated);
            setTodaysWeather(cachedToday.weather || null);
            setHistory(cachedRecs);
            setLoading(false);
            // Continue to fetch from server in background for freshness
          } else {
            console.log("[Recommendation] No today entry in IndexedDB cache");
          }
        } else {
          console.log("[Recommendation] IndexedDB cache empty");
        }
      } catch (err) {
        console.log("[Recommendation] IndexedDB unavailable:", err.message);
      }

      // ── Step 2: GET history from server ──
      const historyData = await fetchHistory(userId);

      // ── Step 3: Find today in server history ──
      const todayEntry = findTodayInHistory(historyData);

      if (todayEntry?.outfits?.[0]) {
        // Match found — use server data (cross-device safe, no POST needed)
        console.log("[Recommendation] Using server history entry for today — POST not called");
        const outfit = mergeCompositeImage(todayEntry);
        const translated = await translateIfNeeded(outfit);
        setTodaysOutfit(translated);
        setTodaysWeather(todayEntry.weather || null);
        lastFetchTimeRef.current = Date.now();
        setLoading(false);
        return;
      }

      // ── Step 4: No today match — check hour ──
      console.log("[Recommendation] No match for", todayKey, "in history");

      if (hour < 6) {
        // Before 6 AM — do NOT show old outfit as placeholder
        console.log("[Recommendation] Before 6AM — showing empty card (no outfit yet)");
        setTodaysOutfit(null);
        setTodaysWeather(null);
        lastFetchTimeRef.current = Date.now();
        setLoading(false);
        return;
      }

      // ── Step 5: After 6 AM — need a recommendation ──
      // Guard: only POST once per calendar day
      if (postMadeForDateRef.current === todayKey) {
        console.log("[Recommendation] POST already made for", todayKey, "— skipping duplicate");
        lastFetchTimeRef.current = Date.now();
        setLoading(false);
        return;
      }

      console.log("[Recommendation] No today match + after 6AM — POSTing new recommendation");
      try {
        const result = await fetchAndCacheDailyOutfit();
        postMadeForDateRef.current = todayKey;

        if (result?.outfits?.[0]) {
          // POST response: { outfits: [{ compositeImage, items, ... }], weather: {...} }
          const outfit = {
            ...result.outfits[0],
            composite_image: result.outfits[0]?.compositeImage || null,
          };
          const translated = await translateIfNeeded(outfit);
          setTodaysOutfit(translated);
          setTodaysWeather(result.weather || null);

          // Append synthetic entry to history for UI (avoids redundant GET)
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

          console.log("[Recommendation] POST successful — outfit set + synthetic entry added to history");
        } else {
          console.log("[Recommendation] POST returned empty outfit");
        }
      } catch (postErr) {
        console.error("[Recommendation] POST /recommendations failed:", postErr.message);
        // Fallback: try localStorage cache
        const cached = getCachedDailyOutfit();
        if (cached?.outfits?.[0]) {
          console.log("[Recommendation] Falling back to localStorage cache");
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
      console.error("[Recommendation] fetchDailyRecommendation error:", err);
      // Last resort: try any local cache
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
      } catch { /* offline, nothing to serve */ }
    } finally {
      setLoading(false);
    }
  }, [fetchHistory, user, translateIfNeeded, mergeCompositeImage]);

  useEffect(() => {
    if (user) {
      translatedRef.current = {};
      // Reset POST guard for new user or new day
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
