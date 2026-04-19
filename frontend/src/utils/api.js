// src/utils/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (name, email, password) => api.post('/auth/signup', { name, email, password }),
};

export const transactionAPI = {
  create: (transaction) => api.post('/transactions', transaction),
  update: (id, transaction) => api.put(`/transactions/${id}`, transaction),
  getAll: () => api.get('/transactions'),
  getById: (id) => api.get(`/transactions/${id}`),
  delete: (id) => api.delete(`/transactions/${id}`),
};

export const dashboardAPI = {
  get: () => api.get('/dashboard'),
};

export const goalAPI = {
  create: (goal) => api.post('/goals', goal),
  getAll: () => api.get('/goals'),
  getById: (id) => api.get(`/goals/${id}`),
  addSavings: (id, amount) => api.post(`/goals/${id}/savings`, { amount }),
  delete: (id) => api.delete(`/goals/${id}`),
};

export const settingsAPI = {
  get: () => api.get('/settings'),
  updateThreshold: (threshold) => api.put('/settings/threshold', { threshold }),
  updateAutoCategory: (value) => api.put('/settings/auto-category', { value }),
  updateNotifications: (value) => api.put('/settings/notifications', { value }),
  updateDarkMode: (value) => api.put('/settings/dark-mode', { value }),
};

export default api;
