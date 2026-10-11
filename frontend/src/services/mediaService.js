import { apiClient } from './apiClient';

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

export const mediaService = {
  async uploadMedia(file, folderId) {
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
    const response = await apiClient.get(`/media/get/${mediaId}`);
    return response.data; // MediaDTO
  },

  async getAllMediaByFolder(folderId) {
    const response = await apiClient.get(`/media/getAllMedia/${folderId}`);
    return response.data; // List<MediaDTO>
  },

  async getAllMediaByGroup(groupId) {
    const response = await apiClient.get(`/media/group/${groupId}`);
    return response.data; // List<MediaDTO>
  },

  async getMediaCountByFolder(folderId) {
    const response = await apiClient.get(`/media/getCount/${folderId}`);
    return response.data; // number
  },

  async deleteMedia(mediaId) {
    const response = await apiClient.delete(`/media/delete/${mediaId}`);
    return response.data;
  },

  getDownloadUrl(mediaId) {
    return `${baseURL}/media/download/${mediaId}`;
  },

  getStreamUrl(mediaId) {
    return `${baseURL}/media/stream/${mediaId}`;
  },
};
