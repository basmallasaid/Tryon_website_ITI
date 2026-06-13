import api from "./axiosInstance";

export const analyzeRecycleApi = (formData) =>
  api.post("/recycle/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const generateRecycleIdeaApi = (sessionId, ideaId, model, aspectRatio) =>
  api.post(`/recycle/${sessionId}/generate/${ideaId}`, { model, aspect_ratio: aspectRatio });

export const generateAllRecycleIdeasApi = (sessionId, model) =>
  api.post(`/recycle/${sessionId}/generate-all`, { model });

export const getRecycleSessionApi = (sessionId) =>
  api.get(`/recycle/${sessionId}`);
