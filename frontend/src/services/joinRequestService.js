import { apiClient } from './apiClient';
import { mockStore, isDemoMode } from '../mock/mockStore';

export const joinRequestService = {
  async getMyRequests() {
    if (isDemoMode()) {
      return mockStore.getMyRequests();
    }
    const response = await apiClient.get('/JoinRequest/getAll');
    return response.data; // List<JoinRequestDTO>
  },

  async getRequestsByGroup(groupId) {
    if (isDemoMode()) {
      return mockStore.getJoinRequests(groupId);
    }
    const response = await apiClient.get(`/JoinRequest/getByGroup/${groupId}`);
    return response.data; // List<JoinRequestDTO>
  },

  async getRequestById(id) {
    if (isDemoMode()) {
      const found = mockStore.data.joinRequests.find((r) => r.id === id);
      if (!found) throw new Error('Request not found');
      return found;
    }
    const response = await apiClient.get(`/JoinRequest/getById/${id}`);
    return response.data; // JoinRequestDTO
  },

  async acceptRequest(requestId) {
    if (isDemoMode()) {
      return mockStore.acceptJoinRequest(requestId);
    }
    const response = await apiClient.post(`/JoinRequest/${requestId}/accept`);
    return response.data; // GroupMembersDTO
  },

  async rejectRequest(requestId) {
    if (isDemoMode()) {
      return mockStore.rejectJoinRequest(requestId);
    }
    const response = await apiClient.post(`/JoinRequest/${requestId}/reject`);
    return response.data; // JoinRequestDTO
  },
};
