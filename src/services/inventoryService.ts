// src/services/inventoryService.ts

import axios from 'axios';
import { getAccessToken } from './authService';
import { IProduct } from './productService'; // Importa la interfaz IProduct
import apiClient from './apiClient';

// 1. --- Interfaces (Modelo de Inventario) ---
// (No necesitamos IInventoryProduct, usamos IProduct directamente)

export interface IInventoryMovement {
  id: number;
  producto: IProduct; // Usa la interfaz IProduct (que debe tener 'name' o 'nombre')
  tipo_movimiento: 'ENTRADA' | 'SALIDA';
  cantidad: number;
  motivo: string;
  fecha_movimiento: string; 
}

// Interfaz para la respuesta paginada de Django
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// 2. --- Configuración de Axios (Interceptor) ---
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
});

// Interceptor que añade el token JWT
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Funciones del CRUD (Ciclo 1 - Inventario) ---

export type IInventoryMovementDTO = {
  producto_id: number;
  tipo_movimiento: 'ENTRADA' | 'SALIDA';
  cantidad: number;
  motivo: string;
};

const INVENTORY_ENDPOINT = '/logistics/inventory/';

// CU3: Leer Movimientos (Historial)
export const getInventoryMovements = async (): Promise<IInventoryMovement[]> => {
  try {
    const response = await apiClient.get<PaginatedResponse<IInventoryMovement>>(INVENTORY_ENDPOINT);
    return response.data.results; 
  } catch (error) {
    console.error("Error fetching inventory movements:", error);
    throw new Error('Failed to fetch movements');
  }
};

// CU3: Registrar Movimiento (Entrada/Salida)
export const createInventoryMovement = async (data: IInventoryMovementDTO): Promise<IInventoryMovement> => {
  try {
    const response = await apiClient.post<IInventoryMovement>(INVENTORY_ENDPOINT, data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating movement:", error.response?.data || error.message);
    throw new Error('Failed to create movement');
  }
};