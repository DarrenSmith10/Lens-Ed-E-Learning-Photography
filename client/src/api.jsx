import axios from 'axios';

// import mockAxios from './mock/api';

const apiAxios = axios.create({
  // baseURL: "http://localhost:3001",  // ✅ Ensure this matches your backend
  // headers: { "Content-Type": "application/json" }
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  console.log('token', token);
  if (token && !config.url.includes('/api/users')) {
    config.headers.Authorization = `Bearer ${token}`;
}
  return config;
});

const shouldUseMock = import.meta.env.REACT_APP_USE_MOCK_API === "true";
const api = shouldUseMock ? mockAxios : apiAxios;

//export default mockAxios
export default api;