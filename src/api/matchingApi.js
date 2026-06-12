import api from "./axiosInstance";

export const getWardrobeMatches = async (wardrobeItemId) => {
  const response = await api.post("/matches", { wardrobe_item_id: wardrobeItemId });
  return response.data;
};

export const analyzeImage = async (formData) => {
  const response = await api.post("/analyze", formData, {
    timeout: 60000,
  });
  return response.data;
};

export const getMatchesByAnalysis = async (analysisId, lat, lon) => {
  const body = {};
  if (lat !== undefined && lon !== undefined) {
    body.lat = lat;
    body.lon = lon;
  }
  const response = await api.post(`/matches/analysis/${analysisId}`, body);
  return response.data;
};
