import { apiClient } from './apiClient';

export const notificationService = {
  async getAll() {
    const response = await apiClient.get('/api/notifications');
    return response.data; // List<NotificationDTO>
  },

  async getUnread() {
    const response = await apiClient.get('/api/notifications/unread');
    return response.data; // List<NotificationDTO>
  },

  async getUnreadCount() {
    const response = await apiClient.get('/api/notifications/unread-count');
    return response.data?.unreadCount || 0;
  },

  async markAsRead(id) {
    const response = await apiClient.put(`/api/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await apiClient.put('/api/notifications/read-all');
    return response.data;
  },
};
