'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Button variants using class-variance-authority
const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        // Primary button - main actions
        primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 focus:ring-blue-500',
        // Secondary button - alternative actions
        secondary: 'bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-500',
        // Success button - positive actions
        success: 'bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md focus:ring-green-500',
        // Warning button - caution actions
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm hover:shadow-md focus:ring-yellow-500',
        // Destructive button - dangerous actions
        destructive: 'bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md focus:ring-red-500',
        // Ghost button - subtle actions
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 focus:ring-gray-500',
        // Outline button - secondary actions
        outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
        xl: 'h-14 px-8 text-xl',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

// Button props interface
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Main Button component
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth, 
    loading = false, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {/* Left icon */}
        {!loading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        
        {/* Button content */}
        {children}
        
        {/* Right icon */}
        {!loading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Floating Action Button component
export const FAB: React.FC<{
  onClick?: () => void;
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ 
  onClick, 
  icon, 
  variant = 'primary',
  size = 'md',
  className = '' 
}) => {
  const fabVariants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white shadow-lg hover:shadow-xl',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl',
  };

  const fabSizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 rounded-full transition-all duration-200 flex items-center justify-center z-50',
        fabVariants[variant],
        fabSizes[size],
        className
      )}
    >
      {icon}
    </button>
  );
};

// Icon Button component
export const IconButton: React.FC<{
  onClick?: () => void;
  icon: React.ReactNode;
  variant?: VariantProps<typeof buttonVariants>['variant'];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}> = ({ 
  onClick, 
  icon, 
  variant = 'ghost',
  size = 'md',
  className = '',
  disabled = false
}) => {
  const iconSizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  } as const;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'p-0 rounded-full',
        iconSizes[size],
        className
      )}
    >
      {icon}
    </Button>
  );
};

// Button Group component
export const ButtonGroup: React.FC<{
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}> = ({ 
  children, 
  orientation = 'horizontal',
  className = '' 
}) => {
  return (
    <div
      className={cn(
        'inline-flex',
        orientation === 'vertical' ? 'flex-col' : 'flex-row',
        className
      )}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          const childProps = child.props as { className?: string };
          return React.cloneElement(child, {
            className: cn(
              childProps.className || '',
              // Remove rounded corners from middle buttons
              index === 0 && orientation === 'horizontal' ? 'rounded-r-none' : '',
              index === React.Children.count(children) - 1 && orientation === 'horizontal' ? 'rounded-l-none' : '',
              index > 0 && index < React.Children.count(children) - 1 && orientation === 'horizontal' ? 'rounded-none' : '',
              // Vertical orientation
              index === 0 && orientation === 'vertical' ? 'rounded-b-none' : '',
              index === React.Children.count(children) - 1 && orientation === 'vertical' ? 'rounded-t-none' : '',
              index > 0 && index < React.Children.count(children) - 1 && orientation === 'vertical' ? 'rounded-none' : '',
              // Border adjustments
              index > 0 && orientation === 'horizontal' ? 'border-l-0' : '',
              index > 0 && orientation === 'vertical' ? 'border-t-0' : ''
            ),
          } as React.ComponentProps<typeof Button>);
        }
        return child;
      })}
    </div>
  );
};
