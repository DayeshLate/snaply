import { apiClient } from './apiClient';
import { mockStore, isDemoMode } from '../mock/mockStore';

export const driveService = {
  async getAuthUrl() {
    if (isDemoMode()) {
      return { authUrl: '/settings?drive=connected&email=demo.user@gmail.com' };
    }
    const response = await apiClient.get('/api/drive/auth-url');
    return response.data; // { authUrl }
  },

  async getStatus() {
    if (isDemoMode()) {
      return mockStore.getDriveStatus();
    }
    const response = await apiClient.get('/api/drive/status');
    return response.data; // { connected, googleEmail, googleId, driveRootFolderId }
  },

  async disconnect() {
    if (isDemoMode()) {
      return mockStore.disconnectDrive();
    }
    const response = await apiClient.post('/api/drive/disconnect');
    return response.data;
  },
};
