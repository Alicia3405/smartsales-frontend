// src/app/dashboard/reports/page.tsx

'use client';

import React, { useState } from 'react';
import { generateReportQuery, downloadReportFile } from '@/services/reportService';

// Función helper para forzar la descarga del archivo
const triggerFileDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export default function ReportsPage() {
  const [prompt, setPrompt] = useState<string>('Ventas de Septiembre en PDF');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[] | null>(null); // Para mostrar en pantalla

  const handleSubmit = async (format: 'pdf' | 'xlsx' | 'json') => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // 1. Enviar el prompt al backend para que lo interprete (CU15/CU17)
      const queryResponse = await generateReportQuery(prompt);

      if (format === 'json') {
        // 2. Si es 'json', solo muestra los resultados en pantalla (CU19)
        setResults(queryResponse.results);
      } else {
        // 3. Si es PDF o Excel, llama al endpoint de descarga (CU18/CU20)
        const blob = await downloadReportFile(queryResponse.query_id, format);
        
        // 4. Activa la descarga en el navegador
        triggerFileDownload(blob, `reporte_${queryResponse.query_id}.${format}`);
      }
      
    } catch (err: any) {
      setError(err.message || 'Error al generar el reporte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reportes Dinámicos (Ciclo 2)</h1>

      {/* --- Input de Prompts (CU15/CU16) --- */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Generador de Reportes</h2>
        
        {error && (
          <p className="mb-4 text-red-600 bg-red-100 p-3 rounded-md border border-red-300">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="text-sm font-medium text-gray-700">
              Escribe tu consulta (Simula Texto o Voz):
            </label>
            <input
              type="text"
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-gray-900"
              placeholder="Ej: Ventas de Septiembre agrupado por producto en PDF"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Botón de Visualizar (CU19) */}
            <button
              onClick={() => handleSubmit('json')}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              {loading ? 'Generando...' : 'Visualizar en Pantalla'}
            </button>
            
            {/* Botón de PDF (CU18) */}
            <button
              onClick={() => handleSubmit('pdf')}
              disabled={loading}
              className="bg-[#00BCD4] hover:bg-[#0097A7] text-white font-semibold py-2 px-4 rounded-md transition"
            >
              {loading ? 'Generando...' : 'Descargar PDF'}
            </button>

            {/* Botón de Excel (CU18) */}
            <button
              onClick={() => handleSubmit('xlsx')}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              {loading ? 'Generando...' : 'Descargar Excel'}
            </button>
          </div>
        </div>
      </div>

      {/* --- Área de Visualización (CU19) --- */}
      {results && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-700 p-4 border-b">Resultados en Pantalla</h2>
          {/* Mostramos los datos como una tabla simple si es un array */}
          {Array.isArray(results) && results.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(results[0]).map(key => (
                    <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((val: any, i) => (
                      <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <pre className="p-4 bg-gray-50 text-sm text-gray-800">
              {JSON.stringify(results, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}