import axios from 'axios';
import { getCurrentUserId } from './session';

const envApiUrl = import.meta.env.VITE_API_URL;
export const API_BASE_URL = (typeof envApiUrl === 'string' ? envApiUrl.trim() : envApiUrl) || 'http://localhost:3002/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const userId = getCurrentUserId();
  if (userId) {
    config.headers = config.headers ?? {};
    config.headers['x-user-id'] = userId;
  }
  return config;
});

export function withUser(userId: string) {
  return {
    headers: {
      'x-user-id': userId,
    },
  };
}
