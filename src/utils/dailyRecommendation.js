import { requestRecommendations } from "../api/recommendationsApi";
import { getAuth } from "./tokenUtils";

const DAILY_OUTFIT_DATE_KEY = "daily_outfit_date";
const DAILY_OUTFIT_DATA_KEY = "daily_outfit_data";

function dailyKey(key, userId) {
  return userId ? `${key}_${userId}` : key;
}

function getLocalDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getUserId() {
  const auth = getAuth();
  return auth?._id || auth?.user?._id || null;
}

/**
 * Check if the most recent recommendation in history is within 24 hours.
 * Returns the today's entry if found, null otherwise.
 */
export function getRecentRecommendationFromHistory(history) {
  if (!history || !history.length) return null;

  const sorted = [...history].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const latest = sorted[0];
  if (!latest?.created_at) return null;

  const latestDate = new Date(latest.created_at);
  const now = new Date();
  const diffMs = now - latestDate;
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    return latest;
  }

  return null;
}

/**
 * Get cached daily outfit from localStorage.
 * Only returns if the cached date matches today.
 */
export function getCachedDailyOutfit() {
  const userId = getUserId();
  const today = getLocalDateKey(new Date());
  const cachedDate = localStorage.getItem(dailyKey(DAILY_OUTFIT_DATE_KEY, userId));
  const cachedData = localStorage.getItem(dailyKey(DAILY_OUTFIT_DATA_KEY, userId));

  if (cachedDate === today && cachedData) {
    try {
      return JSON.parse(cachedData);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Save outfit data to localStorage cache with today's date.
 */
export function cacheDailyOutfit(data) {
  if (!data?.outfits?.length) return;
  const userId = getUserId();
  const today = getLocalDateKey(new Date());
  localStorage.setItem(dailyKey(DAILY_OUTFIT_DATE_KEY, userId), today);
  localStorage.setItem(dailyKey(DAILY_OUTFIT_DATA_KEY, userId), JSON.stringify(data));
}

/**
 * POST new recommendation and cache the result.
 */
export async function fetchAndCacheDailyOutfit() {
  const result = await requestRecommendations();
  cacheDailyOutfit(result);
  return result;
}

export function clearDailyOutfitCache() {
  const userId = getUserId();
  localStorage.removeItem(dailyKey(DAILY_OUTFIT_DATE_KEY, userId));
  localStorage.removeItem(dailyKey(DAILY_OUTFIT_DATA_KEY, userId));
}
