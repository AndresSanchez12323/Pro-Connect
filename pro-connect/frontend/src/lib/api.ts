import axios from 'axios';
import { getAuthToken } from './session';

const envApiUrl = import.meta.env.VITE_API_URL;
export const API_BASE_URL = (typeof envApiUrl === 'string' ? envApiUrl.trim() : envApiUrl) || 'http://localhost:3002/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
