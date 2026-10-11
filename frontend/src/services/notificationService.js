import { apiClient } from './apiClient';
import { mockStore, isDemoMode } from '../mock/mockStore';

export const notificationService = {
  async getAll() {
    if (isDemoMode()) {
      return mockStore.getNotifications();
    }
    const response = await apiClient.get('/api/notifications');
    return response.data; // List<NotificationDTO>
  },

  async getUnread() {
    if (isDemoMode()) {
      return mockStore.getUnreadNotifications();
    }
    const response = await apiClient.get('/api/notifications/unread');
    return response.data; // List<NotificationDTO>
  },

  async getUnreadCount() {
    if (isDemoMode()) {
      return mockStore.getUnreadCount();
    }
    const response = await apiClient.get('/api/notifications/unread-count');
    return response.data?.unreadCount || 0;
  },

  async markAsRead(id) {
    if (isDemoMode()) {
      return mockStore.markNotificationAsRead(id);
    }
    const response = await apiClient.put(`/api/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead() {
    if (isDemoMode()) {
      return mockStore.markAllNotificationsAsRead();
    }
    const response = await apiClient.put('/api/notifications/read-all');
    return response.data;
  },
};
