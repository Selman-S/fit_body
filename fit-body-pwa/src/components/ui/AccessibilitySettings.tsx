'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { 
  Eye, 
  Type, 
  Move, 
  Focus, 
  Contrast, 
  Volume2, 
  VolumeX,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface AccessibilitySettingsProps {
  className?: string;
}

interface AccessibilityState {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  focusIndicators: boolean;
  soundEffects: boolean;
  autoPlay: boolean;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ 
  className = '' 
}) => {
  const [settings, setSettings] = useState<AccessibilityState>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    focusIndicators: true,
    soundEffects: true,
    autoPlay: false,
  });

  const [isOpen, setIsOpen] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('fitbody_accessibility');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
        applySettings({ ...settings, ...parsed });
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
      }
    }
  }, [settings]);

  // Apply accessibility settings to DOM
  const applySettings = (newSettings: AccessibilityState) => {
    const root = document.documentElement;
    const body = document.body;

    // High contrast mode
    if (newSettings.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    // Large text mode
    if (newSettings.largeText) {
      body.classList.add('large-text');
    } else {
      body.classList.remove('large-text');
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      root.style.setProperty('--reduced-motion', 'reduce');
    } else {
      root.style.setProperty('--reduced-motion', 'no-preference');
    }

    // Focus indicators
    if (newSettings.focusIndicators) {
      root.style.setProperty('--focus-ring-width', '3px');
    } else {
      root.style.setProperty('--focus-ring-width', '0px');
    }

    // Sound effects
    if (!newSettings.soundEffects) {
      // Mute all audio elements
      const audioElements = document.querySelectorAll('audio, video');
      audioElements.forEach(audio => {
        if (audio instanceof HTMLAudioElement || audio instanceof HTMLVideoElement) {
          audio.muted = true;
        }
      });
    }
  };

  // Update setting and apply changes
  const updateSetting = (key: keyof AccessibilityState, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem('fitbody_accessibility', JSON.stringify(newSettings));
  };

  // Reset to default settings
  const resetToDefaults = () => {
    const defaultSettings: AccessibilityState = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      focusIndicators: true,
      soundEffects: true,
      autoPlay: false,
    };
    
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    localStorage.setItem('fitbody_accessibility', JSON.stringify(defaultSettings));
  };

  // Test accessibility features
  const testAccessibility = () => {
    // Test focus indicators
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Focus';
    testButton.style.position = 'fixed';
    testButton.style.top = '10px';
    testButton.style.right = '10px';
    testButton.style.zIndex = '9999';
    document.body.appendChild(testButton);
    
    testButton.focus();
    
    setTimeout(() => {
      testButton.remove();
    }, 3000);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Accessibility Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:w-auto"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <Eye className="w-4 h-4 mr-2" />
        Accessibility Settings
        {isOpen ? ' (Hide)' : ' (Show)'}
      </Button>

      {/* Accessibility Panel */}
      {isOpen && (
        <Card className="p-6 space-y-6" id="accessibility-panel" role="region" aria-label="Accessibility Settings">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              ♿ Accessibility Options
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToDefaults}
              aria-label="Reset to default accessibility settings"
            >
              Reset to Defaults
            </Button>
          </div>

          {/* Visual Accessibility */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Visual Accessibility
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* High Contrast */}
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Contrast className="w-5 h-5 text-blue-600" />
                  <div>
                    <label htmlFor="high-contrast" className="font-medium text-gray-700 dark:text-gray-300">
                      High Contrast
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enhanced color contrast for better visibility
                    </p>
                  </div>
                </div>
                <input
                  id="high-contrast"
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  aria-describedby="high-contrast-description"
                />
              </div>

              {/* Large Text */}
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Type className="w-5 h-5 text-green-600" />
                  <div>
                    <label htmlFor="large-text" className="font-medium text-gray-700 dark:text-gray-300">
                      Large Text
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Increased font sizes for better readability
                    </p>
                  </div>
                </div>
                <input
                  id="large-text"
                  type="checkbox"
                  checked={settings.largeText}
                  onChange={(e) => updateSetting('largeText', e.target.checked)}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  aria-describedby="large-text-description"
                />
              </div>
            </div>
          </div>

          {/* Motion & Interaction */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Move className="w-5 h-5" />
              Motion & Interaction
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Reduced Motion */}
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Move className="w-5 h-5 text-purple-600" />
                  <div>
                    <label htmlFor="reduced-motion" className="font-medium text-gray-700 dark:text-gray-300">
                      Reduced Motion
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Minimize animations and transitions
                    </p>
                  </div>
                </div>
                <input
                  id="reduced-motion"
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  aria-describedby="reduced-motion-description"
                />
              </div>

              {/* Focus Indicators */}
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Focus className="w-5 h-5 text-orange-600" />
                  <div>
                    <label htmlFor="focus-indicators" className="font-medium text-gray-700 dark:text-gray-300">
                      Focus Indicators
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Show focus rings for keyboard navigation
                    </p>
                  </div>
                </div>
                <input
                  id="focus-indicators"
                  type="checkbox"
                  checked={settings.focusIndicators}
                  onChange={(e) => updateSetting('focusIndicators', e.target.checked)}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  aria-describedby="focus-indicators-description"
                />
              </div>
            </div>
          </div>

          {/* Audio & Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Audio & Media
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sound Effects */}
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  {settings.soundEffects ? (
                    <Volume2 className="w-5 h-5 text-blue-600" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <label htmlFor="sound-effects" className="font-medium text-gray-700 dark:text-gray-300">
                      Sound Effects
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enable audio feedback and notifications
                    </p>
                  </div>
                </div>
                <input
                  id="sound-effects"
                  type="checkbox"
                  checked={settings.soundEffects}
                  onChange={(e) => updateSetting('soundEffects', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  aria-describedby="sound-effects-description"
                />
              </div>

              {/* Auto-play Media */}
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <label htmlFor="auto-play" className="font-medium text-gray-700 dark:text-gray-300">
                      Auto-play Media
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Prevent automatic media playback
                    </p>
                  </div>
                </div>
                <input
                  id="auto-play"
                  type="checkbox"
                  checked={settings.autoPlay}
                  onChange={(e) => updateSetting('autoPlay', e.target.checked)}
                  className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  aria-describedby="auto-play-description"
                />
              </div>
            </div>
          </div>

          {/* Test & Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Test & Status
            </h3>
            
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={testAccessibility}
                aria-label="Test accessibility features"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Test Focus Indicators
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Status:</span>
                {settings.highContrast && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">High Contrast</span>}
                {settings.largeText && <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Large Text</span>}
                {settings.reducedMotion && <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Reduced Motion</span>}
                {!settings.soundEffects && <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Sound Off</span>}
              </div>
            </div>
          </div>

          {/* Accessibility Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              ♿ WCAG 2.1 AA Compliance
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• High contrast mode for better visibility</li>
              <li>• Large text support for readability</li>
              <li>• Reduced motion for vestibular disorders</li>
              <li>• Focus indicators for keyboard navigation</li>
              <li>• Screen reader compatible</li>
              <li>• Semantic HTML structure</li>
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
};
