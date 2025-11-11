// src/app/dashboard/customers/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { getUsers, IUser, toggleUserStatus, deleteUser } from '@/services/userService';
import UserFormModal from '@/components/UserFormModal'; // 1. Importa el Modal

export default function CustomersPage() {
  const [customers, setCustomers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- ESTADO PARA MANEJAR EL MODAL (CREAR/EDITAR) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<IUser | null>(null);

  // Función para cargar/refrescar los clientes
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setCustomers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handler para refrescar la tabla cuando el modal termine
  const handleSave = () => {
    fetchData();
  };

  // --- HANDLER PARA ABRIR MODAL (CREAR) ---
  const handleOpenCreateModal = () => {
    setCustomerToEdit(null); // Sin cliente a editar
    setIsModalOpen(true);
  };

  // --- HANDLER PARA ABRIR MODAL (EDITAR) ---
  const handleOpenEditModal = (customer: IUser) => {
    setCustomerToEdit(customer); // Con cliente a editar
    setIsModalOpen(true);
  };

  // Handler para Toggle Status (Activar/Desactivar)
  const handleToggleStatus = async (id: number, newStatus: boolean) => {
    const action = newStatus ? 'activar' : 'desactivar';
    if (window.confirm(`¿Estás seguro de que quieres ${action} este usuario?`)) {
      try {
        await toggleUserStatus(id, newStatus);
        fetchData(); // Refresca la tabla
      } catch (err: any) {
        setError(err.message || `Error al ${action} el usuario.`);
      }
    }
  };

  // Handler para Eliminar Permanente
  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar permanentemente este usuario? Esta acción no se puede deshacer.')) {
      try {
        await deleteUser(id);
        fetchData(); // Refresca la tabla
      } catch (err: any) {
        setError(err.message || 'Error al eliminar el usuario.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <p className="text-lg text-gray-600">Cargando usuarios...</p>
      </div>
    );
  }
  
  if (error) {
     return (
      <div className="flex items-center justify-center p-10">
        <p className="text-lg text-red-600 bg-red-100 p-4 rounded-md border border-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
        
        {/* Botón de Crear (Abre el Modal en modo 'Crear') */}
        <button
          onClick={handleOpenCreateModal}
          className="bg-[#00BCD4] hover:bg-[#0097A7] text-white font-semibold py-2 px-4 rounded-md"
        >
          + Nuevo Usuario
        </button>
      </div>

      {error && (
        <p className="mb-4 text-center text-red-600 bg-red-100 p-4 rounded-md border border-red-300">
          {error}
        </p>
      )}

      {/* --- Tabla de Usuarios --- */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{customer.first_name} {customer.last_name}</div>
                  <div className="text-xs text-gray-500">@{customer.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {customer.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {customer.phone || 'N/A'}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {customer.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      customer.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {customer.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleOpenEditModal(customer)}
                    className="text-[#FF9800] hover:text-[#FB8C00] mr-3"
                    disabled={customer.is_superuser}
                  >
                    Editar
                  </button>
                  {customer.is_active ? (
                    <button
                      onClick={() => handleToggleStatus(customer.id, false)}
                      className="text-red-600 hover:text-red-800 mr-3"
                      disabled={customer.is_superuser}
                    >
                      Desactivar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleStatus(customer.id, true)}
                      className="text-green-600 hover:text-green-800 mr-3"
                      disabled={customer.is_superuser}
                    >
                      Activar
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="text-red-800 hover:text-red-900"
                    disabled={customer.is_superuser}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
       {customers.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay usuarios registrados.</p>
        </div>
      )}

      {/* Renderiza el Modal (Funciona para 'Crear' y 'Editar') */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        userToEdit={customerToEdit}
      />
    </div>
  );
}