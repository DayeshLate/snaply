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
