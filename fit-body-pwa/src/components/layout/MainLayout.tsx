'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNavigation } from './BottomNavigation';

interface MainLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export function MainLayout({ children, showNavigation = true }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated } = useAuthStore();
  
  // Debug state - sadece state değiştiğinde
  useEffect(() => {
  }, [isSidebarOpen, isMobile, isAuthenticated]);

  // Responsive breakpoint detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when switching to mobile - REMOVED (causing infinite loop)

  // Don't show navigation for auth pages
  if (!showNavigation || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header - Always visible */}
      <Header 
        onMenuClick={() => {
          setIsSidebarOpen(true);
        }}
        isMobile={isMobile}
      />

      {/* Desktop Layout */}
      {!isMobile && (
        <div className="hidden lg:flex">
          {/* Sidebar - Desktop only */}
          <Sidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            isMobile={false}
          />
          
          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <div className="lg:hidden">
          {/* Sidebar Overlay - Mobile only */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar - Mobile only */}
          <Sidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            isMobile={true}
          />
          
          {/* Main Content - Mobile */}
          <main className="pb-20 px-4 py-6">
            {children}
          </main>
          
          {/* Bottom Navigation - Mobile only */}
          <BottomNavigation />
        </div>
      )}
    </div>
  );
}
