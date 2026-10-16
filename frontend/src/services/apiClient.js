import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// In-flight GET request deduplication to prevent simultaneous network storms on page mount
const inFlightGetMap = new Map();
const originalGet = apiClient.get.bind(apiClient);

apiClient.get = function (url, config = {}) {
  const token = localStorage.getItem('snaply_token') || '';
  const key = `${url}:${JSON.stringify(config.params || {})}:${token}`;
  if (inFlightGetMap.has(key)) {
    return inFlightGetMap.get(key);
  }
  const promise = originalGet(url, config).finally(() => {
    // Clear after 300ms so subsequent user actions fetch fresh data
    setTimeout(() => inFlightGetMap.delete(key), 300);
  });
  inFlightGetMap.set(key, promise);
  return promise;
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('snaply_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    let message = 'An unexpected error occurred. Please try again.';

    if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        message = error.response.data;
      } else if (error.response.data.message) {
        message = error.response.data.message;
      } else if (error.response.data.error) {
        message = error.response.data.error;
      }
    } else if (error.message) {
      message = error.message;
    }

    if (status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/' && !currentPath.startsWith('/invite/')) {
        localStorage.removeItem('snaply_token');
        localStorage.removeItem('snaply_user');
      }
    }

    const enhancedError = new Error(message);
    enhancedError.status = status;
    enhancedError.originalError = error;
    return Promise.reject(enhancedError);
  }
);
