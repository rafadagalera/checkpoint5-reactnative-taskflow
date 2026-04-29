import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@taskflow:theme';

export type ThemeMode = 'light' | 'dark';

export interface AppTheme {
  mode: ThemeMode;
  background: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  primary: string;
  primaryText: string;
  error: string;
  success: string;
  warning: string;
  inputBackground: string;
}

const lightTheme: AppTheme = {
  mode: 'light',
  background: '#F5F7FA',
  card: '#FFFFFF',
  text: '#1A1A2E',
  subtext: '#6B7280',
  border: '#E5E7EB',
  primary: '#4F46E5',
  primaryText: '#FFFFFF',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  inputBackground: '#FFFFFF',
};

const darkTheme: AppTheme = {
  mode: 'dark',
  background: '#0F0F1A',
  card: '#1E1E2E',
  text: '#F1F5F9',
  subtext: '#94A3B8',
  border: '#2D2D3F',
  primary: '#6366F1',
  primaryText: '#FFFFFF',
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24',
  inputBackground: '#2D2D3F',
};

interface ThemeContextData {
  theme: AppTheme;
  toggleTheme: () => Promise<void>;
}

export const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then(saved => {
      if (saved === 'dark' || saved === 'light') setMode(saved);
    });
  }, []);

  async function toggleTheme() {
    const next: ThemeMode = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    await AsyncStorage.setItem(THEME_KEY, next);
  }

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
