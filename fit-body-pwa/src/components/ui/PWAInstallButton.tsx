// PWA Install Button Component - Fit Body PWA
// Shows install prompt when PWA can be installed

'use client';

import React from 'react';
import { Button } from './Button';
import { usePWAInstallButton } from '@/lib/hooks/useServiceWorker';
import { Download, Check, Smartphone } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'default' | 'floating' | 'banner';
  size?: 'sm' | 'md' | 'lg';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'default',
  size = 'md',
}) => {
  const { showInstallButton, installPWA } = usePWAInstallButton();

  if (!showInstallButton) {
    return null;
  }

  const buttonContent = (
    <>
      <Download className="w-4 h-4 mr-2" />
      Uygulamayı Yükle
    </>
  );

  const buttonProps = {
    onClick: installPWA,
    size,
    className: className,
  };

  switch (variant) {
    case 'floating':
      return (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            {...buttonProps}
            variant="primary"
            className={`${className} shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200`}
          >
            {buttonContent}
          </Button>
        </div>
      );

    case 'banner':
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Smartphone className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-900">
                  Fit Body&apos;i Yükle
                </h3>
                <p className="text-xs text-blue-700">
                  Hızlı erişim için ana ekrana ekleyin
                </p>
              </div>
            </div>
            <Button
              {...buttonProps}
              variant="primary"
              size="sm"
            >
              Yükle
            </Button>
          </div>
        </div>
      );

    default:
      return (
        <Button
          {...buttonProps}
          variant="primary"
        >
          {buttonContent}
        </Button>
      );
  }
};

// PWA Update Notification Component
export const PWAUpdateNotification: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isUpdateAvailable, updatePWA } = usePWAInstallButton();

  if (!isUpdateAvailable) {
    return null;
  }

  return (
    <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Check className="w-5 h-5 text-green-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-green-900">
              Güncelleme Mevcut
            </h3>
            <p className="text-xs text-green-700">
              Yeni özellikler için uygulamayı güncelleyin
            </p>
          </div>
        </div>
        <Button
          onClick={updatePWA}
          variant="success"
          size="sm"
        >
          Güncelle
        </Button>
      </div>
    </div>
  );
};

// PWA Status Indicator Component
export const PWAStatusIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstalled, isOffline } = usePWAInstallButton();

  if (!isInstalled) {
    return null;
  }

  return (
    <div className={`flex items-center text-xs ${className}`}>
      {isOffline ? (
        <div className="flex items-center text-orange-600">
          <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
          Çevrimdışı
        </div>
      ) : (
        <div className="flex items-center text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Çevrimiçi
        </div>
      )}
    </div>
  );
};
