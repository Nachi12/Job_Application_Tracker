import axios from 'axios';
import { storage } from '../utils/storage';

declare const __API_URL__: string | undefined;

/**
 * Resolves the backend API base URL across local and deployed environments.
 * Normalizes trailing slashes and automatically ensures the '/api' prefix is present.
 */
function resolveBaseURL(): string {
  const definedUrl = typeof __API_URL__ !== 'undefined' ? __API_URL__ : '';
  const metaUrl =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_SERVER_URL ||
    '';

  let raw = (definedUrl || metaUrl || '').trim();

  // If a URL was configured via environment variable
  if (raw) {
    // Strip trailing slashes
    raw = raw.replace(/\/+$/, '');
    // Ensure '/api' suffix is appended if user provided the root host (e.g. https://xyz.onrender.com)
    if (!raw.endsWith('/api')) {
      raw = `${raw}/api`;
    }
    return raw;
  }

  // Development fallback
  if (import.meta.env.DEV) {
    return 'http://localhost:5005/api';
  }

  // Default fallback
  return 'http://localhost:5005/api';
}

const baseURL = resolveBaseURL();

// In production, warn in the browser console if the API is pointing to localhost
if (typeof window !== 'undefined') {
  const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const pointsToLocal = baseURL.includes('localhost') || baseURL.includes('127.0.0.1');

  if (!isLocalHost && pointsToLocal) {
    console.error(
      `[HireLog Configuration Notice] Frontend is running on ${window.location.origin}, but the API URL is pointing to ${baseURL}.\n` +
      `Because Vite embeds environment variables at build time, you must:\n` +
      `1. Set VITE_API_BASE_URL=<your-deployed-backend-url>/api in Netlify Site Configuration -> Environment Variables.\n` +
      `2. Go to Deploys -> "Trigger deploy" -> "Clear cache and deploy site" so Netlify rebuilds the bundle with the new URL.`
    );
  }
}

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

    // Helpful diagnostics on network connection failures
    if (!error.response && error.message === 'Network Error') {
      const isRemote = typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname);
      if (isRemote && (baseURL.includes('localhost') || baseURL.includes('127.0.0.1'))) {
        console.error(
          `[HireLog API Error] Could not connect to ${baseURL}${requestUrl}. ` +
          `Your deployed frontend cannot reach localhost. Make sure your backend is hosted (e.g. Render) and VITE_API_BASE_URL is set in Netlify.`
        );
      }
    }

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