import { apiClient } from './apiClient';

export const groupService = {
  async getAllGroups() {
    const response = await apiClient.get('/group/getAll');
    return response.data; // List<GroupDTO>
  },

  async getGroupById(id) {
    const response = await apiClient.get(`/group/get/${id}`);
    return response.data; // GroupDTO
  },

  async createGroup({ name, description }) {
    const response = await apiClient.post('/group/create', { name, description });
    return response.data; // GroupDTO
  },

  async deleteGroup(id) {
    const response = await apiClient.delete(`/group/delete/${id}`);
    return response.data;
  },

  async removeMember(groupId, memberId) {
    const response = await apiClient.post(`/group/delete/${groupId}/member/${memberId}`);
    return response.data;
  },

  async changeRole(groupId, memberId, role) {
    const response = await apiClient.post(`/group/changeRole/${groupId}/${memberId}`, null, {
      params: { role },
    });
    return response.data;
  },

  async requestToJoin(inviteCode) {
    const response = await apiClient.post(`/group/join/${inviteCode}`);
    return response.data; // JoinRequest
  },
};
