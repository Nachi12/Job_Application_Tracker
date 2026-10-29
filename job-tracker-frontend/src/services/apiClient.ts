import axios from 'axios';
import { storage } from '../utils/storage';

const baseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

const apiClient = axios.create({
  baseURL,
  withCredentials: true
});

// 🔐 REQUEST INTERCEPTOR (Attach Token)
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 RESPONSE INTERCEPTOR (Handle Errors Globally)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || '';

    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register');

    // 🔥 ONLY redirect if token exists (real invalid case) and NOT on login/register endpoints
    if (status === 401 && !isAuthEndpoint) {
      const token = storage.getToken();

      if (token) {
        console.warn('Invalid token → logging out');
        storage.clearToken();
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;