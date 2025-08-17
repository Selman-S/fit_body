'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isInitialized } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);


  useEffect(() => {
    
    // Wait for auth to be initialized before checking
    if (!isInitialized) {
      return;
    }
    
    // Check authentication status
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        // Redirect to login if not authenticated
        router.push('/login');
      } else {
        setIsChecking(false);
      }
    } else {
    }
  }, [isAuthenticated, user, isLoading, isInitialized, router]);

  // Show loading while checking auth or initializing
  if (isLoading || isChecking || !isInitialized) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {!isInitialized ? 'Initializing...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Show children if authenticated
  if (isAuthenticated && user) {
    return <>{children}</>;
  }

  // This should not be reached due to redirect above
  return null;
}
