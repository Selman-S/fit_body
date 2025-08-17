'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { 
  Keyboard, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Home,
  Send,
  ChevronRight,
  X,
  MousePointer,
  Minus
} from 'lucide-react';

interface KeyboardNavigationProps {
  className?: string;
}

interface KeyboardShortcut {
  key: string;
  description: string;
  action: string;
}

export const KeyboardNavigation: React.FC<KeyboardNavigationProps> = ({ 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('main');
  const skipLinkRef = useRef<HTMLAnchorElement>(null);

  // Keyboard shortcuts for the app
  const keyboardShortcuts: KeyboardShortcut[] = [
    { key: 'Tab', description: 'Navigate between interactive elements', action: 'Navigation' },
    { key: 'Shift + Tab', description: 'Navigate backwards', action: 'Reverse Navigation' },
    { key: 'Enter / Space', description: 'Activate buttons and links', action: 'Activate' },
    { key: 'Escape', description: 'Close modals and menus', action: 'Close/Cancel' },
    { key: 'Arrow Keys', description: 'Navigate within components', action: 'Component Navigation' },
    { key: 'Home', description: 'Go to first item', action: 'First Item' },
    { key: 'End', description: 'Go to last item', action: 'Last Item' },
    { key: 'H', description: 'Go to Home page', action: 'Home Navigation' },
    { key: 'D', description: 'Go to Dashboard', action: 'Dashboard Navigation' },
    { key: 'W', description: 'Go to Workout', action: 'Workout Navigation' },
    { key: 'P', description: 'Go to Progress', action: 'Progress Navigation' },
    { key: 'S', description: 'Go to Settings', action: 'Settings Navigation' },
    { key: 'A', description: 'Open Accessibility Settings', action: 'Accessibility' },
    { key: 'T', description: 'Toggle Theme', action: 'Theme Toggle' },
  ];

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle shortcuts when typing in input fields
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return;
      }

      // Alt + key combinations for navigation
      if (event.altKey) {
        switch (event.key.toLowerCase()) {
          case 'h':
            event.preventDefault();
            window.location.href = '/';
            break;
          case 'd':
            event.preventDefault();
            window.location.href = '/dashboard';
            break;
          case 'w':
            event.preventDefault();
            window.location.href = '/workout';
            break;
          case 'p':
            event.preventDefault();
            window.location.href = '/progress';
            break;
          case 's':
            event.preventDefault();
            window.location.href = '/settings';
            break;
          case 'a':
            event.preventDefault();
            setIsOpen(true);
            break;
          case 't':
            event.preventDefault();
            // Toggle theme (this would need to be implemented)
            break;
        }
      }

      // Escape key to close modals/panels
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Skip to main content functionality
  const skipToMainContent = () => {
    const mainContent = document.querySelector('main') || 
                       document.querySelector('[role="main"]') ||
                       document.querySelector('#main-content');
    
    if (mainContent) {
      (mainContent as HTMLElement).focus();
      (mainContent as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Skip to navigation functionality
  const skipToNavigation = () => {
    const navigation = document.querySelector('nav') || 
                      document.querySelector('[role="navigation"]');
    
    if (navigation) {
      (navigation as HTMLElement).focus();
      (navigation as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Focus management for keyboard users
  const focusFirstInteractive = (container: HTMLElement) => {
    const firstFocusable = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    
    if (firstFocusable) {
      firstFocusable.focus();
    }
  };

  // Announce keyboard navigation to screen readers
  const announceNavigation = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement);
      }
    }, 1000);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Skip Links - Always visible to screen readers */}
      <div className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50">
        <a
          href="#main-content"
          onClick={skipToMainContent}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <a
          href="#navigation"
          onClick={skipToNavigation}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ml-2"
        >
          Skip to navigation
        </a>
      </div>

      {/* Keyboard Navigation Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:w-auto"
        aria-expanded={isOpen}
        aria-controls="keyboard-navigation-panel"
        onFocus={() => announceNavigation('Keyboard navigation help available')}
      >
        <Keyboard className="w-4 h-4 mr-2" />
        Keyboard Navigation
        {isOpen ? ' (Hide)' : ' (Show)'}
      </Button>

      {/* Keyboard Navigation Panel */}
      {isOpen && (
        <Card className="p-6 space-y-6" id="keyboard-navigation-panel" role="region" aria-label="Keyboard Navigation Help">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              ⌨️ Keyboard Navigation
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              aria-label="Close keyboard navigation help"
            >
              Close
            </Button>
          </div>

          {/* Navigation Sections */}
          <div className="space-y-6">
            {/* Main Navigation */}
            <div className="space-y-4">
                              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5" />
                  Basic Navigation
                </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Tab Navigation</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Tab</kbd> - Next element</li>
                    <li>• <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Shift + Tab</kbd> - Previous element</li>
                    <li>• <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Enter</kbd> - Activate buttons/links</li>
                    <li>• <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Space</kbd> - Activate buttons/links</li>
                  </ul>
                </div>

                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Arrow Navigation</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">↑↓</kbd> - Navigate lists</li>
                    <li>• <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">←→</kbd> - Navigate tabs</li>
                    <li>• <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Home</kbd> - First item</li>
                    <li>• <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">End</kbd> - Last item</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <ArrowUp className="w-5 h-5" />
                Quick Navigation (Alt + Key)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Page Navigation</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• <kbd className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Alt + H</kbd> - Home</li>
                    <li>• <kbd className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Alt + D</kbd> - Dashboard</li>
                    <li>• <kbd className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Alt + W</kbd> - Workout</li>
                    <li>• <kbd className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Alt + P</kbd> - Progress</li>
                  </ul>
                </div>

                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">App Controls</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• <kbd className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Alt + S</kbd> - Settings</li>
                    <li>• <kbd className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Alt + A</kbd> - Accessibility</li>
                    <li>• <kbd className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Alt + T</kbd> - Theme Toggle</li>
                    <li>• <kbd className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Escape</kbd> - Close/Back</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Interactive Elements */}
            <div className="space-y-4">
                              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <MousePointer className="w-5 h-5" />
                  Interactive Elements
                </h3>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Focus Indicators</h4>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="sm"
                    className="focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
                    onFocus={() => announceNavigation('Primary button focused')}
                  >
                    Focus Me (Primary)
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    className="focus:ring-4 focus:ring-gray-300 focus:ring-offset-2"
                    onFocus={() => announceNavigation('Secondary button focused')}
                  >
                    Focus Me (Secondary)
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
                    onFocus={() => announceNavigation('Outline button focused')}
                  >
                    Focus Me (Outline)
                  </Button>
                </div>
              </div>
            </div>

            {/* Accessibility Tips */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                ♿ Accessibility Tips
              </h3>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                  <li>• Use <kbd className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Tab</kbd> to navigate through all interactive elements</li>
                  <li>• Use <kbd className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Enter</kbd> or <kbd className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Space</kbd> to activate buttons and links</li>
                  <li>• Use <kbd className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Escape</kbd> to close modals and return to previous state</li>
                  <li>• Use <kbd className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Alt + Key</kbd> combinations for quick navigation</li>
                  <li>• Focus indicators show which element is currently active</li>
                  <li>• Screen reader announcements provide context for navigation</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// Keyboard Navigation Provider for managing focus across the app
export const KeyboardNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [focusHistory, setFocusHistory] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (target && target !== document.body) {
        setFocusHistory(prev => [...prev, target]);
      }
    };

    const handleFocusOut = () => {
      // Keep only last 10 focused elements
      setFocusHistory(prev => prev.slice(-10));
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  // Restore focus to last focused element
  const restoreFocus = () => {
    const lastFocused = focusHistory[focusHistory.length - 1];
    if (lastFocused && lastFocused.offsetParent !== null) {
      lastFocused.focus();
    }
  };

  // Expose focus restoration to children
  const ref = React.useRef<{ restoreFocus: () => void }>(null);
  React.useImperativeHandle(ref, () => ({
    restoreFocus,
  }));

  return <>{children}</>;
};
