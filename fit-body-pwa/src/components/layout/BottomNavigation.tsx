'use client';

import { useState } from 'react';
import { 
  Home, 
  Dumbbell, 
  TrendingUp, 
  Calendar,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { icon: Home, label: 'Ana Sayfa', href: '/dashboard', color: 'text-blue-500' },
  { icon: Dumbbell, label: 'Antrenman', href: '/workout', color: 'text-green-500' },
  { icon: TrendingUp, label: 'İlerleme', href: '/progress', color: 'text-purple-500' },
  { icon: Calendar, label: 'Program', href: '/program', color: 'text-orange-500' },
  { icon: User, label: 'Profil', href: '/profile', color: 'text-gray-500' },
];

export function BottomNavigation() {
  const [activeItem, setActiveItem] = useState('/dashboard');

  const handleNavigation = (href: string) => {
    setActiveItem(href);
    // TODO: Implement navigation
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-around h-16 px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.href;
          
          return (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full min-w-0 transition-all duration-200',
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              )}
            >
              <Icon 
                className={cn(
                  'w-5 h-5 mb-1 transition-all duration-200',
                  isActive ? 'scale-110' : 'scale-100'
                )} 
              />
              <span className={cn(
                'text-xs font-medium transition-all duration-200',
                isActive ? 'opacity-100' : 'opacity-80'
              )}>
                {item.label}
              </span>
              
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Safe Area for iOS */}
      <div className="h-safe-area-inset-bottom bg-white dark:bg-gray-800" />
    </nav>
  );
}
