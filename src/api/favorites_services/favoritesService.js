import api from "../axiosInstance";
import { getAllProducts } from "../userApi";
import { getWardrobeItems } from "../wardrobeService";

const normalizeId = (id) => id?.$oid ?? id;
const normalizeDocId = (doc) => normalizeId(doc._id ?? doc.id);

export const getFavorites = async () => {
  const res = await api.get("/users/favorites");
  return res.data;
};

export const addFavorite = async (itemId, itemType) => {
  const res = await api.post("/users/favorites", { itemId, itemType });
  return res.data;
};

export const removeFavorite = async (favoriteDocId) => {
  const res = await api.delete(`/users/favorites/${favoriteDocId}`);
  return res.data;
};

const fetchList = async (url, dataKey) => {
  const res = await api.get(url).catch(() => null);
  const body = res?.data ?? res;
  return Array.isArray(body) ? body : body?.[dataKey] ?? [];
};

export const fetchEnrichmentData = async () => {
  const [wardrobeRes, productsRes, tryonList, recycleList] = await Promise.all([
    getWardrobeItems().catch(() => null),
    getAllProducts().catch(() => null),
    fetchList("/users/latest-tryon", "latestTryOn"),
    fetchList("/users/latest-recycle", "latestRecycle"),
  ]);

  const wardrobeList = Array.isArray(wardrobeRes) ? wardrobeRes : wardrobeRes?.items ?? [];
  const wardrobeMap = {};
  wardrobeList.forEach((item) => { wardrobeMap[normalizeDocId(item)] = item; });

  const productsData = productsRes?.data ?? productsRes;
  const productsList = Array.isArray(productsData) ? productsData : productsData?.products ?? [];
  const productsMap = {};
  productsList.forEach((p) => { productsMap[normalizeDocId(p)] = p; });

  const tryonMap = {};
  tryonList.forEach((item) => { tryonMap[normalizeDocId(item)] = item; });

  const recycleMap = {};
  recycleList.forEach((item) => { recycleMap[normalizeDocId(item)] = item; });

  return { wardrobeMap, productsMap, tryonMap, recycleMap };
};

export const enrichFavorite = (fav, maps) => {
  const { wardrobeMap, productsMap, tryonMap, recycleMap } = maps;
  const id = normalizeId(fav.itemId);

  if (fav.itemType === "WARDROBE") {
    const item = wardrobeMap[id];
    if (!item) return { ...fav, image: null, name: null, category: "Wardrobe" };
    return { ...fav, image: item.image, name: item.name, category: "Wardrobe" };
  }

  if (fav.itemType === "PRODUCT") {
    const product = productsMap[id];
    if (!product) return { ...fav, image: null, name: null, category: "Store" };
    return { ...fav, image: product.images?.[0] || product.image, name: product.name, category: "Store" };
  }

  if (fav.itemType === "TRYON") {
    const tryonItem = tryonMap[id];
    if (tryonItem) {
      return { ...fav, image: tryonItem.imageUrl ?? tryonItem.image, name: tryonItem.name ?? "Try-On", category: "Try On" };
    }
    const recycleItem = recycleMap[id];
    if (recycleItem) {
      return { ...fav, image: recycleItem.imageUrl ?? recycleItem.image, name: recycleItem.designTitle ?? recycleItem.name ?? "Recycle", category: "Recycle" };
    }
    return { ...fav, image: null, name: null, category: "Try On" };
  }

  return { ...fav, image: null, name: null, category: null };
};
