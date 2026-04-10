import axios from 'axios';
import { storage } from '../utils/storage';

const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api',
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

    // 🔥 ONLY redirect if token exists (real invalid case)
    if (status === 401) {
      const token = storage.getToken();

      if (token) {
        console.warn('Invalid token → logging out');

        storage.clearToken();

        window.location.href = '/login';
      } else {
        console.warn('No token → ignore redirect');
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;