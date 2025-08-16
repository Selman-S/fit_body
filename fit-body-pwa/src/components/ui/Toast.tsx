'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Toast positions
export type ToastPosition = 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';

// Toast interface
export interface ToastProps {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  position?: ToastPosition;
  onClose?: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
  className?: string;
}

// Toast context interface
export interface ToastContextType {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

// Toast context
const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

// Toast provider props
interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
  defaultDuration?: number;
}

// Toast provider component
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
  maxToasts = 5,
  defaultDuration = 5000,
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'id'>): string => {
    const id = crypto.randomUUID();
    const newToast: ToastProps = {
      ...toast,
      id,
      duration: toast.duration ?? defaultDuration,
      position: toast.position ?? position,
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });

    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer position={position} />
    </ToastContext.Provider>
  );
};

// Toast hook
export const useToast = (): ToastContextType => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast container component
interface ToastContainerProps {
  position: ToastPosition;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ position }) => {
  const { toasts, removeToast } = useToast();

  const getPositionClasses = (pos: ToastPosition) => {
    const baseClasses = 'fixed z-50 flex flex-col gap-2 p-4';
    
    switch (pos) {
      case 'top-left':
        return `${baseClasses} top-4 left-4`;
      case 'top-right':
        return `${baseClasses} top-4 right-4`;
      case 'top-center':
        return `${baseClasses} top-4 left-1/2 transform -translate-x-1/2`;
      case 'bottom-left':
        return `${baseClasses} bottom-4 left-4`;
      case 'bottom-right':
        return `${baseClasses} bottom-4 right-4`;
      case 'bottom-center':
        return `${baseClasses} bottom-4 left-1/2 transform -translate-x-1/2`;
      default:
        return `${baseClasses} top-4 right-4`;
    }
  };

  const positionToasts = toasts.filter(toast => toast.position === position);

  if (positionToasts.length === 0) return null;

  return (
    <div className={getPositionClasses(position)}>
      {positionToasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};

// Toast item component
interface ToastItemProps {
  toast: ToastProps;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const animationRef = useRef<Animation | undefined>(undefined);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  }, [onClose, toast.id]);

  // Auto-dismiss timer
  useEffect(() => {
    if (toast.persistent || !toast.duration) return;

    timeoutRef.current = setTimeout(() => {
      handleClose();
    }, toast.duration);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [toast.duration, toast.persistent, handleClose]);

  // Enter animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getToastStyles = () => {
    const baseClasses = 'relative w-80 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden';
    
    const typeClasses = {
      success: 'border-l-4 border-l-green-500',
      error: 'border-l-4 border-l-red-500',
      warning: 'border-l-4 border-l-yellow-500',
      info: 'border-l-4 border-l-blue-500',
    };

    return cn(baseClasses, typeClasses[toast.type]);
  };

  const getIcon = () => {
    const iconClasses = 'w-5 h-5';
    
    switch (toast.type) {
      case 'success':
        return <CheckCircle className={cn(iconClasses, 'text-green-500')} />;
      case 'error':
        return <AlertCircle className={cn(iconClasses, 'text-red-500')} />;
      case 'warning':
        return <AlertTriangle className={cn(iconClasses, 'text-yellow-500')} />;
      case 'info':
        return <Info className={cn(iconClasses, 'text-blue-500')} />;
      default:
        return <Info className={cn(iconClasses, 'text-blue-500')} />;
    }
  };

  const getIconBg = () => {
    const iconBgClasses = 'w-8 h-8 rounded-full flex items-center justify-center';
    
    switch (toast.type) {
      case 'success':
        return cn(iconBgClasses, 'bg-green-100 dark:bg-green-900/20');
      case 'error':
        return cn(iconBgClasses, 'bg-red-100 dark:bg-red-900/20');
      case 'warning':
        return cn(iconBgClasses, 'bg-yellow-100 dark:bg-yellow-900/20');
      case 'info':
        return cn(iconBgClasses, 'bg-blue-100 dark:bg-blue-900/20');
      default:
        return cn(iconBgClasses, 'bg-blue-100 dark:bg-blue-900/20');
    }
  };

  return (
    <div
      className={cn(
        getToastStyles(),
        'transform transition-all duration-300 ease-out',
        isVisible && !isExiting ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95',
        isExiting && 'translate-x-full opacity-0 scale-95'
      )}
      style={{
        transform: isVisible && !isExiting ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible && !isExiting ? 1 : 0,
        transformOrigin: 'right center',
      }}
    >
      {/* Progress bar */}
      {!toast.persistent && toast.duration && (
        <div className="absolute top-0 left-0 h-1 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-green-500 transition-all duration-300 ease-linear"
            style={{
              width: isExiting ? '0%' : '100%',
              transitionDuration: `${toast.duration}ms`,
            }}
          />
        </div>
      )}

      <div className="flex items-start p-4">
        {/* Icon */}
        <div className={getIconBg()}>
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 ml-3 min-w-0">
          {toast.title && (
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {toast.title}
            </h4>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {toast.message}
          </p>
          
          {/* Action button */}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="ml-4 -mt-1 -mr-1 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

// Convenience functions for different toast types
export const createToastHelpers = (addToast: (toast: Omit<ToastProps, 'id'>) => string) => ({
  success: (message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'message'>>) =>
    addToast({ type: 'success', message, ...options }),
  
  error: (message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'message'>>) =>
    addToast({ type: 'error', message, ...options }),
  
  warning: (message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'message'>>) =>
    addToast({ type: 'warning', message, ...options }),
  
  info: (message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'message'>>) =>
    addToast({ type: 'info', message, ...options }),
});

// Toast component for direct usage
export const Toast: React.FC<Omit<ToastProps, 'id'> & { show: boolean }> = ({ show, ...props }) => {
  const { addToast, removeToast } = useToast();
  const [toastId, setToastId] = useState<string | null>(null);

  useEffect(() => {
    if (show && !toastId) {
      const id = addToast(props);
      setToastId(id);
    } else if (!show && toastId) {
      removeToast(toastId);
      setToastId(null);
    }
  }, [show, props, toastId, addToast, removeToast]);

  return null;
};

// Export all components
export { ToastProvider as default };
