'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Card variants
const cardVariants = {
  default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 theme-text',
  workout: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative overflow-hidden border-l-4 border-l-blue-500 theme-text',
  stats: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center theme-text',
  elevated: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl theme-text',
  outline: 'bg-transparent border-2 border-gray-200 dark:border-gray-700 theme-text',
};

// Card sizes
const cardSizes = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

// Base Card component
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof cardVariants;
  size?: keyof typeof cardSizes;
  children: React.ReactNode;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  className, 
  variant = 'default', 
  size = 'md',
  hover = false,
  clickable = false,
  onClick,
  children, 
  ...props 
}) => {
  const baseClasses = cn(
    'rounded-xl transition-all duration-200',
    cardVariants[variant],
    cardSizes[size],
    hover && 'hover:shadow-md hover:-translate-y-1',
    clickable && 'cursor-pointer',
    className
  );

  return (
    <div 
      className={baseClasses} 
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

Card.displayName = 'Card';

// Card Header component
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  className, 
  children, 
  action,
  ...props 
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between mb-4',
        className
      )}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
};

// Card Title component
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle: React.FC<CardTitleProps> = ({ 
  className, 
  children, 
  as: Component = 'h3',
  ...props 
}) => {
  return (
    <Component
      className={cn(
        'font-semibold text-gray-900 dark:text-white',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

// Card Description component
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <p
      className={cn(
        'text-sm text-gray-600 dark:text-gray-300',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

// Card Content component
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div
      className={cn(
        'space-y-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Footer component
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Workout Card component
export interface WorkoutCardProps {
  title: string;
  duration?: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  category?: string;
  onPress?: () => void;
  className?: string;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ 
  title, 
  duration, 
  difficulty, 
  category,
  onPress,
  className = '' 
}) => {
  return (
    <Card 
      variant="workout" 
      className={cn(
        'hover:shadow-md transition-shadow cursor-pointer',
        className
      )}
      clickable={!!onPress}
      onClick={onPress}
    >
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {category && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {category}
          </span>
        )}
      </CardHeader>
      
      <CardContent>
        {duration && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            ⏱️ {duration} dakika
          </p>
        )}
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Zorluk:</span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full',
                  index < difficulty 
                    ? 'bg-blue-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                )}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Stats Card component
export interface StatsCardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  unit, 
  trend,
  trendValue,
  icon,
  className = '' 
}) => {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500',
  };

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→',
  };

  return (
    <Card variant="stats" className={className}>
      {icon && (
        <div className="mb-3 flex justify-center">
          <div className="w-8 h-8 text-blue-500">{icon}</div>
        </div>
      )}
      
      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {title}
      </CardTitle>
      
      <div className="flex items-center justify-center gap-1 mb-2">
        <span className="text-3xl font-bold text-blue-500">{value}</span>
        {unit && <span className="text-sm text-gray-500">{unit}</span>}
      </div>
      
      {trend && (
        <div className={cn('text-xs', trendColors[trend])}>
          {trendIcons[trend]} {trendValue || 'Bu hafta'}
        </div>
      )}
    </Card>
  );
};

// Progress Card component
export interface ProgressCardProps {
  title: string;
  progress: number; // 0-100
  current: number;
  target: number;
  unit: string;
  className?: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ 
  title, 
  progress, 
  current, 
  target, 
  unit,
  className = '' 
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <span className="text-sm text-gray-500">
          {current}/{target} {unit}
        </span>
      </CardHeader>
      
      <CardContent>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span>{Math.round(progress)}%</span>
          <span>100%</span>
        </div>
      </CardContent>
    </Card>
  );
};
