import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hosteldrishti-backend.onrender.com/api', // Connects to your Backend
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: Automatically add Token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;