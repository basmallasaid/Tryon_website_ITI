import api from "./axiosInstance";
export const getUserApi = (id) => api.get(`/users/${id}`);
export const updateProfileApi = (data) => api.put("/users/profile", data);
export const getAllProducts = () => api.get("/products");
export const getAllStores = () => api.get("/stores");
export const getProductById = (id) => api.get(`/products/${id}`);