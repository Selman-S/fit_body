'use client';

import React from 'react';
import { Button } from './Button';
import { useThemeStore, Theme } from '@/lib/stores/themeStore';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: 'button' | 'dropdown' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'button',
  size = 'md',
}) => {
  const { theme, setTheme, isDark } = useThemeStore();

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Açık', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Koyu', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: 'Sistem', icon: <Monitor className="w-4 h-4" /> },
  ];

  if (variant === 'minimal') {
    return (
      <Button
        variant="ghost"
        size={size}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={cn('p-2', className)}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </Button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={cn('relative', className)}>
        <Button
          variant="outline"
          size={size}
          className="flex items-center gap-2"
          onClick={() => {
            const currentIndex = themes.findIndex(t => t.value === theme);
            const nextIndex = (currentIndex + 1) % themes.length;
            setTheme(themes[nextIndex].value);
          }}
        >
          {themes.find(t => t.value === theme)?.icon}
          <span className="hidden sm:inline">
            {themes.find(t => t.value === theme)?.label}
          </span>
        </Button>
      </div>
    );
  }

  // Default button variant
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {themes.map((themeOption) => (
        <Button
          key={themeOption.value}
          variant={theme === themeOption.value ? 'primary' : 'ghost'}
          size={size}
          onClick={() => setTheme(themeOption.value)}
          className={cn(
            'flex items-center gap-2 transition-all duration-200',
            theme === themeOption.value && 'shadow-md'
          )}
          aria-label={`Switch to ${themeOption.label} theme`}
        >
          {themeOption.icon}
          <span className="hidden sm:inline">{themeOption.label}</span>
        </Button>
      ))}
    </div>
  );
};

// Floating Theme Toggle
export const FloatingThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isDark, setTheme } = useThemeStore();

  return (
    <Button
      variant="primary"
      size="lg"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'fixed bottom-6 left-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white z-50',
        'bg-blue-600 hover:bg-blue-700 transition-all duration-200',
        className
      )}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
    </Button>
  );
};

// Theme Indicator
export const ThemeIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, isDark } = useThemeStore();

  const getThemeInfo = () => {
    switch (theme) {
      case 'light':
        return { icon: <Sun className="w-4 h-4 text-yellow-500" />, label: 'Açık Tema' };
      case 'dark':
        return { icon: <Moon className="w-4 h-4 text-blue-400" />, label: 'Koyu Tema' };
      case 'system':
        return { 
          icon: <Monitor className="w-4 h-4 text-gray-500" />, 
          label: `Sistem (${isDark ? 'Koyu' : 'Açık'})` 
        };
      default:
        return { icon: <Monitor className="w-4 h-4" />, label: 'Tema' };
    }
  };

  const themeInfo = getThemeInfo();

  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      {themeInfo.icon}
      <span className="text-gray-600 dark:text-gray-300">{themeInfo.label}</span>
    </div>
  );
};
