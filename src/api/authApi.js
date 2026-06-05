import api from "./axiosInstance";

export const checkEmailApi = (email) => api.get(`/auth/check-email/${email}`);
export const loginApi = (data) => api.post("/auth/login", data);
export const registerApi = (data) => api.post("/auth/signup", data);
export const forgotPasswordApi = (data) => api.post("/auth/forgot-password", data);
export const otpVerifyApi = (data) => api.post("/auth/verify-otp", data);
export const sendVerificationApi = (data) => api.post("/auth/send-verification", data);
export const resetPasswordApi = (data) => api.put("/auth/reset-password", data);