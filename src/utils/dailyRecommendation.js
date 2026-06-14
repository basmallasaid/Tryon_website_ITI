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

export async function fetchAndCacheDailyOutfit() {
  const result = await requestRecommendations();

  if (result?.outfits?.length) {
    const userId = getUserId();
    const today = getLocalDateKey(new Date());
    localStorage.setItem(dailyKey(DAILY_OUTFIT_DATE_KEY, userId), today);
    localStorage.setItem(dailyKey(DAILY_OUTFIT_DATA_KEY, userId), JSON.stringify(result));
  }

  return result;
}

export function clearDailyOutfitCache() {
  const userId = getUserId();
  localStorage.removeItem(dailyKey(DAILY_OUTFIT_DATE_KEY, userId));
  localStorage.removeItem(dailyKey(DAILY_OUTFIT_DATA_KEY, userId));
}
