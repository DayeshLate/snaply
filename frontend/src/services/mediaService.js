import { apiClient } from './apiClient';
import { mockStore, isDemoMode } from '../mock/mockStore';

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

export const mediaService = {
  async uploadMedia(file, folderId) {
    if (isDemoMode()) {
      return mockStore.uploadMedia(file, folderId);
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', folderId);

    const response = await apiClient.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // MediaDTO
  },

  async getMediaById(mediaId) {
    if (isDemoMode()) {
      const found = mockStore.data.media.find((m) => m.id === Number(mediaId));
      if (!found) throw new Error('Media not found');
      return found;
    }
    const response = await apiClient.get(`/media/get/${mediaId}`);
    return response.data; // MediaDTO
  },

  async getAllMediaByFolder(folderId) {
    if (isDemoMode()) {
      return mockStore.getMediaByFolder(folderId);
    }
    const response = await apiClient.get(`/media/getAllMedia/${folderId}`);
    return response.data; // List<MediaDTO>
  },

  async getAllMediaByGroup(groupId) {
    if (isDemoMode()) {
      return mockStore.getMediaByGroup(groupId);
    }
    const response = await apiClient.get(`/media/group/${groupId}`);
    return response.data; // List<MediaDTO>
  },

  async getMediaCountByFolder(folderId) {
    if (isDemoMode()) {
      return mockStore.getMediaByFolder(folderId).length;
    }
    const response = await apiClient.get(`/media/getCount/${folderId}`);
    return response.data; // number
  },

  async deleteMedia(mediaId) {
    if (isDemoMode()) {
      return mockStore.deleteMedia(mediaId);
    }
    const response = await apiClient.delete(`/media/delete/${mediaId}`);
    return response.data;
  },

  getDownloadUrl(mediaId) {
    if (isDemoMode()) {
      const found = mockStore.data.media.find((m) => m.id === Number(mediaId));
      return found?.fileUrl || '#';
    }
    return `${baseURL}/media/download/${mediaId}`;
  },

  getStreamUrl(mediaId) {
    if (isDemoMode()) {
      const found = mockStore.data.media.find((m) => m.id === Number(mediaId));
      return found?.fileUrl || `/media/stream/${mediaId}`;
    }
    return `${baseURL}/media/stream/${mediaId}`;
  },
};
