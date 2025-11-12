'use client';

import React, { useState, useEffect } from 'react';
// (CORREGIDO) Usamos el alias '@/services/'
import { getAuditLogs, IAuditLog } from '@/services/auditService';

// (Helper) Función simple para formatear la fecha ISO a algo legible
const formatTimestamp = (isoString: string) => {
  try {
    // Formato: 11/11/2025, 19:30:00
    return new Date(isoString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch (e) {
    return isoString; // Devuelve el original si falla
  }
};

export default function LogsPage() {
  const [logs, setLogs] = useState<IAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Estados para los Filtros (CU-Bitácora) ---
  const [userFilter, setUserFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Función para cargar/refrescar los logs
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Prepara los filtros para enviar a la API
      const filters = {
        user: userFilter || undefined,
        start_date: startDateFilter || undefined,
        end_date: endDateFilter || undefined,
      };

      const data = await getAuditLogs(filters);
      setLogs(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la bitácora.');
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial de datos
  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Se ejecuta solo una vez al montar

  // Handler para el botón de filtrar
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    fetchData(); // Vuelve a llamar a la API con los filtros
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Bitácora de Auditoría (Log)</h1>
      </div>
      
      {/* --- Filtros (CU-Bitácora) --- */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          {/* Filtro por Usuario */}
          <div>
            <label htmlFor="userFilter" className="block text-sm font-medium text-gray-700">Usuario (username)</label>
            <input
              type="text"
              id="userFilter"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-900"
              placeholder="ej: admin"
            />
          </div>
          
          {/* Filtro Fecha Inicio */}
          <div>
            {/* (CORREGIDO) Arreglado el error de sintaxis de la etiqueta */}
            <label htmlFor="startDateFilter" className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
            <input
              type="date"
              id="startDateFilter"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-900"
            />
          </div>

          {/* Filtro Fecha Fin */}
          <div>
            {/* (CORREGIDO) Arreglado el error de sintaxis de la etiqueta */}
            <label htmlFor="endDateFilter" className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
            <input
              type="date"
              id="endDateFilter"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-900"
            />
          </div>
          
          {/* Botón de Aplicar Filtro */}
          <button
            type="submit"
            className="bg-[#00BCD4] hover:bg-[#0097A7] text-white font-semibold py-2 px-4 rounded-md transition"
          >
            {loading ? 'Buscando...' : 'Aplicar Filtros'}
          </button>
        </form>
      </div>

      {/* Manejo de Error */}
      {error && (
        <p className="mb-4 text-center text-red-600 bg-red-100 p-4 rounded-md border border-red-300">
          {error}
        </p>
      )}

      {/* --- Tabla de Logs (CU-Bitácora) --- */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* (CORREGIDO) Columnas ajustadas a tu Serializer */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dirección IP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha y Hora</th>
              {/* Se quitó 'Detalles' */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                {/* (CORREGIDO) colSpan=4 */}
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  Cargando bitácora...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                {/* (CORREGIDO) colSpan=4 */}
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No se encontraron registros de bitácora con esos filtros.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  {/* (CORREGIDO) Campos ajustados a tu Serializer */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.user_username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.ip_address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatTimestamp(log.timestamp)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}