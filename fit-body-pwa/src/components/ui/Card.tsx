import React from 'react';

interface CardProps {
  variant?: 'default' | 'workout' | 'stat';
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  variant = 'default', 
  children, 
  className = '' 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200';
  
  const variants = {
    default: 'p-6',
    workout: 'p-4 border-l-4 border-blue-500',
    stat: 'p-6 text-center'
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
