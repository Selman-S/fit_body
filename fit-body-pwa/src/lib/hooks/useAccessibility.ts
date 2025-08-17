'use client';

import { useState, useEffect, useCallback } from 'react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  focusIndicators: boolean;
  soundEffects: boolean;
  autoPlay: boolean;
  screenReaderMode: boolean;
}

interface AccessibilityHook {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: boolean) => void;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  getAriaLabel: (action: string, context?: string) => string;
  isHighContrast: boolean;
  isLargeText: boolean;
  isReducedMotion: boolean;
  hasFocusIndicators: boolean;
  resetToDefaults: () => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  focusIndicators: true,
  soundEffects: true,
  autoPlay: false,
  screenReaderMode: false,
};

export const useAccessibility = (): AccessibilityHook => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('fitbody_accessibility');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('fitbody_accessibility', JSON.stringify(settings));
  }, [settings]);

  // Update a specific setting
  const updateSetting = useCallback((key: keyof AccessibilitySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // Announce message to screen readers
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    // Create or get existing live region
    let liveRegion = document.getElementById('screen-reader-announcements');
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'screen-reader-announcements';
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    // Update the live region content
    liveRegion.textContent = message;
    
    // Clear the message after a short delay
    setTimeout(() => {
      if (liveRegion) {
        liveRegion.textContent = '';
      }
    }, 1000);
  }, []);

  // Generate ARIA labels for common actions
  const getAriaLabel = useCallback((action: string, context?: string): string => {
    const contextStr = context ? ` ${context}` : '';
    return `${action}${contextStr}`;
  }, []);

  // Reset all settings to defaults
  const resetToDefaults = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  // Computed properties for easy access
  const isHighContrast = settings.highContrast;
  const isLargeText = settings.largeText;
  const isReducedMotion = settings.reducedMotion;
  const hasFocusIndicators = settings.focusIndicators;

  return {
    settings,
    updateSetting,
    announceToScreenReader,
    getAriaLabel,
    isHighContrast,
    isLargeText,
    isReducedMotion,
    hasFocusIndicators,
    resetToDefaults,
  };
};

// Utility functions for accessibility
export const accessibilityUtils = {
  // Check if user prefers reduced motion
  prefersReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Check if user prefers high contrast
  prefersHighContrast: (): boolean => {
    return window.matchMedia('(prefers-contrast: high)').matches;
  },

  // Check if user prefers dark color scheme (only for system theme users)
  prefersDarkColorScheme: (): boolean => {
    // Only check system preference if user hasn't made an explicit choice
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  // Generate unique ID for ARIA relationships
  generateId: (prefix: string = 'accessibility'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Validate color contrast ratio
  validateContrast: (foreground: string, background: string): number => {
    // Simple contrast calculation (for production, use a proper library)
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const fg = hexToRgb(foreground);
    const bg = hexToRgb(background);

    if (!fg || !bg) return 0;

    const luminance = (r: number, g: number, b: number) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const fgLuminance = luminance(fg.r, fg.g, fg.b);
    const bgLuminance = luminance(bg.r, bg.g, bg.b);

    const brightest = Math.max(fgLuminance, bgLuminance);
    const darkest = Math.min(fgLuminance, bgLuminance);

    return (brightest + 0.05) / (darkest + 0.05);
  },

  // Check if element is visible to screen readers
  isVisibleToScreenReader: (element: HTMLElement): boolean => {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           element.offsetWidth > 0 && 
           element.offsetHeight > 0;
  },

  // Focus management utilities
  focusManagement: {
    // Trap focus within a container
    trapFocus: (container: HTMLElement): (() => void) => {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      
      // Return cleanup function
      return () => {
        document.removeEventListener('keydown', handleTabKey);
      };
    },

    // Move focus to first focusable element
    focusFirst: (container: HTMLElement): void => {
      const firstFocusable = container.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      
      if (firstFocusable) {
        firstFocusable.focus();
      }
    },

    // Move focus to last focusable element
    focusLast: (container: HTMLElement): void => {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      if (lastFocusable) {
        lastFocusable.focus();
      }
    }
  }
};
