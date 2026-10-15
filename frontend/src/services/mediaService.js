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

  async searchSemantic({ query, groupId, folderId, minSimilarity, limit, startDate, endDate } = {}) {
    if (isDemoMode()) {
      const q = (query || '').toLowerCase().trim();
      const all = mockStore.data.media || [];
      const filtered = all.filter((item) => {
        if (groupId && String(item.groupId) !== String(groupId)) return false;
        if (folderId && String(item.folderId) !== String(folderId)) return false;
        if (!q) return true;
        const text = `${item.fileName || ''} ${item.folderName || ''} ${item.description || ''}`.toLowerCase();
        return q.split(/\s+/).some((token) => text.includes(token));
      });
      return filtered.map((item, idx) => ({
        mediaId: item.id,
        fileName: item.fileName,
        fileUrl: item.fileUrl || `/media/stream/${item.id}`,
        mimeType: item.mimeType || 'image/jpeg',
        fileSize: item.fileSize || 1048576,
        createdAt: item.createdAt || new Date().toISOString(),
        folderId: item.folderId,
        folderName: item.folderName || 'General',
        groupId: item.groupId,
        groupName: item.groupName || 'Default Group',
        description: item.description || `Photograph matching query '${query}'`,
        tags: item.tags || 'photo, memory',
        similarity: Math.max(0.75, 0.98 - idx * 0.04),
        matchType: 'SEMANTIC',
      }));
    }

    const response = await apiClient.post('/api/media/search', {
      query,
      groupId: groupId ? Number(groupId) : undefined,
      folderId: folderId ? Number(folderId) : undefined,
      minSimilarity,
      limit,
      startDate,
      endDate,
    });
    return response.data; // List<SemanticSearchResultDTO>
  },

  async getEmbeddingStatus() {
    if (isDemoMode()) {
      const all = mockStore.data.media || [];
      return {
        totalMedia: all.length,
        indexedCount: all.length,
        completedCount: all.length,
        pendingCount: 0,
        processingCount: 0,
        failedCount: 0,
        isProcessing: false,
        activeProvider: 'Demo Semantic Engine',
        visionModel: 'mock-vision',
        embeddingModel: 'mock-vector-768',
      };
    }
    const response = await apiClient.get('/api/media/embeddings/status');
    return response.data; // EmbeddingStatusDTO
  },

  async indexAllEmbeddings() {
    if (isDemoMode()) {
      return { status: 'success', enqueuedCount: 0 };
    }
    const response = await apiClient.post('/api/media/embeddings/index-all');
    return response.data;
  },

  async processEmbeddingBatch(limit = 10) {
    if (isDemoMode()) {
      return { status: 'success', processedCount: 0 };
    }
    const response = await apiClient.post('/api/media/embeddings/process-batch', null, {
      params: { limit },
    });
    return response.data;
  },

  async retryFailedEmbeddings() {
    if (isDemoMode()) {
      return { status: 'success' };
    }
    const response = await apiClient.post('/api/media/embeddings/retry-failed');
    return response.data;
  },
};

