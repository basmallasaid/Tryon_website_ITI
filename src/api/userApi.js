import api from "./axiosInstance";
export const getUserApi = (id) => api.get(`/users/${id}`);
export const updateUserSettingsLanguageApi = (language) =>
  api.put("/users/settings/language", { language });
export const updateUserSettingsNotificationsApi = (enabled) =>
  api.put("/users/settings/notifications", { enabled });
export const updateProfileApi = (data) => api.put("/users/profile", data);
export const getAllProducts = () => api.get("/products");
export const getAllStores = () => api.get("/stores");
export const getProductById = (id) => api.get(`/products/${id}`);
export const deleteUserAccountApi = (email) =>
  api.delete("/users/account", { data: { email } });
