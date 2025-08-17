'use client';

import { useState } from 'react';
import { 
  Home, 
  Dumbbell, 
  TrendingUp, 
  Settings, 
  Calendar,
  Target,
  Trophy,
  BarChart3,
  X
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const navigationItems = [
  { icon: Home, label: 'Ana Sayfa', href: '/dashboard', color: 'text-blue-500' },
  { icon: Dumbbell, label: 'Antrenman', href: '/workout', color: 'text-green-500' },
  { icon: TrendingUp, label: 'İlerleme', href: '/progress', color: 'text-purple-500' },
  { icon: Calendar, label: 'Program', href: '/program', color: 'text-orange-500' },
  { icon: Target, label: 'Hedefler', href: '/goals', color: 'text-red-500' },
  { icon: Trophy, label: 'Başarılar', href: '/achievements', color: 'text-yellow-500' },
  { icon: BarChart3, label: 'İstatistikler', href: '/stats', color: 'text-indigo-500' },
  { icon: Settings, label: 'Ayarlar', href: '/settings', color: 'text-gray-500' },
];

export function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const { user } = useAuthStore();
  const [activeItem, setActiveItem] = useState('/dashboard');

  const handleNavigation = (href: string) => {
    setActiveItem(href);
    if (isMobile) {
      onClose();
    }
    // TODO: Implement navigation
  };

  const sidebarClasses = cn(
    'bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out',
    isMobile
      ? 'fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out'
      : 'w-64 h-screen',
    isMobile && (isOpen ? 'translate-x-0' : '-translate-x-full')
  );

  return (
    <>
      <aside className={sidebarClasses}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FB</span>
            </div>
            <span className="font-semibold text-lg text-gray-900 dark:text-white theme-text">
              Fit Body
            </span>
          </div>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* User Profile Card */}
        <div className="p-4 border-b border-gray-200  dark:border-gray-700">
          <Card className="p-4 bg-gradient-to-br sidebar-profile-name from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate theme-text">
                  {user?.firstName || user?.username || 'Kullanıcı'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate theme-text">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.href;
            
            return (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                                 className={cn(
                   'w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left sidebar-navigation-item',
                   isActive
                     ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                     : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                 )}
              >
                <Icon className={cn('w-5 h-5', item.color)} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

                 {/* Quick Stats */}
         <div className="p-4 border-t border-gray-200 dark:border-gray-700">
           <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
             Bu Hafta
           </h4>
           <div className="space-y-2">
             <div className="flex items-center justify-between text-sm">
               <span className="text-gray-700 dark:text-gray-300">Antrenman</span>
               <span className="font-semibold text-green-600">5/7</span>
             </div>
             <div className="flex items-center justify-between text-sm">
               <span className="text-gray-700 dark:text-gray-300">Süre</span>
               <span className="font-semibold text-blue-600">4.2s</span>
             </div>
             <div className="flex items-center justify-between text-sm">
               <span className="text-gray-700 dark:text-gray-300">Kalori</span>
               <span className="font-semibold text-orange-600">1,250</span>
             </div>
           </div>
         </div>
      </aside>
    </>
  );
}
