'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  onFocus,
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  type = 'button',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md focus:ring-blue-500 active:bg-blue-800',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 focus:ring-gray-500 active:bg-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 focus:ring-gray-500 active:bg-gray-200',
    outline: 'bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-500 active:bg-blue-100',
    destructive: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md focus:ring-red-500 active:bg-red-800',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md focus:ring-green-500 active:bg-green-800',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-sm hover:shadow-md focus:ring-yellow-500 active:bg-yellow-800',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-2',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-3',
    xl: 'px-8 py-4 text-lg gap-3',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  // Ripple effect state
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);

  const addRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const ripple = {
      id: Date.now(),
      x,
      y,
    };
    
    setRipples(prev => [...prev, ripple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 600);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      addRipple(event);
      onClick?.();
    }
  };

  return (
    <motion.button
      type={type}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        widthClass,
        className
      )}
      onClick={handleClick}
      onFocus={onFocus}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { 
        scale: 1.02,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={!disabled && !loading ? { 
        scale: 0.98,
        transition: { duration: 0.1 }
      } : undefined}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
    >
      {/* Ripple Effects */}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            left: ripple.x - 2,
            top: ripple.y - 2,
            width: 4,
            height: 4,
          }}
        />
      ))}

      {/* Loading Spinner */}
      {loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Loader2 className="w-4 h-4 animate-spin" />
        </motion.div>
      )}

      {/* Left Icon */}
      {icon && iconPosition === 'left' && !loading && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {icon}
        </motion.div>
      )}

      {/* Button Text */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {children}
      </motion.span>

      {/* Right Icon */}
      {icon && iconPosition === 'right' && !loading && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {icon}
        </motion.div>
      )}
    </motion.button>
  );
};

// Floating Action Button with enhanced animations
export const FAB: React.FC<{
  onClick?: () => void;
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ onClick, icon, variant = 'primary', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  };

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      whileHover={{ 
        scale: 1.1,
        rotate: 5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.9,
        transition: { duration: 0.1 }
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5
      }}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {icon}
      </motion.div>
    </motion.button>
  );
};

// Icon Button with micro-interactions
export const IconButton: React.FC<{
  onClick?: () => void;
  icon: React.ReactNode;
  variant?: 'ghost' | 'outline' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}> = ({ onClick, icon, variant = 'ghost', size = 'md', className = '', disabled = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const variantClasses = {
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900',
    outline: 'bg-transparent border border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-lg transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      whileHover={!disabled ? { 
        scale: 1.05,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={!disabled ? { 
        scale: 0.95,
        transition: { duration: 0.1 }
      } : undefined}
    >
      {icon}
    </motion.button>
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
