'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Input } from './Input';
import { 
  Palette, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Contrast,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

interface ColorContrastProps {
  className?: string;
}

interface ColorPair {
  foreground: string;
  background: string;
  contrast: number;
  passes: boolean;
}

interface ThemeColors {
  light: Record<string, string>;
  dark: Record<string, string>;
}

export const ColorContrast: React.FC<ColorContrastProps> = ({ 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [contrastResult, setContrastResult] = useState<ColorPair | null>(null);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('system');

  // WCAG contrast requirements
  const WCAG_AA_NORMAL = 4.5; // Normal text
  const WCAG_AA_LARGE = 3.0;  // Large text (18pt+ or 14pt+ bold)
  const WCAG_AAA_NORMAL = 7.0; // Enhanced contrast
  const WCAG_AAA_LARGE = 4.5;  // Large text enhanced

  // Theme-aware color palette
  const themeColors: ThemeColors = {
    light: {
      primary: '#0ea5e9',
      primaryDark: '#0284c7',
      primaryLight: '#38bdf8',
      secondary: '#64748b',
      secondaryDark: '#475569',
      secondaryLight: '#94a3b8',
      success: '#22c55e',
      successDark: '#15803d',
      successLight: '#4ade80',
      warning: '#f59e0b',
      warningDark: '#d97706',
      warningLight: '#fbbf24',
      error: '#ef4444',
      errorDark: '#dc2626',
      errorLight: '#f87171',
      surface: '#ffffff',
      surfaceVariant: '#f8fafc',
      onSurface: '#0f172a',
      onSurfaceVariant: '#475569',
      background: '#ffffff',
      onBackground: '#0f172a',
    },
    dark: {
      primary: '#38bdf8',
      primaryDark: '#0ea5e9',
      primaryLight: '#7dd3fc',
      secondary: '#94a3b8',
      secondaryDark: '#64748b',
      secondaryLight: '#cbd5e1',
      success: '#4ade80',
      successDark: '#22c55e',
      successLight: '#86efac',
      warning: '#fbbf24',
      warningDark: '#f59e0b',
      warningLight: '#fde68a',
      error: '#f87171',
      errorDark: '#ef4444',
      errorLight: '#fca5a5',
      surface: '#1e293b',
      surfaceVariant: '#334155',
      onSurface: '#f8fafc',
      onSurfaceVariant: '#cbd5e1',
      background: '#0f172a',
      onBackground: '#f8fafc',
    }
  };

  // Convert hex to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  // Calculate contrast ratio
  const calculateContrast = (foreground: string, background: string): number => {
    const fg = hexToRgb(foreground);
    const bg = hexToRgb(background);

    if (!fg || !bg) return 0;

    const fgLuminance = getLuminance(fg.r, fg.g, fg.b);
    const bgLuminance = getLuminance(bg.r, bg.g, bg.b);

    const brightest = Math.max(fgLuminance, bgLuminance);
    const darkest = Math.min(fgLuminance, bgLuminance);

    return (brightest + 0.05) / (darkest + 0.05);
  };

  // Check if contrast passes WCAG requirements
  const checkContrast = (contrast: number, textSize: 'normal' | 'large' = 'normal'): boolean => {
    if (textSize === 'large') {
      return contrast >= WCAG_AA_LARGE;
    }
    return contrast >= WCAG_AA_NORMAL;
  };

  // Get contrast level description
  const getContrastLevel = (contrast: number): string => {
    if (contrast >= WCAG_AAA_NORMAL) return 'Excellent (AAA)';
    if (contrast >= WCAG_AA_NORMAL) return 'Good (AA)';
    if (contrast >= WCAG_AA_LARGE) return 'Acceptable (AA Large)';
    return 'Poor';
  };

  // Get contrast status color
  const getContrastStatusColor = (contrast: number): string => {
    if (contrast >= WCAG_AA_NORMAL) return 'text-green-600';
    if (contrast >= WCAG_AA_LARGE) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Test color contrast
  const testContrast = () => {
    const contrast = calculateContrast(foregroundColor, backgroundColor);
    const passesNormal = checkContrast(contrast, 'normal');
    const passesLarge = checkContrast(contrast, 'large');

    setContrastResult({
      foreground: foregroundColor,
      background: backgroundColor,
      contrast,
      passes: passesNormal || passesLarge
    });
  };

  // Auto-generate accessible color combinations
  const generateAccessibleColors = () => {
    const baseColors = ['#000000', '#ffffff', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444'];
    const accessiblePairs: ColorPair[] = [];

    baseColors.forEach(fg => {
      baseColors.forEach(bg => {
        if (fg !== bg) {
          const contrast = calculateContrast(fg, bg);
          if (checkContrast(contrast)) {
            accessiblePairs.push({
              foreground: fg,
              background: bg,
              contrast,
              passes: true
            });
          }
        }
      });
    });

    // Sort by contrast ratio (highest first)
    accessiblePairs.sort((a, b) => b.contrast - a.contrast);
    return accessiblePairs.slice(0, 10); // Return top 10
  };

  // Apply theme colors
  const applyThemeColors = (theme: 'light' | 'dark') => {
    const colors = themeColors[theme];
    setForegroundColor(colors.onSurface);
    setBackgroundColor(colors.surface);
    setCurrentTheme(theme);
  };

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (currentTheme === 'system') {
        applyThemeColors(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    // Set initial theme
    if (currentTheme === 'system') {
      applyThemeColors(mediaQuery.matches ? 'dark' : 'light');
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentTheme]);

  // Auto-test contrast when colors change
  useEffect(() => {
    if (foregroundColor && backgroundColor) {
      testContrast();
    }
  }, [foregroundColor, backgroundColor]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Color Contrast Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:w-auto"
        aria-expanded={isOpen}
        aria-controls="color-contrast-panel"
      >
        <Palette className="w-4 h-4 mr-2" />
        Color Contrast
        {isOpen ? ' (Hide)' : ' (Show)'}
      </Button>

      {/* Color Contrast Panel */}
      {isOpen && (
        <Card className="p-6 space-y-6" id="color-contrast-panel" role="region" aria-label="Color Contrast Tools">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              🎨 Color Contrast Tools
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              aria-label="Close color contrast tools"
            >
              Close
            </Button>
          </div>

          {/* Theme Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Theme Selection
            </h3>
            
            <div className="flex gap-2">
              <Button
                variant={currentTheme === 'light' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => applyThemeColors('light')}
                className="flex items-center gap-2"
              >
                <Sun className="w-4 h-4" />
                Light
              </Button>
              
              <Button
                variant={currentTheme === 'dark' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => applyThemeColors('dark')}
                className="flex items-center gap-2"
              >
                <Moon className="w-4 h-4" />
                Dark
              </Button>
              
              <Button
                variant={currentTheme === 'system' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setCurrentTheme('system')}
                className="flex items-center gap-2"
              >
                <Monitor className="w-4 h-4" />
                System
              </Button>
            </div>
          </div>

          {/* Color Input */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Contrast className="w-5 h-5" />
              Test Color Contrast
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="foreground-color" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Foreground Color
                </label>
                <div className="flex gap-2">
                  <Input
                    id="foreground-color"
                    type="text"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                  <div
                    className="w-12 h-10 rounded border border-gray-300"
                    style={{ backgroundColor: foregroundColor }}
                    aria-label={`Foreground color preview: ${foregroundColor}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="background-color" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <Input
                    id="background-color"
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                  <div
                    className="w-12 h-10 rounded border border-gray-300"
                    style={{ backgroundColor: backgroundColor }}
                    aria-label={`Background color preview: ${backgroundColor}`}
                  />
                </div>
              </div>
            </div>

            {/* Test Button */}
            <Button
              onClick={testContrast}
              variant="primary"
              className="w-full md:w-auto"
            >
              <Eye className="w-4 h-4 mr-2" />
              Test Contrast
            </Button>
          </div>

          {/* Contrast Results */}
          {contrastResult && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Contrast Results
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Visual Preview */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Visual Preview</h4>
                  <div
                    className="p-4 rounded text-center"
                    style={{ 
                      backgroundColor: contrastResult.background,
                      color: contrastResult.foreground
                    }}
                  >
                    <p className="text-lg font-semibold">Sample Text</p>
                    <p className="text-sm">This is how your colors will look</p>
                  </div>
                </div>

                {/* Contrast Analysis */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Analysis</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Contrast Ratio:</span>
                      <span className={`font-medium ${getContrastStatusColor(contrastResult.contrast)}`}>
                        {contrastResult.contrast.toFixed(2)}:1
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Level:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {getContrastLevel(contrastResult.contrast)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Normal Text:</span>
                      <span className={checkContrast(contrastResult.contrast, 'normal') ? 'text-green-600' : 'text-red-600'}>
                        {checkContrast(contrastResult.contrast, 'normal') ? '✓ Pass' : '✗ Fail'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Large Text:</span>
                      <span className={checkContrast(contrastResult.contrast, 'large') ? 'text-green-600' : 'text-green-600'}>
                        {checkContrast(contrastResult.contrast, 'large') ? '✓ Pass' : '✗ Fail'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Accessible Color Suggestions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Accessible Color Suggestions
            </h3>
            
            <Button
              onClick={() => {
                const suggestions = generateAccessibleColors();
                // You could display these in a modal or expand this section
                console.log('Accessible color pairs:', suggestions);
              }}
              variant="secondary"
              className="w-full md:w-auto"
            >
              Generate Accessible Colors
            </Button>
          </div>

          {/* WCAG Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              WCAG 2.1 AA Requirements
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• <strong>Normal Text:</strong> Minimum contrast ratio 4.5:1</li>
              <li>• <strong>Large Text:</strong> Minimum contrast ratio 3:1 (18pt+ or 14pt+ bold)</li>
              <li>• <strong>Enhanced (AAA):</strong> Normal text 7:1, large text 4.5:1</li>
              <li>• <strong>UI Components:</strong> Minimum contrast ratio 3:1</li>
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
};
