import api from "./axiosInstance";

const MOCK_AVATAR = import.meta.env.VITE_MOCK_AVATAR === "true";

const MOCK_IMAGE = "https://i.pravatar.cc/400?u=avatar";

export const generateAvatarApi = (data) => {
  if (MOCK_AVATAR) {
    return Promise.resolve({
      data: { avatar: { image_url: MOCK_IMAGE } },
    });
  }
  return api.post("/avatars", data);
};
