import api from "./axiosInstance";

export const generateAvatarApi = (data) =>
  api.post("/avatars", data);
