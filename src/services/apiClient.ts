// src/services/apiClient.ts

import axios from 'axios';
import { getAccessToken } from './authService'; // Importamos el token

// 1. Creamos la instancia de Axios
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
});

// 2. --- ¡LA SOLUCIÓN AL ERROR 401! ---
// Interceptor que añade el token JWT a CADA petición
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken(); // Obtiene el token guardado en localStorage
    if (token && config.headers) {
      // Adjunta el token a la cabecera Authorization
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;