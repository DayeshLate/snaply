import { apiClient } from './apiClient';

export const folderService = {
  async getAllFolders() {
    const response = await apiClient.get('/folder/getAllFolders');
    return response.data; // List<FolderDTO>
  },

  async addFolder(groupId, name) {
    const response = await apiClient.post(`/folder/addFolder/${groupId}`, { name });
    return response.data;
  },

  async deleteFolderByOwner(groupId, folderId) {
    const response = await apiClient.delete(`/folder/deleteFolderByOwner/${groupId}/${folderId}`);
    return response.data;
  },

  async deleteFolderByAdmin(groupId, folderId) {
    const response = await apiClient.delete(`/folder/deleteFolderByAdmin/${groupId}/${folderId}`);
    return response.data;
  },
};
