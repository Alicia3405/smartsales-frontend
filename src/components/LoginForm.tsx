// src/components/LoginForm.tsx

'use client'; 

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Usa el hook del Contexto
import { login as apiLogin } from '@/services/authService'; // Importa el servicio

// Componente del formulario de Login
const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login: contextLogin } = useAuth(); // Obtiene la función login del contexto

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await apiLogin(username, password);
      
      // Si el login en el backend es exitoso...
      if (data.access) {
        // ...actualiza el estado global del contexto...
        contextLogin(data.access); 
        // ...y redirige al dashboard.
        router.push('/dashboard');
      }
      
    } catch (error) {
      setError("Credenciales inválidas. Por favor, verifica el usuario y la contraseña.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Paleta de colores: Borde superior Azul Calipso */}
      <div className="p-8 bg-white shadow-xl rounded-lg w-full max-w-md border-t-4 border-[#00BCD4]">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          SmartSales Login
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="username-input" className="text-sm font-medium text-gray-700">
              Usuario
            </label>
            <input
              id="username-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="admin_test"
              required
            />
          </div>

          <div>
            <label htmlFor="password-input" className="text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="******"
              required
            />
          </div>

          {/* Mensaje de Error */}
          {error && (
            <p className="text-sm font-semibold text-red-600 border border-red-200 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          {/* Botón de Login (Azul Calipso) */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-md font-semibold text-white bg-[#00BCD4] hover:bg-[#009688] transition duration-150 shadow-md"
          >
            Iniciar Sesión
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default LoginForm;