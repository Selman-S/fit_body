'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// Input variants
const inputVariants = {
  default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
  success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
  disabled: 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed',
};

// Input sizes
const inputSizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-4 text-lg',
};

// Base Input component
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: keyof typeof inputVariants;
  size?: keyof typeof inputSizes;
  error?: string;
  success?: string;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant = 'default',
    size = 'md',
    error,
    success,
    label,
    helperText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    ...props 
  }, ref) => {
    // Determine variant based on state
    let inputVariant = variant;
    if (disabled) inputVariant = 'disabled';
    else if (error) inputVariant = 'error';
    else if (success) inputVariant = 'success';

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
              inputVariants[inputVariant],
              inputSizes[size],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              fullWidth && 'w-full',
              className
            )}
            disabled={disabled}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Helper text and error/success messages */}
        {(helperText || error || success) && (
          <div className="space-y-1">
            {helperText && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {helperText}
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <span className="text-red-500">⚠</span>
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <span className="text-green-500">✓</span>
                {success}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: keyof typeof inputVariants;
  size?: keyof typeof inputSizes;
  error?: string;
  success?: string;
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
  rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant = 'default',
    size = 'md',
    error,
    success,
    label,
    helperText,
    fullWidth = false,
    disabled,
    rows = 3,
    ...props 
  }, ref) => {
    // Determine variant based on state
    let inputVariant = variant;
    if (disabled) inputVariant = 'disabled';
    else if (error) inputVariant = 'error';
    else if (success) inputVariant = 'success';

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Textarea field */}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            'w-full rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 resize-vertical',
            inputVariants[inputVariant],
            size === 'sm' ? 'px-3 py-2 text-sm' : size === 'lg' ? 'px-4 py-3 text-lg' : 'px-4 py-2 text-base',
            fullWidth && 'w-full',
            className
          )}
          disabled={disabled}
          {...props}
        />

        {/* Helper text and error/success messages */}
        {(helperText || error || success) && (
          <div className="space-y-1">
            {helperText && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {helperText}
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <span className="text-red-500">⚠</span>
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <span className="text-green-500">✓</span>
                {success}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Search Input component
export interface SearchInputProps extends Omit<InputProps, 'type'> {
  onSearch?: (value: string) => void;
  placeholder?: string;
  clearable?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({ 
  onSearch,
  placeholder = 'Ara...',
  clearable = true,
  className,
  ...props 
}) => {
  const [value, setValue] = React.useState('');

  const handleSearch = () => {
    onSearch?.(value);
  };

  const handleClear = () => {
    setValue('');
    onSearch?.('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative">
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        leftIcon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        rightIcon={
          <div className="flex items-center gap-1">
            {clearable && value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={handleSearch}
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        }
        className={cn('pr-20', className)}
        {...props}
      />
    </div>
  );
};

// Number Input component
export interface NumberInputProps extends Omit<InputProps, 'type'> {
  min?: number;
  max?: number;
  step?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export const NumberInput: React.FC<NumberInputProps> = ({ 
  min,
  max,
  step = 1,
  onIncrement,
  onDecrement,
  className,
  ...props 
}) => {
  return (
    <div className="relative">
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        className={cn('pr-20', className)}
        {...props}
      />
      
      {/* Increment/Decrement buttons */}
      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col">
        <button
          type="button"
          onClick={onIncrement}
          className="w-6 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 border-b border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onDecrement}
          className="w-6 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
