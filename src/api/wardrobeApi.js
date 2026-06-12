import api from "./axiosInstance";

export const getWardrobeApi = () => api.get("/wardrobe");
