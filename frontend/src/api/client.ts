import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bloodbridge-production-5c86.up.railway.app';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Callback for 401 unauthenticated events so AuthContext can cleanly log out
let onUnauthorizedCallback: (() => void) | null = null;

export function setOnUnauthorizedCallback(cb: () => void) {
  onUnauthorizedCallback = cb;
}

// Request Interceptor: Attach JWT Bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('bloodbridge_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 and errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and trigger auth logout
      localStorage.removeItem('bloodbridge_token');
      localStorage.removeItem('bloodbridge_user');
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
