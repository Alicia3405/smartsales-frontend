// src/services/authService.ts

// --- (MEJORA) Importamos el apiClient global en lugar de crear uno nuevo ---
import apiClient from './apiClient'; 
import { jwtDecode } from 'jwt-decode'; // Asegúrate de instalar: npm install jwt-decode

// Función para verificar si estamos en el cliente (navegador)
const isClient = () => typeof window !== 'undefined';

// 1. Configuración de Axios
// (Eliminada la instancia local de 'api'. Usaremos 'apiClient'.)

// Interfaz para la respuesta exitosa del Login JWT
interface TokenResponse {
  access: string;
  refresh: string;
}

// 2. Función Principal de Login
export const login = async (username: string, password: string): Promise<TokenResponse> => {
  try {
    // --- (MEJORA) Usamos 'apiClient' en lugar de 'api' ---
    const response = await apiClient.post<TokenResponse>(
      '/token/', // Llama a /api/v1/token/
      { username, password }
    );

    const { access, refresh } = response.data;

    // Guardar tokens solo si estamos en el navegador
    if (isClient()) {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
    }
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error("Invalid credentials or server error");
  }
};

// 3. Función de Logout
export const logout = () => {
  if (isClient()) {
    // Opcional: Llamar al backend para invalidar el token si se implementó
    // apiClient.post('/logout/', { refresh_token: getRefreshToken() });
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

// 4. Utilidades del Token (Sin cambios)
export const getAccessToken = (): string | null => {
  if (isClient()) {
    return localStorage.getItem('access_token');
  }
  return null;
};

// (Necesitaríamos esta función si implementamos el logout del backend)
// export const getRefreshToken = (): string | null => {
//   if (isClient()) {
//     return localStorage.getItem('refresh_token');
//   }
//   return null;
// };

export const getRoleFromToken = (): string | null => {
  const token = getAccessToken();
  if (token) {
    try {
      const decoded: any = jwtDecode(token);

      // Lee la clave 'role' que inyectó el backend
      return decoded.role || 'Rol Desconocido'; // Fallback seguro
    } catch (e) {
      console.error("Error decoding token:", e);
      return null;
    }
  }
  return null;
};