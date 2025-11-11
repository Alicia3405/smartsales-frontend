// src/components/Sidebar.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getRoleFromToken } from '@/services/authService'; 
import { useRouter } from 'next/navigation'; // Importar useRouter

const Sidebar: React.FC = () => {
  const { logout } = useAuth(); 
  const userRole = getRoleFromToken(); // Obtenemos el rol directamente del token
  const router = useRouter(); // Hook para el logout

  // Definición de enlaces basada en Roles
  // (¡Asegúrate que 'Admin' coincida con lo que devuelve tu token!)
  const isAdmin = userRole === 'Admin' || userRole === 'Administrador';
  
  // *** ESTA ES LA LÍNEA CORREGIDA (Era '===T') ***
  const isOperator = userRole === 'Operador';

  const handleLogout = () => {
    logout();
    // No es necesario router.push('/login') si el AuthProvider
    // y el DashboardLayout manejan la redirección automáticamente.
  };
  
  return (
    // Paleta de colores: Fondo Azul Calipso
    <div className="w-64 h-screen bg-[#00BCD4] text-white flex flex-col shadow-lg">
      
      {/* Encabezado del Sidebar (Logo/Nombre) */}
      <div className="p-6 border-b border-teal-600">
        <h1 className="text-2xl font-bold text-white">SmartSales</h1>
        <p className="text-sm text-teal-100">Rol: {userRole || 'Desconocido'}</p>
      </div>

      {/* Navegación Principal (Hover con Calipso más oscuro) */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <Link href="/dashboard" className="block px-4 py-2 rounded-md hover:bg-[#009688]">
          Dashboard (IA)
        </Link>
        
        {/* Enlaces de Cliente/Operador */}
        <Link href="/dashboard/profile" className="block px-4 py-2 rounded-md hover:bg-[#009688]">
          Perfil
        </Link>
        <Link href="/dashboard/orders" className="block px-4 py-2 rounded-md hover:bg-[#009688]">
          Órdenes
        </Link>

        {/* Enlaces SOLO de Operador y Admin */}
        {(isAdmin || isOperator) && (
          <>
            <Link href="/dashboard/products" className="block px-4 py-2 rounded-md hover:bg-[#009688]">
              Productos (CRUD)
            </Link>
            <Link href="/dashboard/inventory" className="block px-4 py-2 rounded-md hover:bg-[#009688]">
              Inventario
            </Link>
            <Link href="/dashboard/customers" className="block px-4 py-2 rounded-md hover:bg-[#009688]">
              Usuarios
            </Link>
          </>
        )}

        {/* Enlaces SOLO de Admin */}
        {isAdmin && (
          <>
            <Link href="/dashboard/reports" className="block px-4 py-2 rounded-md hover:bg-[#009688]">
              Reportes Dinámicos
            </Link>
            <Link href="/dashboard/logs" className="block px-4 py-2 rounded-md hover:bg-[#009688]">
              Bitácora (Log)
            </Link>
          </>
        )}
      </nav>

      {/* Botón de Logout (Paleta Naranja Secundaria) */}
      <div className="p-4 border-t border-teal-600">
        <button
          onClick={handleLogout} 
          className="w-full py-2 px-4 rounded-md font-semibold text-white bg-[#FF9800] hover:bg-[#FB8C00] transition duration-150"
        >
          Cerrar Sesión (Logout)
        </button>
      </div>
    </div>
  );
};

export default Sidebar;