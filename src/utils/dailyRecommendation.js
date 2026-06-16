import { requestRecommendations } from "../api/recommendationsApi";
import { getAuth } from "./tokenUtils";

const DAILY_OUTFIT_DATE_KEY = "daily_outfit_date";
const DAILY_OUTFIT_DATA_KEY = "daily_outfit_data";

function dailyKey(key, userId) {
  return userId ? `${key}_${userId}` : key;
}

export function getLocalDateKey(dateOrString) {
  if (typeof dateOrString === "string") {
    const match = dateOrString.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) return `${match[1]}-${match[2]}-${match[3]}`;
    const d = new Date(dateOrString);
    if (isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  const y = dateOrString.getFullYear();
  const m = String(dateOrString.getMonth() + 1).padStart(2, "0");
  const d = String(dateOrString.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getUserId() {
  const auth = getAuth();
  return auth?._id || auth?.user?._id || null;
}

/**
 * Find today's entry in recommendation history by matching date.
 * Extracts YYYY-MM-DD from each entry's created_at and compares to today.
 * If multiple entries exist for the same date, returns the latest one.
 */
export function findTodayInHistory(history) {
  if (!history?.length) return null;

  const todayKey = getLocalDateKey(new Date());

  const todayEntries = history.filter((entry) => {
    const entryDate = entry.created_at || entry.createdAt;
    if (!entryDate) return false;
    const entryKey = getLocalDateKey(entryDate);
    return entryKey === todayKey;
  });

  if (todayEntries.length === 0) return null;

  const latest = todayEntries.reduce((a, b) => {
    const dateA = new Date(a.created_at || a.createdAt);
    const dateB = new Date(b.created_at || b.createdAt);
    return dateA > dateB ? a : b;
  });
  return latest;
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
