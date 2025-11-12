'use client';

// (CORREGIDO) Usamos el alias '@/services/'
import apiClient from '@/services/apiClient';

// 1. (CORREGIDO) Interfaz ajustada a tu LogEntrySerializer
// (Coincide con 'user_username', 'action', 'ip_address')
export interface IAuditLog {
  id: number;
  ip_address: string;
  user_username: string; // Coincide con tu serializer
  timestamp: string;
  action: string;
  // No hay 'details'
}

// Interfaz para la respuesta paginada (Django REST Framework)
interface PaginatedLogResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IAuditLog[];
}

// 2. Interfaz de Filtros (para CU-Bitácora)
// (Coincide con los filtros que añadiremos al backend)
interface LogFilters {
  user?: string;       
  start_date?: string; 
  end_date?: string;   
}

/**
 * (NUEVO) CU-Bitácora: Obtiene los logs de auditoría del backend.
 */
export const getAuditLogs = async (filters: LogFilters): Promise<IAuditLog[]> => {
  try {
    // 3. (CORREGIDO) URL ajustada a tu urls.py (/log/)
    const response = await apiClient.get<PaginatedLogResponse>('/log/', {
      params: filters, 
    });
    
    return response.data.results;

  } catch (error: any) {
    console.error("Error fetching audit logs:", error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Failed to fetch audit logs');
  }
};