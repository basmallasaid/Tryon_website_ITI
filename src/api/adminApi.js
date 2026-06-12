import api from './axiosInstance';

export const getStoresApi = () => api.get('/stores');
export const getStoreByIdApi = (id) => api.get(`/stores/${id}`);
export const createStoreApi = (data) => api.post('/stores', data);
export const updateStoreApi = (id, data) => api.put(`/stores/${id}`, data);
export const deleteStoreApi = (id) => api.delete(`/stores/${id}`);

export const getProductsApi = (params) => api.get('/products', { params });
export const getStoreProductsApi = (storeId) => api.get(`/stores/${storeId}/products`);

export const getNotificationsApi = () => api.get('/notifications');
