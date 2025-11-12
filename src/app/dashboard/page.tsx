'use client';
// Este es el código de BIENVENIDA que va en la ruta principal /dashboard

import React from 'react';
// 1. IMPORTAMOS el hook para navegar
import { useRouter } from 'next/navigation'; 

export default function DashboardPage() {
  // 2. INICIALIZAMOS el hook
  const router = useRouter();

  // 3. Creamos una función simple para navegar
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado de Bienvenida */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Bienvenido al panel de control de SmartSales. Aquí puedes gestionar productos, inventario y más.</p>
      </div>

      {/* Tarjetas de Acceso Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Tarjeta de Productos */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Productos</h2>
          <p className="text-gray-600">Gestiona tu catálogo de productos.</p>
          {/* 4. CAMBIAMOS <a> por <button> y usamos onClick */}
          <button
            onClick={() => handleNavigation('/dashboard/products')}
            className="mt-4 bg-[#00BCD4] hover:bg-[#0097A7] text-white font-semibold py-2 px-4 rounded-md transition duration-150"
          >
            Ver Productos
          </button>
        </div>

        {/* Tarjeta de Inventario */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Inventario</h2>
          <p className="text-gray-600">Controla el stock y movimientos.</p>
          {/* 4. CAMBIAMOS <a> por <button> y usamos onClick */}
          <button
            onClick={() => handleNavigation('/dashboard/inventory')}
            className="mt-4 bg-[#00BCD4] hover:bg-[#0097A7] text-white font-semibold py-2 px-4 rounded-md transition duration-150"
          >
            Ver Inventario
          </button>
        </div>

        {/* Tarjeta de Reportes */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Reportes</h2>
          <p className="text-gray-600">Genera reportes dinámmicos.</p>
          {/* 4. CAMBIAMOS <a> por <button> y usamos onClick */}
          <button
            onClick={() => handleNavigation('/dashboard/reports')}
            className="mt-4 bg-[#00BCD4] hover:bg-[#0097A7] text-white font-semibold py-2 px-4 rounded-md transition duration-150"
          >
            Ver Reportes
          </button>
        </div>

      </div>
    </div>
  );
}