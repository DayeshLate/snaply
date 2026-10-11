import { apiClient } from './apiClient';
import { mockStore, isDemoMode } from '../mock/mockStore';

export const groupService = {
  async getAllGroups() {
    if (isDemoMode()) {
      return mockStore.getGroups();
    }
    const response = await apiClient.get('/group/getAll');
    return response.data; // List<GroupDTO>
  },

  async getGroupById(id) {
    if (isDemoMode()) {
      const grp = mockStore.getGroup(id);
      if (!grp) throw new Error('Group not found');
      return grp;
    }
    const response = await apiClient.get(`/group/get/${id}`);
    return response.data; // GroupDTO
  },

  async createGroup({ name, description }) {
    if (isDemoMode()) {
      return mockStore.createGroup({ name, description });
    }
    const response = await apiClient.post('/group/create', { name, description });
    return response.data; // GroupDTO
  },

  async deleteGroup(id) {
    if (isDemoMode()) {
      return mockStore.deleteGroup(id);
    }
    const response = await apiClient.delete(`/group/delete/${id}`);
    return response.data;
  },

  async removeMember(groupId, memberId) {
    if (isDemoMode()) {
      return mockStore.removeMember(groupId, memberId);
    }
    const response = await apiClient.post(`/group/delete/${groupId}/member/${memberId}`);
    return response.data;
  },

  async changeRole(groupId, memberId, role) {
    if (isDemoMode()) {
      return mockStore.changeRole(groupId, memberId, role);
    }
    const response = await apiClient.post(`/group/changeRole/${groupId}/${memberId}`, null, {
      params: { role },
    });
    return response.data;
  },

  async requestToJoin(inviteCode) {
    if (isDemoMode()) {
      return mockStore.requestToJoin(inviteCode);
    }
    const response = await apiClient.post(`/group/join/${inviteCode}`);
    return response.data; // JoinRequest
  },
};
