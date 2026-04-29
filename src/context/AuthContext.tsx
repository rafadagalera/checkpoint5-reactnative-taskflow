import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole, Treatment } from '../types/user';

const USERS: User[] = [
  { id: 1, username: 'admin', password: '123', role: 'admin', name: 'Administrador' },
  { id: 2, username: 'user', password: '123', role: 'user', name: 'Usuário Comum' },
];

const AUTH_KEY = '@taskflow:auth';
const TREATMENT_KEY = '@taskflow:treatment';

interface AuthContextData {
  user: User | null;
  treatment: Treatment;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<UserRole | null>;
  logout: () => Promise<void>;
  setTreatment: (t: Treatment) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [treatment, setTreatmentState] = useState<Treatment>('Sr.');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restore() {
      const json = await AsyncStorage.getItem(AUTH_KEY);
      const savedTreatment = await AsyncStorage.getItem(TREATMENT_KEY);
      if (json) setUser(JSON.parse(json) as User);
      if (savedTreatment) setTreatmentState(savedTreatment as Treatment);
      setIsLoading(false);
    }
    restore();
  }, []);

  async function login(username: string, password: string): Promise<UserRole | null> {
    const found = USERS.find(u => u.username === username && u.password === password);
    if (!found) return null;
    setUser(found);
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(found));
    return found.role;
  }

  async function logout() {
    setUser(null);
    await AsyncStorage.removeItem(AUTH_KEY);
  }

  async function setTreatment(t: Treatment) {
    setTreatmentState(t);
    await AsyncStorage.setItem(TREATMENT_KEY, t);
  }

  return (
    <AuthContext.Provider value={{ user, treatment, isLoading, login, logout, setTreatment }}>
      {children}
    </AuthContext.Provider>
  );
}
