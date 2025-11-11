// src/components/UserFormModal.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { IUser, IUserDTO, createUser, updateUser } from '@/services/userService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  userToEdit: IUser | null;
}

const UserFormModal: React.FC<Props> = ({ isOpen, onClose, onSave, userToEdit }) => {
  
  const initialState: IUserDTO = {
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    password: '', // Password solo es requerido al crear
    role: 'CLIENT',
  };

  const [formData, setFormData] = useState<Partial<IUserDTO>>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = userToEdit !== null;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        // Pre-llena el formulario si estamos en modo "Editar"
        setFormData({
          username: userToEdit.username,
          email: userToEdit.email,
          first_name: userToEdit.first_name,
          last_name: userToEdit.last_name,
          phone: userToEdit.phone,
          address: userToEdit.address,
          role: userToEdit.role,
        });
      } else {
        setFormData(initialState);
      }
      setError(null);
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        // Lógica de Editar
        await updateUser(userToEdit.id, formData);
      } else {
        // Lógica de Crear
        if (!formData.password) {
           setError("La contraseña es obligatoria al crear un nuevo usuario.");
           setIsSubmitting(false);
           return;
        }
        await createUser(formData as IUserDTO);
      }
      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar. Revisa los campos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl z-50">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          
          {error && (
             <p className="text-sm font-semibold text-red-600 border border-red-200 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text" name="first_name" id="first_name"
                value={formData.first_name || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900"
              />
            </div>
             <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Apellido</label>
              <input
                type="text" name="last_name" id="last_name"
                value={formData.last_name || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username (Login)</label>
            <input
              type="text" name="username" id="username"
              value={formData.username || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900"
              required
              disabled={isEditMode} // No se puede cambiar el username al editar
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email" name="email" id="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900"
              required
            />
          </div>
          
          {!isEditMode && (
            <div>
              {/* --- INICIO DE LA CORRECCIÓN --- */}
              {/* El error de tipeo estaba aquí (decía </G>) */}
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              {/* --- FIN DE LA CORRECCIÓN --- */}
              <input
                type="password" name="password" id="password"
                value={formData.password || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900"
                required={!isEditMode}
              />
            </div>
          )}

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              type="text" name="phone" id="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900"
            />
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              name="role" id="role"
              value={formData.role || 'CLIENT'}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900"
              required
            >
              <option value="CLIENT">Cliente</option>
              <option value="OPERATOR">Operador</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
            <textarea
              name="address" id="address"
              rows={3}
              value={formData.address || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button
              type="button" onClick={onClose} disabled={isSubmitting}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={isSubmitting}
              className="bg-[#00BCD4] text-white px-4 py-2 rounded-md hover:bg-[#009688]"
            >
              {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar Usuario' : 'Crear Usuario')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
