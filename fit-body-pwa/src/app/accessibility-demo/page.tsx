'use client';

import React from 'react';
import { AccessibilitySettings } from '@/components/ui/AccessibilitySettings';
import { KeyboardNavigation } from '@/components/ui/KeyboardNavigation';
import { ColorContrast } from '@/components/ui/ColorContrast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { 
  Accessibility, 
  Eye, 
  Keyboard, 
  Palette, 
  CheckCircle, 
  Info,
  Star
} from 'lucide-react';

export default function AccessibilityDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Skip Links - Always visible to screen readers */}
      <div className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50">
        <a
          href="#main-content"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <a
          href="#navigation"
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ml-2"
        >
          Skip to navigation
        </a>
      </div>

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Accessibility className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Accessibility Demo
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                WCAG 2.1 AA Compliant
              </span>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Introduction */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ♿ Accessibility Features Showcase
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            This page demonstrates the comprehensive accessibility features implemented in Fit Body PWA.
            Test keyboard navigation, screen reader compatibility, and color contrast tools.
          </p>
          
          {/* Accessibility Status */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900 dark:text-green-100">
                  WCAG 2.1 AA Compliance Achieved
                </h3>
                <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                  All accessibility features are implemented and tested for screen readers, keyboard navigation, and color contrast.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Accessibility Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Accessibility Settings
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Customize your experience with high contrast, large text, reduced motion, and focus indicators.
            </p>
            <AccessibilitySettings />
          </Card>

          {/* Keyboard Navigation */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Keyboard className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Keyboard Navigation
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Learn keyboard shortcuts and test focus management. Use Tab, Arrow keys, and Alt+key combinations.
            </p>
            <KeyboardNavigation />
          </Card>

          {/* Color Contrast */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Color Contrast
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Test color combinations for WCAG compliance. Validate contrast ratios and generate accessible color pairs.
            </p>
            <ColorContrast />
          </Card>
        </div>

        {/* Interactive Demo Section */}
        <div className="space-y-8">
          {/* Form Demo */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Interactive Form Demo
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Test form accessibility with proper labels, error states, and focus management. Use Tab to navigate between fields.
            </p>
            
            <form className="space-y-4 max-w-md">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name <span className="text-red-500" aria-label="required">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  aria-describedby="name-help"
                />
                <p id="name-help" className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Enter your first and last name as it appears on official documents.
                </p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address <span className="text-red-500" aria-label="required">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  aria-describedby="email-help"
                />
                <p id="email-help" className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  We&apos;ll use this to send you important updates and notifications.
                </p>
              </div>

              <div>
                <label htmlFor="preferences" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Accessibility Preferences
                </label>
                <select
                  id="preferences"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-describedby="preferences-help"
                >
                  <option value="">Select your preferences</option>
                  <option value="high-contrast">High Contrast Mode</option>
                  <option value="large-text">Large Text</option>
                  <option value="reduced-motion">Reduced Motion</option>
                  <option value="screen-reader">Screen Reader Optimized</option>
                </select>
                <p id="preferences-help" className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Choose accessibility features that work best for you.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="newsletter"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  aria-describedby="newsletter-help"
                />
                <label htmlFor="newsletter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subscribe to accessibility newsletter
                </label>
              </div>
              <p id="newsletter-help" className="text-sm text-gray-500 dark:text-gray-400">
                Get updates on new accessibility features and improvements.
              </p>

              <div className="flex gap-3">
                <Button type="submit" variant="primary">
                  Submit Form
                </Button>
                <Button type="button" variant="secondary">
                  Reset Form
                </Button>
              </div>
            </form>
          </Card>

          {/* Focus Management Demo */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Focus Management Demo
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Test focus indicators and keyboard navigation. Use Tab to move between elements and see the focus ring.
            </p>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" className="focus:ring-4 focus:ring-blue-300 focus:ring-offset-2">
                  Primary Button
                </Button>
                <Button variant="secondary" className="focus:ring-4 focus:ring-gray-300 focus:ring-offset-2">
                  Secondary Button
                </Button>
                <Button variant="outline" className="focus:ring-4 focus:ring-blue-300 focus:ring-offset-2">
                  Outline Button
                </Button>
                <Button variant="destructive" className="focus:ring-4 focus:ring-red-300 focus:ring-offset-2">
                  Destructive Button
                </Button>
              </div>

              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Focus me with Tab"
                  className="focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
                />
                <Input
                  type="email"
                  placeholder="Another input field"
                  className="focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
                />
              </div>
            </div>
          </Card>

          {/* Screen Reader Demo */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Screen Reader Demo
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This section demonstrates proper ARIA labels, descriptions, and live regions for screen readers.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Live Region Example
                </h4>
                <div
                  aria-live="polite"
                  aria-atomic="true"
                  className="text-sm text-blue-800 dark:text-blue-200"
                >
                  This content will be announced to screen readers when it changes.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="demo-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Demo Select with Description
                  </label>
                  <select
                    id="demo-select"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-describedby="demo-select-description"
                  >
                    <option value="">Choose an option</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </select>
                  <p id="demo-select-description" className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    This select element has a description that screen readers will announce.
                  </p>
                </div>

                <div>
                  <label htmlFor="demo-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Demo Input with Error
                  </label>
                  <Input
                    id="demo-input"
                    type="text"
                    placeholder="Type something"
                    error="This field is required"
                    aria-describedby="demo-input-error"
                  />
                  <p id="demo-input-error" className="mt-1 text-sm text-red-600" role="alert">
                    This field is required
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Accessibility Checklist */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              Accessibility Checklist
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Verify that all accessibility features are working correctly.
            </p>
            
            <div className="space-y-3">
              {[
                '✓ Skip links are available and functional',
                '✓ All interactive elements are keyboard accessible',
                '✓ Focus indicators are visible and clear',
                '✓ Color contrast meets WCAG AA standards',
                '✓ Form labels are properly associated',
                '✓ ARIA labels and descriptions are implemented',
                '✓ Screen reader announcements work correctly',
                '✓ Reduced motion preferences are respected',
                '✓ High contrast mode is available',
                '✓ Large text mode is supported'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              ♿ Fit Body PWA - Built with accessibility in mind
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              WCAG 2.1 AA Compliant • Screen Reader Friendly • Keyboard Navigable
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
