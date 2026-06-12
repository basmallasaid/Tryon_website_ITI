import api from "../axiosInstance";
import { getProductById } from "../userApi";
import { getWardrobeItemById } from "../wardrobeService";

const normalizeId = (id) => id?.$oid ?? id;

export const getFavorites = async () => {
  const res = await api.get("/users/favorites");
  console.log("GET /users/favorites response:", JSON.stringify(res.data, null, 2));
  return res.data;
};

export const addFavorite = async (itemId, itemType) => {
  const res = await api.post("/users/favorites", { itemId, itemType });
  console.log("POST /users/favorites response:", JSON.stringify(res.data, null, 2));
  return res.data;
};

export const removeFavorite = async (id) => {
  const res = await api.delete(`/users/favorites/${id}`);
  console.log("DELETE /users/favorites response:", JSON.stringify(res.data, null, 2));
  return res.data;
};

export const fetchItemDetails = async (itemId, itemType) => {
  const id = normalizeId(itemId);
  if (itemType === "PRODUCT") {
    const res = await getProductById(id);
    const product = res?.data ?? res;
    return { image: product.images?.[0], name: product.name, category: "Store" };
  }
  if (itemType === "WARDROBE") {
    const res = await getWardrobeItemById(id);
    const item = res?.data ?? res;
    return { image: item.image, name: item.name, category: "Wardrobe" };
  }
  return { image: null, name: null, category: null };
};
