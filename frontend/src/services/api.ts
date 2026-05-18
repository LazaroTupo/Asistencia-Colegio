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

export default api;
