import api from "./axiosInstance";

export const generateAvatarApi = (data) =>
  api.post("/avatars", data);

export const getAvatarsApi = () =>
  api.get("/avatars");

export const getAvatarByIdApi = (id) =>
  api.get(`/avatars/${id}`);

export const getAvatarImageApi = (id) =>
  api.get(`/avatars/${id}/image`, { responseType: "blob" });
