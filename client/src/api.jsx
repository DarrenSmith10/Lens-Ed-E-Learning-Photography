import axios from 'axios';

const apiAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token && !config.url.includes('/api/users')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const api = apiAxios;
export default api;