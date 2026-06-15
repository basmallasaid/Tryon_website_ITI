import api from "./axiosInstance";

export const getAllRecommendations = async (limit = 20, skip = 0) => {
  const { data } = await api.get("/recommendations", { params: { limit, skip } });
  return data;
};

export const requestRecommendations = async (lat = 30.0444, lon = 31.2357) => {
  const { data } = await api.post("/recommendations", { limit: 1, lat, lon });
  return data;
};
