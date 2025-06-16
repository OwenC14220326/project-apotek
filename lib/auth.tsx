'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getAuth,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { app } from '../lib/firebase'; // Pastikan path ini sesuai dengan struktur proyek Anda

const auth = getAuth(app);
const db = getFirestore(app);

interface User {
  id_user: string;
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'user', firebaseUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const userData = snap.data();
          const userSession: User = {
            id_user: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: userData.role,
            nama: userData.nama,
          };
          setUser(userSession);
          localStorage.setItem('apotek_user', JSON.stringify(userSession));
        }
      } else {
        setUser(null);
        localStorage.removeItem('apotek_user');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;
      const userDoc = await getDoc(doc(db, 'user', uid));
      if (!userDoc.exists()) return false;

      const data = userDoc.data();
      const userSession: User = {
        id_user: uid,
        email: res.user.email || '',
        role: data.role,
        nama: data.nama,
      };

      setUser(userSession);
      localStorage.setItem('apotek_user', JSON.stringify(userSession));
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const register = async (email: string, password: string, nama: string): Promise<boolean> => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      const userData = {
        email,
        nama,
        role: 'user',
        created_at: new Date().toISOString(),
      };

      await setDoc(doc(db, 'user', uid), userData);

      const userSession: User = {
        id_user: uid,
        email,
        role: 'user',
        nama,
      };

      setUser(userSession);
      localStorage.setItem('apotek_user', JSON.stringify(userSession));
      return true;
    } catch (err) {
      console.error('Register error:', err);
      return false;
    }
  };

  const logout = () => {
    signOut(auth);
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
