'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Timer as TimerIcon,
  Clock
} from 'lucide-react';
import { Button } from './Button';

// Timer types
export type TimerType = 'countdown' | 'countup';

// Timer state
export interface TimerState {
  seconds: number;
  isRunning: boolean;
  isFinished: boolean;
}

// Timer props
export interface TimerProps {
  type?: TimerType;
  initialSeconds?: number;
  onFinish?: () => void;
  onTick?: (seconds: number) => void;
  autoStart?: boolean;
  showControls?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Format seconds to MM:SS format
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(Math.abs(seconds) / 60);
  const remainingSeconds = Math.abs(seconds) % 60;
  const sign = seconds < 0 ? '-' : '';
  return `${sign}${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Main Timer Component
export const Timer: React.FC<TimerProps> = ({
  type = 'countdown',
  initialSeconds = 0,
  onFinish,
  onTick,
  autoStart = false,
  showControls = true,
  className,
  size = 'md',
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isFinished, setIsFinished] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isFinished) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          const newSeconds = type === 'countdown' 
            ? prevSeconds - 1 
            : prevSeconds + 1;

          // Call onTick callback
          if (onTick) {
            onTick(newSeconds);
          }

          // Check if countdown finished
          if (type === 'countdown' && newSeconds <= 0) {
            setIsRunning(false);
            setIsFinished(true);
            if (onFinish) {
              onFinish();
            }
            return 0;
          }

          return newSeconds;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isFinished, type, onFinish, onTick]);

  // Control functions
  const handleStart = useCallback(() => {
    setIsRunning(true);
    setIsFinished(false);
  }, []);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsFinished(false);
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  // Size classes
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  const controlSizes = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
  } as const;

  return (
    <div className={cn('flex flex-col items-center space-y-4', className)}>
      {/* Timer Display */}
      <div className={cn(
        'font-mono font-bold tracking-wider',
        sizeClasses[size],
        isFinished && type === 'countdown' ? 'text-red-500' : 'text-gray-900 dark:text-white',
        isRunning && 'animate-pulse'
      )}>
        {formatTime(seconds)}
      </div>

      {/* Timer Controls */}
      {showControls && (
        <div className="flex items-center space-x-2">
          {!isRunning ? (
            <Button
              variant="primary"
              size={controlSizes[size]}
              onClick={handleStart}
              disabled={isFinished && type === 'countdown'}
            >
              <Play className="w-4 h-4 mr-2" />
              {isFinished ? 'Bitmiş' : 'Başlat'}
            </Button>
          ) : (
            <Button
              variant="secondary"
              size={controlSizes[size]}
              onClick={handlePause}
            >
              <Pause className="w-4 h-4 mr-2" />
              Duraklat
            </Button>
          )}
          
          <Button
            variant="outline"
            size={controlSizes[size]}
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Sıfırla
          </Button>
        </div>
      )}

      {/* Timer Status */}
      {isFinished && type === 'countdown' && (
        <div className="text-center">
          <p className="text-red-500 font-semibold">⏰ Süre Doldu!</p>
        </div>
      )}
    </div>
  );
};

// Rest Timer Component - Specific for workout rest periods
export interface RestTimerProps {
  restSeconds: number;
  onComplete?: () => void;
  autoStart?: boolean;
  className?: string;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  restSeconds,
  onComplete,
  autoStart = true,
  className,
}) => {
  return (
    <div className={cn('bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700', className)}>
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            Dinlenme Süresi
          </h3>
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Bir sonraki set için hazırlanın
        </p>
      </div>
      
      <Timer
        type="countdown"
        initialSeconds={restSeconds}
        onFinish={onComplete}
        autoStart={autoStart}
        size="lg"
        className="py-4"
      />
    </div>
  );
};

// Workout Timer Component - For tracking total workout time
export interface WorkoutTimerProps {
  onTimeUpdate?: (seconds: number) => void;
  className?: string;
}

export const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  onTimeUpdate,
  className,
}) => {
  return (
    <div className={cn('bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TimerIcon className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-900 dark:text-green-100">
            Antrenman Süresi
          </span>
        </div>
        
        <Timer
          type="countup"
          initialSeconds={0}
          onTick={onTimeUpdate}
          autoStart={true}
          showControls={false}
          size="sm"
        />
      </div>
    </div>
  );
};

// Hook for timer functionality
export const useTimer = (
  type: TimerType = 'countdown',
  initialSeconds: number = 0
) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsFinished(false);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsFinished(false);
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isFinished) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          const newSeconds = type === 'countdown' 
            ? prevSeconds - 1 
            : prevSeconds + 1;

          if (type === 'countdown' && newSeconds <= 0) {
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }

          return newSeconds;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isFinished, type]);

  return {
    seconds,
    isRunning,
    isFinished,
    start,
    pause,
    reset,
    formattedTime: formatTime(seconds),
  };
};

// Timer presets for common workout timers
export const TIMER_PRESETS = {
  // Rest periods
  SHORT_REST: 30,   // 30 seconds
  MEDIUM_REST: 60,  // 1 minute
  LONG_REST: 90,    // 1.5 minutes
  
  // Exercise durations
  PLANK: 30,        // 30 seconds
  PLANK_LONG: 60,   // 1 minute
  CARDIO_INTERVAL: 45, // 45 seconds
  
  // Warm-up/Cool-down
  WARM_UP: 300,     // 5 minutes
  COOL_DOWN: 300,   // 5 minutes
} as const;
