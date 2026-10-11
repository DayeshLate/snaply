import { apiClient } from './apiClient';

export const messageService = {
  async getGroupMessages(groupId) {
    const response = await apiClient.get(`/chat/${groupId}/messages`);
    return response.data; // List<ChatMessageResponseDTO>
  },

  async getGroupMessagesPaged(groupId, page = 0, size = 50) {
    const response = await apiClient.get(`/chat/${groupId}/messages/paged`, {
      params: { page, size },
    });
    return response.data; // Page<ChatMessageResponseDTO>
  },

  async sendMessage(groupId, { message, mediaId }) {
    const response = await apiClient.post(`/chat/${groupId}/send`, {
      message,
      mediaId,
    });
    return response.data; // ChatMessageResponseDTO
  },

  async deleteMessage(messageId) {
    const response = await apiClient.delete(`/chat/messages/${messageId}`);
    return response.data;
  },
};
