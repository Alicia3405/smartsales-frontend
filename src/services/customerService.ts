// src/services/customerService.ts

import apiClient from './apiClient'; // Importa el cliente centralizado

// ... (Interfaces ICustomer, ICustomerDTO, PaginatedResponse) ...
export interface ICustomer {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'Cliente' | 'Operador' | 'Administrador'; // El backend ahora envía el rol calculado
  phone: string | null;
  address: string | null;
  is_active: boolean;
  date_joined: string;
}
export type ICustomerDTO = Omit<ICustomer, 'id' | 'role' | 'is_active' | 'date_joined'> & {
  password?: string;
};
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
// ...

const CUSTOMER_MANAGEMENT_ENDPOINT = '/users/'; 
const CUSTOMER_REGISTER_ENDPOINT = '/register/'; 

// CU4: Leer TODOS los Usuarios (Admin)
export const getCustomers = async (): Promise<ICustomer[]> => {
  try {
    const response = await apiClient.get<PaginatedResponse<ICustomer>>(CUSTOMER_MANAGEMENT_ENDPOINT);
    
    // --- CORRECCIÓN (Gestión de Operadores) ---
    // Eliminamos el filtro de 'Cliente'. Ahora la página mostrará TODOS los roles.
    return response.data.results; 
    // --- FIN DE LA CORRECCIÓN ---

  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error('Failed to fetch customers');
  }
};

// CU4: Crear Cliente
export const createCustomer = async (data: ICustomerDTO): Promise<ICustomer> => {
  try {
    const dataWithRole = { ...data, role: 'CLIENTE' }; // (El backend espera 'CLIENTE' interno)
    const response = await apiClient.post<ICustomer>(CUSTOMER_REGISTER_ENDPOINT, dataWithRole);
    return response.data;
  } catch (error: any) {
    console.error("Error creating customer:", error.response?.data || error.message);
    throw new Error('Failed to create customer');
  }
};

// CU4: Actualizar Cliente (Admin)
export const updateCustomer = async (id: number, data: Partial<ICustomerDTO>): Promise<ICustomer> => {
  try {
    const response = await apiClient.patch<ICustomer>(`${CUSTOMER_MANAGEMENT_ENDPOINT}${id}/`, data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating customer:", error.response?.data || error.message);
    throw new Error('Failed to update customer');
  }
};

// CU4: Activar/Desactivar Cliente (Admin)
export const toggleCustomerStatus = async (id: number, newStatus: boolean): Promise<ICustomer> => {
   try {
    const response = await apiClient.patch<ICustomer>(`${CUSTOMER_MANAGEMENT_ENDPOINT}${id}/`, { is_active: newStatus });
    return response.data;
  } catch (error: any) {
    console.error("Error toggling customer status:", error.response?.data || error.message);
    throw new Error('Failed to toggle customer status');
  }
};

// CU4: Eliminar Permanente (Admin)
export const deleteCustomer = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`${CUSTOMER_MANAGEMENT_ENDPOINT}${id}/`);
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw new Error('Failed to delete customer');
  }
};