import { apiClient } from './apiClient';
import { mockStore, isDemoMode } from '../mock/mockStore';

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

export const mediaService = {
  async uploadMedia(file, folderId, onProgress) {
    if (isDemoMode()) {
      if (onProgress) onProgress(100);
      return mockStore.uploadMedia(file, folderId);
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', folderId);

    const response = await apiClient.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
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

  async getMediaByFolderPaginated(folderId, { page = 0, size = 20, sortBy = 'createdAt', sortDir = 'desc' } = {}) {
    if (isDemoMode()) {
      const all = mockStore.getMediaByFolder(folderId);
      const start = page * size;
      const content = all.slice(start, start + size);
      return {
        content,
        totalPages: Math.ceil(all.length / size),
        totalElements: all.length,
        number: page,
        size,
      };
    }
    const response = await apiClient.get(`/media/folder/${folderId}/paged`, {
      params: { page, size, sortBy, sortDir },
    });
    return response.data; // Page<MediaDTO>
  },

  async getAllMediaByGroup(groupId) {
    if (isDemoMode()) {
      return mockStore.getMediaByGroup(groupId);
    }
    const response = await apiClient.get(`/media/group/${groupId}`);
    return response.data; // List<MediaDTO>
  },

  async getMediaByGroupPaginated(groupId, { page = 0, size = 20, sortBy = 'createdAt', sortDir = 'desc' } = {}) {
    if (isDemoMode()) {
      const all = mockStore.getMediaByGroup(groupId);
      const start = page * size;
      const content = all.slice(start, start + size);
      return {
        content,
        totalPages: Math.ceil(all.length / size),
        totalElements: all.length,
        number: page,
        size,
      };
    }
    const response = await apiClient.get(`/media/group/${groupId}/paged`, {
      params: { page, size, sortBy, sortDir },
    });
    return response.data; // Page<MediaDTO>
  },

  async getMyMediaPaginated({ page = 0, size = 20, sortBy = 'createdAt', sortDir = 'desc' } = {}) {
    if (isDemoMode()) {
      const all = mockStore.data.media;
      const start = page * size;
      const content = all.slice(start, start + size);
      return {
        content,
        totalPages: Math.ceil(all.length / size),
        totalElements: all.length,
        number: page,
        size,
      };
    }
    const response = await apiClient.get('/media/user/paged', {
      params: { page, size, sortBy, sortDir },
    });
    return response.data; // Page<MediaDTO>
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

  async updateMedia(mediaId, { fileName, folderId }) {
    if (isDemoMode()) {
      const found = mockStore.data.media.find((m) => m.id === Number(mediaId));
      if (!found) throw new Error('Media not found');
      if (fileName) found.fileName = fileName;
      if (folderId) found.folderId = Number(folderId);
      mockStore.save();
      return found;
    }
    const response = await apiClient.put(`/media/update/${mediaId}`, {
      fileName,
      folderId: folderId ? Number(folderId) : undefined,
    });
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
