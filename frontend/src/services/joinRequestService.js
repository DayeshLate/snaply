import { apiClient } from './apiClient';

export const joinRequestService = {
  async getMyRequests() {
    const response = await apiClient.get('/JoinRequest/getAll');
    return response.data; // List<JoinRequestDTO>
  },

  async getRequestsByGroup(groupId) {
    const response = await apiClient.get(`/JoinRequest/getByGroup/${groupId}`);
    return response.data; // List<JoinRequestDTO>
  },

  async getRequestById(id) {
    const response = await apiClient.get(`/JoinRequest/getById/${id}`);
    return response.data; // JoinRequestDTO
  },

  async acceptRequest(requestId) {
    const response = await apiClient.post(`/JoinRequest/${requestId}/accept`);
    return response.data; // GroupMembersDTO
  },

  async rejectRequest(requestId) {
    const response = await apiClient.post(`/JoinRequest/${requestId}/reject`);
    return response.data; // JoinRequestDTO
  },
};
