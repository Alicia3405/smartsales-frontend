// src/services/productService.ts

import axios from 'axios';
import { getAccessToken } from './authService';
import apiClient from './apiClient';


// 1. --- Interfaces Corregidas (name, stock, etc.) ---
export interface IAttribute {
  id: number;
  key: string; 
  value: string;
}

export interface ICategory {
  id: number;
  nombre: string; // El modelo Categoria sí usa 'nombre'
}

export interface IProduct {
  id: number;
  name: string; // <-- CORREGIDO (El modelo Producto usa 'name')
  categoria: ICategory;
  precio: string;
  stock: number; // <-- CORREGIDO (El modelo Producto usa 'stock')
  min_stock: number;
  atributos: IAttribute[];
  sku: string;
  description: string;
}

// DTO (Objeto de Transferencia de Datos) para Crear/Editar
export type IProductDTO = Omit<IProduct, 'id' | 'atributos' | 'categoria'> & {
  categoria_id: number;
};

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

// Interceptor que añade el token JWT (Soluciona el 403)
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

// --- Funciones del CRUD (Ciclo 1) ---

export const getProducts = async (): Promise<IProduct[]> => {
  try {
    const response = await apiClient.get<PaginatedResponse<IProduct>>('/productos/');
    return response.data.results; 
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error('Failed to fetch products');
  }
};

export const getCategories = async (): Promise<ICategory[]> => {
  try {
    const response = await apiClient.get<PaginatedResponse<ICategory>>('/categorias/');
    return response.data.results || (response.data as any); // Maneja paginado o no
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error('Failed to fetch categories');
  }
};

export const createProduct = async (productData: IProductDTO): Promise<IProduct> => {
  try {
    const response = await apiClient.post<IProduct>('/productos/', productData);
    return response.data;
  } catch (error: any) {
    console.error("Error creating product:", error.response?.data || error.message);
    throw new Error('Failed to create product. Check fields.');
  }
};

export const updateProduct = async (id: number, productData: Partial<IProductDTO>): Promise<IProduct> => {
  try {
    const response = await api.put<IProduct>(`/productos/${id}/`, productData);
    return response.data;
  } catch (error: any) {
    console.error("Error updating product:", error.response?.data || error.message);
    throw new Error('Failed to update product');
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`/productos/${id}/`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error('Failed to delete product');
  }

  
};