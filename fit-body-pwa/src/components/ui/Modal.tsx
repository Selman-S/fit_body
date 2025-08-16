'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

// Modal variants
const modalVariants = {
  default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
  elevated: 'bg-white dark:bg-gray-800 shadow-2xl border-0',
  outline: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
  glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/20',
};

// Modal sizes
const modalSizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  full: 'max-w-full mx-4',
};

// Modal positions
const modalPositions = {
  center: 'items-center justify-center',
  top: 'items-start justify-center pt-16',
  bottom: 'items-end justify-center pb-16',
  left: 'items-center justify-start pl-16',
  right: 'items-center justify-end pr-16',
} as const;

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: keyof typeof modalSizes;
  variant?: keyof typeof modalVariants;
  position?: keyof typeof modalPositions;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  fullScreen?: boolean;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  showBackdrop?: boolean;
  backdropClassName?: string;
  animation?: 'fade' | 'slide' | 'scale' | 'none';
  zIndex?: number;
}

export interface ModalHeaderProps {
  title?: string;
  description?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export interface ModalFooterProps {
  children?: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

export interface ModalContentProps {
  children?: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// Modal Header Component
export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  description,
  onClose,
  showCloseButton = true,
  className,
  titleClassName,
  descriptionClassName,
}) => {
  if (!title && !description && !showCloseButton) return null;

  return (
    <div className={cn('flex items-start justify-between p-6 pb-0', className)}>
      <div className="flex-1 min-w-0">
        {title && (
          <h2
            className={cn(
              'text-lg font-semibold text-gray-900 dark:text-white leading-6',
              titleClassName
            )}
          >
            {title}
          </h2>
        )}
        {description && (
          <p
            className={cn(
              'mt-1 text-sm text-gray-500 dark:text-gray-400',
              descriptionClassName
            )}
          >
            {description}
          </p>
        )}
      </div>
      {showCloseButton && onClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="ml-3 -mt-1 -mr-1 h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      )}
    </div>
  );
};

// Modal Content Component
export const ModalContent: React.FC<ModalContentProps> = ({
  children,
  className,
  padding = 'md',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'px-6 py-4',
    md: 'px-6 py-6',
    lg: 'px-8 py-8',
  };

  return (
    <div className={cn('flex-1 overflow-y-auto', paddingClasses[padding], className)}>
      {children}
    </div>
  );
};

// Modal Footer Component
export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className,
  align = 'right',
}) => {
  if (!children) return null;

  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-6 pt-0',
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
};

// Main Modal Component
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  variant = 'default',
  position = 'center',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  fullScreen = false,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  showBackdrop = true,
  backdropClassName,
  animation = 'fade',
  zIndex = 50,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle focus management
  useEffect(() => {
    if (!isOpen) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the modal
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  // Animation classes
  const getAnimationClasses = () => {
    if (animation === 'none') return '';
    
    const baseClasses = 'transition-all duration-300 ease-out';
    
    switch (animation) {
      case 'fade':
        return `${baseClasses} ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`;
      case 'slide':
        return `${baseClasses} ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`;
      case 'scale':
        return `${baseClasses} ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`;
      default:
        return baseClasses;
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={cn(
        'fixed inset-0 z-50 flex',
        position === 'center' && 'items-center justify-center',
        position === 'top' && 'items-start justify-center pt-16',
        position === 'bottom' && 'items-end justify-center pb-16',
        position === 'left' && 'items-center justify-start pl-16',
        position === 'right' && 'items-center justify-end pr-16',
        fullScreen && 'items-center justify-center p-4'
      )}
      style={{ zIndex }}
    >
      {/* Backdrop */}
      {showBackdrop && (
        <div
          className={cn(
            'fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
            backdropClassName
          )}
          onClick={handleBackdropClick}
        />
      )}

      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        className={cn(
          'relative flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl',
          'max-h-[90vh] w-full',
          fullScreen ? 'h-full' : modalSizes[size],
          modalVariants[variant],
          getAnimationClasses(),
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || description || showCloseButton) && (
          <ModalHeader
            title={title}
            description={description}
            onClose={onClose}
            showCloseButton={showCloseButton}
            className={headerClassName}
          />
        )}

        {/* Content */}
        <ModalContent className={contentClassName}>
          {children}
        </ModalContent>

        {/* Footer - This will be rendered by children if they include ModalFooter */}
      </div>
    </div>
  );

  // Use portal for better z-index handling
  return createPortal(modalContent, document.body);
};

// Confirmation Modal Component
export interface ConfirmationModalProps extends Omit<ModalProps, 'children' | 'variant'> {
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  onConfirm: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
  isLoading = false,
  onClose,
  ...modalProps
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case 'danger':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <Modal {...modalProps} onClose={onClose}>
      <ModalContent>
        <p className="text-gray-700 dark:text-gray-300 text-center">{message}</p>
      </ModalContent>
      <ModalFooter align="center">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button
          variant={getConfirmButtonVariant()}
          onClick={handleConfirm}
          loading={isLoading}
        >
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

// Alert Modal Component
export interface AlertModalProps extends Omit<ModalProps, 'children'> {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  actionText?: string;
  onAction?: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  message,
  type = 'info',
  actionText = 'OK',
  onAction,
  onClose,
  ...modalProps
}) => {
  const handleAction = () => {
    onAction?.();
    onClose();
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <Modal {...modalProps} onClose={onClose}>
      <ModalContent>
        <div className="text-center">
          <div className={cn('text-4xl mb-4', getTypeStyles())}>
            {type === 'success' && '✓'}
            {type === 'warning' && '⚠'}
            {type === 'error' && '✗'}
            {type === 'info' && 'ℹ'}
          </div>
          <p className="text-gray-700 dark:text-gray-300">{message}</p>
        </div>
      </ModalContent>
      <ModalFooter align="center">
        <Button onClick={handleAction} variant="primary">
          {actionText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

// Export all components
export { Modal as default };
