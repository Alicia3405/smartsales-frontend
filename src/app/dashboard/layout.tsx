// src/app/dashboard/layout.tsx

'use client'; // Requerido para hooks de cliente (useAuth, useEffect)

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar'; // Usa tu ruta de Sidebar existente

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // EFECTO DE SEGURIDAD (Protección de Ruta)
  useEffect(() => {
    // Si el contexto dice que NO está autenticado, lo patea al login.
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
      {/* 1. El Sidebar (Navegación) */}
      <Sidebar />

      {/* 2. El Contenido Principal (Responsivo) */}
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}