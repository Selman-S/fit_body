// Service Worker Hook - Fit Body PWA
// Manages PWA installation, updates, and offline functionality

import { useState, useEffect, useCallback } from 'react';

interface ServiceWorkerState {
  isInstalled: boolean;
  isUpdateAvailable: boolean;
  isOffline: boolean;
  isInstalling: boolean;
  isUpdating: boolean;
}

interface UseServiceWorkerReturn extends ServiceWorkerState {
  installPWA: () => Promise<void>;
  updatePWA: () => Promise<void>;
  checkForUpdates: () => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BeforeInstallPromptEvent = Event & { 
  prompt: () => Promise<{ outcome: string }>;
  userChoice: Promise<{ outcome: string }>;
};

export const useServiceWorker = (): UseServiceWorkerReturn => {
  const [state, setState] = useState<ServiceWorkerState>({
    isInstalled: false,
    isUpdateAvailable: false,
    isOffline: false,
    isInstalling: false,
    isUpdating: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Check if PWA is installed
  const checkInstallation = useCallback(() => {
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       // eslint-disable-next-line @typescript-eslint/no-explicit-any
                       (window.navigator as any).standalone === true;
    
    setState(prev => ({ ...prev, isInstalled }));
  }, []);

  // Check for updates
  const checkForUpdates = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setState(prev => ({ ...prev, isUpdateAvailable: true }));
                }
              });
            }
          });
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    }
  }, []);

  // Install PWA
  const installPWA = useCallback(async () => {
    if (!deferredPrompt) {
      console.log('No install prompt available');
      return;
    }

    setState(prev => ({ ...prev, isInstalling: true }));

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installed successfully');
        setState(prev => ({ ...prev, isInstalled: true }));
      } else {
        console.log('PWA installation declined');
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('PWA installation failed:', error);
    } finally {
      setState(prev => ({ ...prev, isInstalling: false }));
    }
  }, [deferredPrompt]);

  // Update PWA
  const updatePWA = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      setState(prev => ({ ...prev, isUpdating: true }));

      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          // Send message to waiting service worker to skip waiting
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // Reload page after update
          window.location.reload();
        }
      } catch (error) {
        console.error('PWA update failed:', error);
      } finally {
        setState(prev => ({ ...prev, isUpdating: false }));
      }
    }
  }, []);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        console.log('Service Worker registered successfully:', registration);

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, isUpdateAvailable: true }));
              }
            });
          }
        });

        // Handle controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('Service Worker controller changed');
          setState(prev => ({ ...prev, isUpdateAvailable: false }));
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }, []);

  // Handle beforeinstallprompt event
  const handleBeforeInstallPrompt = useCallback((event: Event) => {
    event.preventDefault();
    setDeferredPrompt(event as BeforeInstallPromptEvent);
    console.log('Install prompt captured');
  }, []);

  // Handle appinstalled event
  const handleAppInstalled = useCallback(() => {
    console.log('PWA was installed');
    setState(prev => ({ ...prev, isInstalled: true }));
    setDeferredPrompt(null);
  }, []);

  // Handle online/offline events
  const handleOnlineStatus = useCallback(() => {
    const isOffline = !navigator.onLine;
    setState(prev => ({ ...prev, isOffline }));
  }, []);

  // Initialize
  useEffect(() => {
    checkInstallation();
    checkForUpdates();
    registerServiceWorker();
    handleOnlineStatus();

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [checkInstallation, checkForUpdates, registerServiceWorker, handleBeforeInstallPrompt, handleAppInstalled, handleOnlineStatus]);

  return {
    ...state,
    installPWA,
    updatePWA,
    checkForUpdates,
  };
};

// PWA Install Button Component Hook
export const usePWAInstallButton = () => {
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    // Check initial installation status
    const checkInstallation = () => {
      const installed = window.matchMedia('(display-mode: standalone)').matches ||
                       // eslint-disable-next-line @typescript-eslint/no-explicit-any
                       (window.navigator as any).standalone === true;
      setIsInstalled(installed);
    };

    checkInstallation();
    handleOnlineStatus();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed successfully');
    }
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const updatePWA = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      } catch (error) {
        console.error('PWA update failed:', error);
      }
    }
  };

  return {
    showInstallButton,
    installPWA,
    isUpdateAvailable,
    updatePWA,
    isInstalled,
    isOffline,
  };
};
