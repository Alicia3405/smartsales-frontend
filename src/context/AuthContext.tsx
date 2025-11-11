// src/context/AuthContext.tsx

'use client'; // Necesario para Context y hooks

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, getRoleFromToken, logout as authLogout } from '@/services/authService'; // Asume que authService tiene estas funciones

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// 1. Crear el Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Crear el Proveedor (Provider)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  // useEffect para verificar el token al cargar la app (SOLO en el cliente)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = getAccessToken();
      if (token) {
        setIsAuthenticated(true);
        setUserRole(getRoleFromToken());
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    }
  }, []); // Empty dependency array is fine here since we only want this to run once on mount

  const login = (token: string) => {
    // Esta función se llama desde el LoginForm
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token); // Asumimos que authService ya lo hizo, pero confirmamos
      setIsAuthenticated(true);
      setUserRole(getRoleFromToken());
    }
  };

  const logout = () => {
    authLogout(); // Llama al logout de authService
    setIsAuthenticated(false);
    setUserRole(null);
    router.push('/login'); // Redirige al login
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};