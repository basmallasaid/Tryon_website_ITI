import api from "./axiosInstance";

const KIE_API_KEY = import.meta.env.VITE_KIE_API_KEY || "";

export const virtualTryOnApi = (formData) =>
  api.post("/virtual-tryon", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(KIE_API_KEY && { "x-kie-api-key": KIE_API_KEY }),
    },
  });

export const virtualTryOnOutfitApi = (formData) =>
  api.post("/virtual-tryon/outfit", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(KIE_API_KEY && { "x-kie-api-key": KIE_API_KEY }),
    },
  });
