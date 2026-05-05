import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const MODEL_API_BASE = import.meta.env.VITE_MODEL_API_BASE_URL || 'http://localhost:8001';

export const endpoints = {
  login: '/auth/login',
  register: '/auth/register',
  inventory: '/inventory',
  predictPack: `${MODEL_API_BASE}/predict-pack`,
  predictCells: `${MODEL_API_BASE}/predict-cells`,
  modelInfo: `${MODEL_API_BASE}/model-info`,
};

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('revoltz_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
