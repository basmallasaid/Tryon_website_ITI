import api from "./axiosInstance";

export const virtualTryOnApi = (formData) =>
  api.post("/virtual-tryon", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const virtualTryOnOutfitApi = (formData) =>
  api.post("/virtual-tryon/outfit", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
