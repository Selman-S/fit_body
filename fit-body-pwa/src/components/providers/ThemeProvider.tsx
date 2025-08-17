'use client';

import React, { useEffect } from 'react';
import { useThemeStore } from '@/lib/stores/themeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme on mount
    initializeTheme();
  }, [initializeTheme]);

  return <>{children}</>;
};
