import { apiClient } from './apiClient';
import { mockStore, isDemoMode } from '../mock/mockStore';

export const folderService = {
  async getAllFolders() {
    if (isDemoMode()) {
      return mockStore.getFolders();
    }
    const response = await apiClient.get('/folder/getAllFolders');
    return response.data; // List<FolderDTO>
  },

  async getAllFoldersPaginated({ page = 0, size = 20, sortBy = 'createdAt', sortDir = 'desc' } = {}) {
    if (isDemoMode()) {
      const all = mockStore.getFolders();
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
    const response = await apiClient.get('/folder/paged', {
      params: { page, size, sortBy, sortDir },
    });
    return response.data; // Page<FolderDTO>
  },

  async getGroupFoldersPaginated(groupId, { page = 0, size = 20, sortBy = 'createdAt', sortDir = 'desc' } = {}) {
    if (isDemoMode()) {
      const all = mockStore.getFolders().filter((f) => f.groupId === Number(groupId));
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
    const response = await apiClient.get(`/folder/group/${groupId}/paged`, {
      params: { page, size, sortBy, sortDir },
    });
    return response.data; // Page<FolderDTO>
  },

  async addFolder(groupId, name) {
    if (isDemoMode()) {
      return mockStore.addFolder(groupId, name);
    }
    const response = await apiClient.post(`/folder/addFolder/${groupId}`, { name });
    return response.data;
  },

  async deleteFolderByOwner(groupId, folderId) {
    if (isDemoMode()) {
      return mockStore.deleteFolder(groupId, folderId);
    }
    const response = await apiClient.delete(`/folder/deleteFolderByOwner/${groupId}/${folderId}`);
    return response.data;
  },

  async deleteFolderByAdmin(groupId, folderId) {
    if (isDemoMode()) {
      return mockStore.deleteFolder(groupId, folderId);
    }
    const response = await apiClient.delete(`/folder/deleteFolderByAdmin/${groupId}/${folderId}`);
    return response.data;
  },
};
