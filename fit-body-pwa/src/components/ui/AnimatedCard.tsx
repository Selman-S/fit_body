'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'workout' | 'stat' | 'feature';
  delay?: number;
  whileHover?: boolean;
  whileTap?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  variant = 'default',
  delay = 0,
  whileHover = true,
  whileTap = true,
  onClick,
  disabled = false,
}) => {
  const baseVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: delay * 0.1,
      }
    },
    hover: whileHover ? {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.2,
      }
    } : {},
    tap: whileTap ? {
      scale: 0.98,
      transition: {
        duration: 0.1,
      }
    } : {},
  };

  const variantStyles = {
    default: 'hover:shadow-lg',
    workout: 'hover:shadow-xl border-l-4 border-l-blue-500',
    stat: 'hover:shadow-lg text-center',
    feature: 'hover:shadow-2xl hover:border-blue-300',
  };

  return (
    <motion.div
      variants={baseVariants}
      initial="hidden"
      animate="visible"
      whileHover={whileHover ? "hover" : undefined}
      whileTap={whileTap ? "tap" : undefined}
      className={cn(
        'cursor-pointer transition-all duration-200',
        variantStyles[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      layout
    >
      <Card variant={variant === 'workout' ? 'workout' : variant === 'stat' ? 'stats' : 'default'}>
        {children}
      </Card>
    </motion.div>
  );
};

// Staggered Grid Animation
export const AnimatedGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}> = ({ children, className = '', staggerDelay = 0.1 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Fade In Animation
export const FadeIn: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}> = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const directionVariants = {
    up: { y: 20, opacity: 0 },
    down: { y: -20, opacity: 0 },
    left: { x: 20, opacity: 0 },
    right: { x: -20, opacity: 0 },
  };

  return (
    <motion.div
      initial={directionVariants[direction]}
      animate={{ y: 0, x: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        delay: delay * 0.1,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scale In Animation
export const ScaleIn: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  scale?: number;
}> = ({ children, className = '', delay = 0, scale = 0.8 }) => {
  return (
    <motion.div
      initial={{ scale, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.5,
        delay: delay * 0.1,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Slide In Animation
export const SlideIn: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
}> = ({ children, className = '', delay = 0, direction = 'left', distance = 50 }) => {
  const directionVariants = {
    left: { x: distance, opacity: 0 },
    right: { x: -distance, opacity: 0 },
    up: { y: distance, opacity: 0 },
    down: { y: -distance, opacity: 0 },
  };

  return (
    <motion.div
      initial={directionVariants[direction]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        delay: delay * 0.1,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Bounce In Animation
export const BounceIn: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.6,
        delay: delay * 0.1,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Pulse Animation
export const Pulse: React.FC<{
  children: React.ReactNode;
  className?: string;
  duration?: number;
}> = ({ children, className = '', duration = 2 }) => {
  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Shake Animation
export const Shake: React.FC<{
  children: React.ReactNode;
  className?: string;
  trigger?: boolean;
}> = ({ children, className = '', trigger = false }) => {
  return (
    <motion.div
      animate={trigger ? {
        x: [0, -10, 10, -10, 10, 0],
        transition: {
          duration: 0.5,
          ease: "easeInOut",
        }
      } : {}}
      className={className}
    >
      {children}
    </motion.div>
  );
};
