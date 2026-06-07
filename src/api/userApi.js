import api from "./axiosInstance";
export const getUserApi = (id) => api.get(`/users/${id}`);
export const updateProfileApi = (data) => api.put("/users/profile", data);