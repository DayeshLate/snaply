import { apiClient } from './apiClient';

export const driveService = {
  async getAuthUrl() {
    const response = await apiClient.get('/api/drive/auth-url');
    return response.data; // { authUrl }
  },

  async getStatus() {
    const response = await apiClient.get('/api/drive/status');
    return response.data; // { connected, googleEmail, googleId, driveRootFolderId }
  },

  async disconnect() {
    const response = await apiClient.post('/api/drive/disconnect');
    return response.data;
  },
};
