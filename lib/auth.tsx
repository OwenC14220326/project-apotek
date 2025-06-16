'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id_user: number;
  email: string;
  role: 'admin' | 'user';
  nama: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, nama: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('apotek_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/user');
      const users = await response.json();
      
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const userSession = {
          id_user: foundUser.id_user,
          email: foundUser.email,
          role: foundUser.role,
          nama: foundUser.nama
        };
        setUser(userSession);
        localStorage.setItem('apotek_user', JSON.stringify(userSession));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, nama: string): Promise<boolean> => {
    try {
      // Check if email already exists
      const response = await fetch('http://localhost:5000/user');
      const users = await response.json();
      
      if (users.some((u: any) => u.email === email)) {
        return false; // Email already exists
      }

      // Create new user
      const newUser = {
        email,
        password,
        nama,
        role: 'user',
        created_at: new Date().toISOString()
      };

      const createResponse = await fetch('http://localhost:5000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (createResponse.ok) {
        const createdUser = await createResponse.json();
        const userSession = {
          id_user: createdUser.id_user,
          email: createdUser.email,
          role: createdUser.role,
          nama: createdUser.nama
        };
        setUser(userSession);
        localStorage.setItem('apotek_user', JSON.stringify(userSession));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('apotek_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}