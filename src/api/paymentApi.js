import api from "./axiosInstance";

export const createCheckoutSessionApi = (data) => api.post("/payments/create-checkout-session", data);
export const cancelSubscriptionApi = (data) => api.post("/payments/cancel-subscription", data);
export const syncSubscriptionApi = (data) => api.post("/payments/sync-subscription", data);
