'use client';

import React, { useState, useEffect } from 'react';
// --- CORRECCIÓN: Se usan rutas relativas para arreglar el error de compilación ---
import { getUsers, IUser, toggleUserStatus, deleteUser } from '../../../services/userService';
import UserFormModal from '../../../components/UserFormModal'; // 1. Importa el Modal

// --- CORRECCIÓN: Renombrado el componente para mayor claridad ---
export default function UsersPage() {
  
  // --- CORRECCIÓN: Renombradas variables de 'customers' a 'users' ---
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- ESTADO PARA MANEJAR EL MODAL (CREAR/EDITAR) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- CORRECCIÓN: Renombrada variable de 'customerToEdit' a 'userToEdit' ---
  const [userToEdit, setUserToEdit] = useState<IUser | null>(null);

  // Función para cargar/refrescar los usuarios
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data); // --- CORRECCIÓN ---
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
    setUserToEdit(null); // Sin usuario a editar (CORRECCIÓN)
    setIsModalOpen(true);
  };

  // --- HANDLER PARA ABRIR MODAL (EDITAR) ---
  const handleOpenEditModal = (user: IUser) => { // (CORRECCIÓN)
    setUserToEdit(user); // Con usuario a editar (CORRECCIÓN)
    setIsModalOpen(true);
  };

  // Handler para Toggle Status (Activar/Desactivar)
  const handleToggleStatus = async (id: number, newStatus: boolean) => {
    const action = newStatus ? 'activar' : 'desactivar';
    // NOTA: window.confirm() puede no funcionar en todos los entornos, 
    // pero lo dejamos como estaba en tu código original.
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
            {/* --- CORRECCIÓN: Mapeo sobre 'users' --- */}
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* --- CORRECCIÓN: usa 'user' --- */}
                  <div className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</div>
                  <div className="text-xs text-gray-500">@{user.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {user.phone || 'N/A'}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-800' :
                      user.role === 'OPERATOR' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleOpenEditModal(user)} // --- CORRECCIÓN ---
                    className="text-[#FF9800] hover:text-[#FB8C00] mr-3"
                    disabled={user.is_superuser} // --- CORRECCIÓN ---
                  >
                    Editar
                  </button>
                  {user.is_active ? (
                    <button
                      // --- CORRECCIÓN DE BUG: era 'users.id' ---
                      onClick={() => handleToggleStatus(user.id, false)} 
                      className="text-red-600 hover:text-red-800 mr-3"
                      // --- CORRECCIÓN DE BUG: era 'users.is_superuser' ---
                      disabled={user.is_superuser} 
                    >
                      Desactivar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleStatus(user.id, true)} // --- CORRECCIÓN ---
                      className="text-green-600 hover:text-green-800 mr-3"
                      disabled={user.is_superuser} // --- CORRECCIÓN ---
                    >
                      Activar
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user.id)} // --- CORRECCIÓN ---
                    className="text-red-800 hover:text-red-900"
                    disabled={user.is_superuser} // --- CORRECCIÓN ---
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
       {/* --- CORRECCIÓN: 'users.length' --- */}
       {users.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay usuarios registrados.</p>
        </div>
      )}

      {/* Renderiza el Modal (Funciona para 'Crear' y 'Editar') */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        userToEdit={userToEdit} // --- CORRECCIÓN ---
      />
    </div>
  );
}