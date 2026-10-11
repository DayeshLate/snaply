import { apiClient } from './apiClient';
import { mockStore, isDemoMode, enableDemoMode, disableDemoMode } from '../mock/mockStore';
import { MOCK_USER } from '../mock/mockData';

export const authService = {
  async register({ name, email, password }) {
    const response = await apiClient.post('/api/auth/register', { name, email, password });
    return response.data;
  },

  async login({ email, password }) {
    if (email === 'demo@snaply.com') {
      enableDemoMode();
      return { token: 'demo-preview-token-123', user: MOCK_USER, message: 'Demo login successful' };
    }
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
  },

  async devLogin({ email = 'demo@snaply.com', name = 'Demo User' } = {}) {
    // Enable offline demo review mode immediately so zero network errors occur
    enableDemoMode();
    return { token: 'demo-preview-token-123', user: MOCK_USER, message: 'Demo login successful' };
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
