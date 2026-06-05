import api from "./axiosInstance";
export const updateProfileApi = (data) => api.put("/users/profile", data);