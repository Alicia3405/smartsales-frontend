// src/app/dashboard/reports/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
// Hacemos la importación relativa para evitar errores de compilación de alias
import { generateReportQuery, downloadReportFile } from '../../../services/reportService'; 

// --- (NUEVO) Helper: Icono de Micrófono (SVG) ---
const MicIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 14a2 2 0 0 1-2-2V6a2 2 0 0 1 4 0v6a2 2 0 0 1-2 2z" />
    <path d="M16.1 12.1a4.1 4.1 0 0 1-8.2 0H6a6 6 0 0 0 5.1 5.9V21h1.8v-2.9A6 6 0 0 0 18 12h-1.9z" />
  </svg>
);

// --- (NUEVO) Helper: Función para "slugify" el texto para el nombre de archivo ---
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Quitar caracteres especiales
    .replace(/[\s_-]+/g, '_')   // Reemplazar espacios y guiones con guion bajo
    .replace(/^-+|-+$/g, '');   // Quitar guiones bajos al inicio o final
};

// Función helper para forzar la descarga del archivo (Sin cambios)
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
  // --- (NUEVO) Estado para el nombre del archivo ---
  const [fileName, setFileName] = useState<string>('');
  // --- (NUEVO) Estado para el reconocimiento de voz ---
  const [isListening, setIsListening] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[] | null>(null);

  // --- (NUEVO) useEffect para auto-generar el nombre del archivo desde el prompt ---
  useEffect(() => {
    if (prompt) {
      // Genera un nombre de archivo sugerido a partir del prompt
      setFileName(slugify(prompt));
    }
  }, [prompt]); // Se ejecuta cada vez que el prompt cambia

  // --- (MODIFICADO) handleSubmit ahora usa el 'fileName' ---
  const handleSubmit = async (format: 'pdf' | 'xlsx' | 'json') => {
    setLoading(true);
    setError(null);
    setResults(null);

    // Asegura un nombre de archivo válido
    const downloadFilename = fileName || slugify(prompt) || 'reporte';

    try {
      const queryResponse = await generateReportQuery(prompt);

      if (format === 'json') {
        setResults(queryResponse.results);
      } else {
        const blob = await downloadReportFile(queryResponse.query_id, format);
        
        // Usa el nombre de archivo del estado
        triggerFileDownload(blob, `${downloadFilename}.${format}`);
      }
      
    } catch (err: any) {
      setError(err.message || 'Error al generar el reporte.');
    } finally {
      setLoading(false);
    }
  };

  // --- (NUEVO) Función para el Input de Voz (CU16) ---
  const handleListen = () => {
    // Verifica si la API de Voz está disponible en el navegador
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('La API de reconocimiento de voz no es compatible con este navegador. Por favor, usa Chrome o Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES'; // Configura el idioma a Español
    recognition.continuous = false; // Solo captura una frase
    recognition.interimResults = false; // No queremos resultados intermedios

    setIsListening(true);
    setError(null);

    // Evento: cuando se obtiene un resultado
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript); // Establece el prompt con el texto transcrito
    };

    // Evento: si hay un error
    recognition.onerror = (event: any) => {
      setError(`Error de reconocimiento de voz: ${event.error}. Intenta de nuevo.`);
    };

    // Evento: cuando termina de escuchar
    recognition.onend = () => {
      setIsListening(false);
    };

    // Iniciar la escucha
    recognition.start();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reportes Dinámicos (Ciclo 2)</h1>

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
              Escribe tu consulta (Texto o Voz):
            </label>
            {/* --- (NUEVO) Contenedor relativo para el input y el botón de voz --- */}
            <div className="relative w-full">
              <input
                type="text"
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-gray-900 pr-12"
                placeholder="Ej: Ventas de Septiembre agrupado por producto en PDF"
                disabled={isListening}
              />
              {/* --- (NUEVO) Botón de Micrófono (CU16) --- */}
              <button
                onClick={handleListen}
                disabled={loading || isListening}
                title={isListening ? "Escuchando..." : "Grabar consulta de voz"}
                className={`absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-md ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <MicIcon className="w-6 h-6" />
              </button>
            </div>
            {isListening && (
              <p className="text-sm text-red-600 animate-pulse mt-1">Escuchando...</p>
            )}
          </div>

          {/* --- (NUEVO) Input para el Nombre del Archivo --- */}
          <div>
            <label htmlFor="fileName" className="text-sm font-medium text-gray-700">
              Nombre del Archivo (para PDF/Excel):
            </label>
            <input
                type="text"
                id="fileName"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-gray-900"
                placeholder="Ej: reporte_ventas_septiembre"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Botón de Visualizar (CU19) */}
            <button
              onClick={() => handleSubmit('json')}
              disabled={loading || isListening}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
            >
              {loading && !isListening ? 'Generando...' : 'Visualizar en Pantalla'}
            </button>
            
            {/* Botón de PDF (CU18) */}
            <button
              onClick={() => handleSubmit('pdf')}
              disabled={loading || isListening}
              className="bg-[#00BCD4] hover:bg-[#0097A7] text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
            >
              {loading && !isListening ? 'Generando...' : 'Descargar PDF'}
            </button>

            {/* Botón de Excel (CU18) */}
            <button
              onClick={() => handleSubmit('xlsx')}
              disabled={loading || isListening}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
            >
              {loading && !isListening ? 'Generando...' : 'Descargar Excel'}
            </button>
          </div>
        </div>
      </div>
      
      {/**********************************************
       * ÁREA de VISUALIZACIÓN (CU19)
       ***********************************************/}
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