import axios from 'axios';

// La URL del backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Muy importante para las cookies de sesión
  headers: {
    'X-Tunnel-Skip-AntiPhishing-Page': 'true' // Salta la advertencia de Dev Tunnels
  }
});

// Interceptor para atrapar errores de autenticación (401) en cualquier petición
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // La sesión caducó o el servidor se reinició
      localStorage.removeItem('user');
      
      // Solo redirigir si no estamos ya en la página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
