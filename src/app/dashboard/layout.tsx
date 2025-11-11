// src/app/dashboard/layout.tsx

'use client'; 

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
// --- (CORREGIDO) Usar rutas relativas en lugar de alias ---
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar'; 
import { useHotkeys } from '../../hooks/useHotkeys';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // --- Lógica de Atajos de Teclado (Fase 0 - Usabilidad) ---
  useHotkeys('alt+d', (e) => { e.preventDefault(); router.push('/dashboard'); });
  useHotkeys('alt+p', (e) => { e.preventDefault(); router.push('/dashboard/products'); });
  useHotkeys('alt+u', (e) => { e.preventDefault(); router.push('/dashboard/users'); });
  useHotkeys('alt+r', (e) => { e.preventDefault(); router.push('/dashboard/reports'); });
  useHotkeys('alt+b', (e) => { e.preventDefault(); router.push('/dashboard/logs'); });
  // --- Fin de Atajos ---

  // EFECTO DE SEGURIDAD (Protección de Ruta)
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // No renderiza nada si no está autenticado (evita flash de contenido)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Cargando...</p>
      </div>
    );
  }

  // Renderiza el Layout si SÍ está autenticado
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}