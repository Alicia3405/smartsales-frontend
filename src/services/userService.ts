// src/services/userService.ts

import apiClient from './apiClient'; // Importa el cliente centralizado

// 1. --- Interfaces (Modelo de Usuario) ---
export interface IUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'CLIENT' | 'OPERATOR' | 'ADMIN';
  phone: string | null;
  address: string | null;
  is_active: boolean;
  date_joined: string;
  is_superuser?: boolean;
}

// DTO (Data Transfer Object) para Crear/Editar
export type IUserDTO = Omit<IUser, 'id' | 'is_active' | 'date_joined'> & {
  password?: string; // Opcional al crear
  role: 'CLIENT' | 'OPERATOR' | 'ADMIN';
};

// Interfaz para la respuesta paginada de Django
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// (El interceptor de Axios está en apiClient.ts)

// --- Funciones del CRUD (Ciclo 1 - Clientes) ---

const CUSTOMER_MANAGEMENT_ENDPOINT = '/users/'; // Para GET, PUT, DELETE (Admin)
const CUSTOMER_REGISTER_ENDPOINT = '/register/'; // Para POST (Público/Registro)

// CU4: Leer Usuarios (Admin)
export const getUsers = async (): Promise<IUser[]> => {
  try {
    const response = await apiClient.get<PaginatedResponse<IUser>>(CUSTOMER_MANAGEMENT_ENDPOINT);
    // Mostrar todos los usuarios, no filtrar por rol
    return response.data.results;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error('Failed to fetch users');
  }
};

// CU4: Crear Usuario (Ahora permite seleccionar rol)
export const createUser = async (data: IUserDTO): Promise<IUser> => {
  try {
    // El rol ya viene incluido en data, no asignar por defecto
    const response = await apiClient.post<IUser>(CUSTOMER_REGISTER_ENDPOINT, data);

    return response.data;
  } catch (error: any) {
    console.error("Error creating user:", error.response?.data || error.message);
    throw new Error('Failed to create user');
  }
};

// CU4: Actualizar Usuario (Admin)
export const updateUser = async (id: number, data: Partial<IUserDTO>): Promise<IUser> => {
  try {
    const response = await apiClient.patch<IUser>(`${CUSTOMER_MANAGEMENT_ENDPOINT}${id}/`, data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating user:", error.response?.data || error.message);
    throw new Error('Failed to update user');
  }
};

// CU4: Toggle User Status (Activate/Deactivate)
export const toggleUserStatus = async (id: number, newStatus: boolean): Promise<void> => {
  try {
    await apiClient.patch(`${CUSTOMER_MANAGEMENT_ENDPOINT}${id}/`, { is_active: newStatus });
  } catch (error) {
    console.error("Error toggling user status:", error);
    throw new Error('Failed to toggle user status');
  }
};

// CU4: Delete User Permanently (Admin)
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`${CUSTOMER_MANAGEMENT_ENDPOINT}${id}/`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error('Failed to delete user');
  }
};
