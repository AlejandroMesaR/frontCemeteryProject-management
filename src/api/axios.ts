import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8082/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiManagement = axios.create({
  baseURL: 'http://localhost:8081/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiDocuments = axios.create({
  baseURL: 'http://localhost:8083/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente (solo para api, puerto 8082)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;