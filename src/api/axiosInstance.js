import axios from "axios";
import { getAuth } from "../utils/tokenUtils";
import i18n from "../i18n/i18n";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const auth = getAuth();
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  config.headers["Accept-Language"] = i18n.language || "en";
  return config;
});

export default api;