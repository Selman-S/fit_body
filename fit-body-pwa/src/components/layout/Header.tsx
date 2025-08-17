'use client';

import { useState } from 'react';
import { Menu, Bell, User, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface HeaderProps {
  onMenuClick: () => void;
  isMobile: boolean;
}

export function Header({ onMenuClick, isMobile }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuthStore();
  const { addToast } = useToast();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    addToast({
      type: 'success',
      title: 'Çıkış yapıldı',
      message: 'Başarıyla çıkış yapıldı',
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm theme-transition">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section - Menu Button & Logo */}
        <div className="flex items-center gap-3">
          {isMobile && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FB</span>
            </div>
            <span className="font-semibold text-lg text-gray-900 dark:text-white">
              Fit Body
            </span>
          </div>
        </div>

        {/* Right Section - User Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle variant="minimal" size="sm" />
          
          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              {!isMobile && (
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.firstName || user?.username || 'Kullanıcı'}
                </span>
              )}
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <Card className="absolute right-0 top-12 w-48 z-50 p-2">
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        // Navigate to profile
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profil
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        // Navigate to settings
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Ayarlar
                    </button>
                    <hr className="border-gray-200 dark:border-gray-600" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Çıkış Yap
                    </button>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
