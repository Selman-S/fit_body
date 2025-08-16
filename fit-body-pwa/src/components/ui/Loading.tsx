'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Spinner variants
const spinnerVariants = {
  default: 'border-gray-300 dark:border-gray-600',
  primary: 'border-blue-500',
  success: 'border-green-500',
  warning: 'border-yellow-500',
  error: 'border-red-500',
  white: 'border-white',
};

// Spinner sizes
const spinnerSizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
  xl: 'w-12 h-12 border-4',
};

// Spinner component
interface SpinnerProps {
  size?: keyof typeof spinnerSizes;
  variant?: keyof typeof spinnerVariants;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
}) => {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-t-transparent',
        spinnerSizes[size],
        spinnerVariants[variant],
        className
      )}
    />
  );
};

// Pulse spinner component
const PulseSpinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const variantClasses = {
    default: 'bg-gray-300 dark:bg-gray-600',
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    white: 'bg-white',
  };

  return (
    <div
      className={cn(
        'animate-pulse rounded-full',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    />
  );
};

// Dots spinner component
const DotsSpinner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
};

// Skeleton component
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  rounded = 'md',
}) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        roundedClasses[rounded],
        className
      )}
      style={{
        width: width,
        height: height,
      }}
    />
  );
};

// Skeleton text component
interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lineHeight?: 'sm' | 'md' | 'lg';
}

const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 1,
  className,
  lineHeight = 'md',
}) => {
  const lineHeightClasses = {
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-5',
  };

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'w-full',
            lineHeightClasses[lineHeight],
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
};

// Skeleton card component
const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('p-4 space-y-3', className)}>
      <div className="flex items-center space-x-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
};

// Skeleton list component
const SkeletonList: React.FC<{
  items?: number;
  className?: string;
}> = ({ items = 3, className }) => {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="w-16 h-6" />
        </div>
      ))}
    </div>
  );
};

// Progress bar component
interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: keyof typeof spinnerVariants;
  showLabel?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const variantClasses = {
    default: 'bg-blue-500',
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    white: 'bg-white',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn('h-full transition-all duration-300 ease-out', variantClasses[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Circular progress component
interface CircularProgressProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: keyof typeof spinnerVariants;
  showLabel?: boolean;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  className,
}) => {
  const percentage = Math.min(Math.max(value, 0), 100);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };

  const variantClasses = {
    default: 'text-blue-500',
    primary: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
    white: 'text-white',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', sizeClasses[size], className)}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn('transition-all duration-300 ease-out', variantClasses[variant])}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};

// Loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
  spinnerSize?: keyof typeof spinnerSizes;
  className?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  text = 'Loading...',
  spinnerSize = 'lg',
  className,
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={cn('relative', className)}>
      {children}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center">
          <Spinner size={spinnerSize} className="mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
        </div>
      </div>
    </div>
  );
};

// Loading button component
interface LoadingButtonProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  spinnerSize?: keyof typeof spinnerSizes;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  children,
  className,
  spinnerSize = 'sm',
}) => {
  return (
    <div className={cn('inline-flex items-center', className)}>
      {loading && <Spinner size={spinnerSize} className="mr-2" />}
      {children}
    </div>
  );
};

// Export all components
export {
  Spinner as default,
  PulseSpinner,
  DotsSpinner,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonList,
  ProgressBar,
  CircularProgress,
  LoadingOverlay,
  LoadingButton,
};

// Export types
export type {
  SpinnerProps,
  ProgressBarProps,
  CircularProgressProps,
  LoadingOverlayProps,
  LoadingButtonProps,
  SkeletonProps,
  SkeletonTextProps,
};
