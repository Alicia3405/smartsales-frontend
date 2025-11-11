/**
 * Servicio de Reportes (Ciclo 2)
 *
 * Este archivo ha sido refactorizado para utilizar el 'apiClient' centralizado.
 * NO debe importar 'axios' o 'getAccessToken' directamente.
 * 'apiClient' ya incluye el interceptor de autenticación JWT.
 */

// Importamos la instancia centralizada de Axios
import apiClient from './apiClient';

// --- Definiciones de Tipos ---

interface QueryResponse {
  query_id: number; // ID de la consulta guardada
  results: any[]; // Resultados JSON para la vista en pantalla
  message: string;
}

// --- Funciones del Ciclo 2 (Reportes) ---

/**
 * CU15/CU17: Interpretar el prompt de texto y ejecutar la consulta.
 * @param prompt El prompt de lenguaje natural del usuario.
 * @returns Una promesa que resuelve a los resultados de la consulta y su ID.
 */
export const generateReportQuery = async (prompt: string): Promise<QueryResponse> => {
  try {
    // Usamos 'apiClient' en lugar de 'api'
    const response = await apiClient.post<QueryResponse>('/reportes/query/', { prompt });
    return response.data;
  } catch (error: any) {
    console.error("Error generating report query:", error.response?.data || error.message);
    // Relanzamos el error para que el componente de UI pueda manejarlo
    throw new Error(error.response?.data?.detail || 'Failed to interpret prompt');
  }
};

/**
 * CU18/CU20: Descargar el archivo (PDF o Excel)
 * @param queryId El ID de la consulta generada previamente.
 * @param format El formato deseado ('pdf' o 'xlsx').
 * @returns Una promesa que resuelve a un Blob con los datos del archivo.
 */
export const downloadReportFile = async (queryId: number, format: 'pdf' | 'xlsx'): Promise<Blob> => {
  try {
    // Usamos 'apiClient' en lugar de 'api'
    const response = await apiClient.get(`/reportes/generate/`, {
      params: {
        query_id: queryId,
        formato: format,
      },
      responseType: 'blob', // Importante: le dice a Axios que espere un archivo
    });
    
    return response.data;
  } catch (error: any) {
    console.error("Error downloading report file:", error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || `Failed to download ${format} file`);
  }
};