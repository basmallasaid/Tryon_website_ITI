import api from './axiosInstance';

export const getStoresApi = () => api.get('/stores');
export const getStoreByIdApi = (id) => api.get(`/stores/${id}`);
export const createStoreApi = (data) => api.post('/stores', data);
export const updateStoreApi = (id, data) => api.put(`/stores/${id}`, data);
export const deleteStoreApi = (id) => api.delete(`/stores/${id}`);

export const getProductsApi = (params) => api.get('/products', { params });
export const getStoreProductsApi = (storeId) => api.get(`/stores/${storeId}/products`);
export const createProductApi = (data) => api.post('/products', data);
export const updateProductApi = (id, data) => api.put(`/products/${id}`, data);
export const deleteProductApi = (id) => api.delete(`/products/${id}`);

export const getNotificationsApi = () => api.get('/notifications');
export const getAllNotificationsApi = () => api.get('/notifications/all');
export const broadcastNotificationApi = (data) => api.post('/notifications/broadcast', data);
export const sendToUserNotificationApi = (data) => api.post('/notifications/send-to-user', data);
export const deleteNotificationApi = (id) => api.delete(`/notifications/${id}`);

export const getUsersApi = () => api.get('/users');
export const getUserStatsApi = () => api.get('/users/stats');
export const createAdminUserApi = (data) => api.post('/users', data);
export const deleteUserApi = (id) => api.delete(`/users/${id}`);
export const markUserNotifiedApi = (id) => api.patch(`/users/${id}/mark-notified`);
export const updateUserApi = (id, data) => api.put(`/users/${id}`, data);

export const submitContactApi = (data) => api.post('/contact', data);
export const getContactMessagesApi = () => api.get('/contact');
export const markContactReadApi = (id) => api.put(`/contact/${id}/read`);
export const deleteContactApi = (id) => api.delete(`/contact/${id}`);

export const getApiKeysApi = () => api.get('/api-keys');
export const getApiKeyByIdApi = (id) => api.get(`/api-keys/${id}`);
export const updateApiKeyApi = (id, data) => api.put(`/api-keys/${id}`, data);
export const deleteApiKeyApi = (id) => api.delete(`/api-keys/${id}`);

export const getEmailsApi = (page = 1, limit = 50) => api.get('/emails/admin/all', { params: { page, limit } });
export const getEmailThreadApi = (parentEmailId) => api.get(`/emails/admin/thread/${parentEmailId}`);
export const replyToEmailApi = (parentEmailId, data) => api.post(`/emails/admin/reply/${parentEmailId}`, data);
export const markEmailReadApi = (id, isRead = true) => api.patch(`/emails/admin/mark-read/${id}`, { isRead });
export const markAllEmailsReadApi = () => api.patch('/emails/admin/mark-all-read');
export const getEmailUnreadCountApi = () => api.get('/emails/admin/unread-count');
export const sendEmailToUserApi = (data) => api.post('/emails/admin/send-to-user', data);

export const getAutomatedNotificationsApi = () => api.get('/automated-notifications');
export const updateAutomatedNotificationApi = (operation, data) => api.put(`/automated-notifications/${operation}`, data);

export const getScheduledNotificationsApi = () => api.get('/notifications/scheduled');
export const cancelScheduledNotificationApi = (id) => api.delete(`/notifications/scheduled/${id}`);
