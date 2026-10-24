import { apiClient } from './apiClient';
import { mockStore, isDemoMode, disableDemoMode } from '../mock/mockStore';

export const authService = {
  async register({ name, email, password }) {
    if (isDemoMode()) {
      return { token: 'mock-demo-token', user: mockStore.getUser() };
    }
    disableDemoMode();
    const response = await apiClient.post('/api/auth/register', { name, email, password });
    return response.data;
  },

  async login({ email, password }) {
    if (isDemoMode()) {
      return { token: 'mock-demo-token', user: mockStore.getUser() };
    }
    disableDemoMode();
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
  },

  async devLogin({ email = 'demo@snaply.com', name = 'Demo User' } = {}) {
    disableDemoMode();
    const response = await apiClient.post('/api/auth/dev-login', null, {
      params: { email, name },
    });
    return response.data;
  },

  async getCurrentUser() {
    if (isDemoMode()) {
      return mockStore.getUser();
    }
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },

  async logout() {
    disableDemoMode();
    try {
      await apiClient.post('/api/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('snaply_token');
      localStorage.removeItem('snaply_user');
      localStorage.removeItem('snaply_demo_mode');
    }
  },

  async verifyEmail(token) {
    const response = await apiClient.get('/api/auth/verify', {
      params: { token },
    });
    return response.data;
  },
};
