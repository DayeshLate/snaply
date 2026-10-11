import { apiClient } from './apiClient';

export const authService = {
  async register({ name, email, password }) {
    const response = await apiClient.post('/api/auth/register', { name, email, password });
    return response.data;
  },

  async login({ email, password }) {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
  },

  async devLogin({ email = 'demo@snaply.com', name = 'Demo User' } = {}) {
    const response = await apiClient.post('/api/auth/dev-login', null, {
      params: { email, name },
    });
    return response.data;
  },

  async getCurrentUser() {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },

  async logout() {
    try {
      await apiClient.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('snaply_token');
      localStorage.removeItem('snaply_user');
    }
  },

  async verifyEmail(token) {
    const response = await apiClient.get('/api/auth/verify', {
      params: { token },
    });
    return response.data;
  },
};
