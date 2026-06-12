import api from "./axiosInstance";
export const getUserApi = (id) => api.get(`/users/${id}`);
export const updateUserSettingsLanguageApi = (language) =>
  api.put("/users/settings/language", { language });
export const updateUserSettingsNotificationsApi = (enabled) =>
  api.put("/users/settings/notifications", { enabled });
export const updateProfileApi = (data) => api.put("/users/profile", data);
export const getSettingsApi = (data) => api.post("/users/settings", data);
export const getAllProducts = () => api.get("/products");
export const getAllStores = () => api.get("/stores");
export const getProductById = (id) => api.get(`/products/${id}`);
export const deleteUserAccountApi = (email) =>
  api.delete("/users/account", { data: { email } });
export const getProductMatchesApi = (productId) => api.post(`/matches/product/${productId}`);
export const getWardrobeApi = () => api.get("/wardrobe");
export const addWardrobeItemFromAnalysisApi = (analysis_id, data = {}) =>
  api.post("/wardrobe/from-analysis", { analysis_id, ...data });
export const deleteWardrobeItemApi = (id) => api.delete(`/wardrobe/${id}`);
export const updateWardrobeItemApi = (id, data) => api.put(`/wardrobe/${id}`, data);
export const analyzeImageApi = (formData) =>
  api.post("/analyze", formData, { timeout: 60000 });
export const getAnalysisApi = (id) => api.get(`/analyze/${id}`);
export const updateAnalysisApi = (id, data) => api.put(`/analyze/${id}`, data);