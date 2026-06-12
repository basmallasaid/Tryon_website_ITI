import api from "./axiosInstance";

export const getWardrobeItems = async () => {
  const res = await api.get("/wardrobe");
  return res.data;
};

export const getWardrobeItemById = async (id) => {
  const res = await api.get(`/wardrobe/${id}`);
  return res.data;
};
