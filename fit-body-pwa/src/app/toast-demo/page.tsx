'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ToastProvider, useToast, createToastHelpers } from '@/components/ui/Toast';

// Toast demo component
function ToastDemo() {
  const { addToast, clearToasts } = useToast();
  const toastHelpers = createToastHelpers(addToast);

  const [showPersistentToast, setShowPersistentToast] = useState(false);

  const handleSuccessToast = () => {
    toastHelpers.success('Your workout has been saved successfully!', {
      title: 'Workout Saved',
      duration: 4000,
    });
  };

  const handleErrorToast = () => {
    toastHelpers.error('Failed to save workout. Please try again.', {
      title: 'Save Failed',
      duration: 6000,
      action: {
        label: 'Retry',
        onClick: () => {
          toastHelpers.info('Retrying to save workout...');
        },
      },
    });
  };

  const handleWarningToast = () => {
    toastHelpers.warning('You have been inactive for 30 minutes. Consider taking a break.', {
      title: 'Inactivity Warning',
      duration: 8000,
    });
  };

  const handleInfoToast = () => {
    toastHelpers.info('New workout programs are available! Check them out.', {
      title: 'New Content',
      duration: 5000,
      action: {
        label: 'View Programs',
        onClick: () => {
          toastHelpers.success('Redirecting to workout programs...');
        },
      },
    });
  };

  const handleCustomToast = () => {
    addToast({
      type: 'success',
      title: 'Custom Toast',
      message: 'This is a custom toast with specific duration and position.',
      duration: 3000,
      position: 'bottom-center',
    });
  };

  const handlePersistentToast = () => {
    setShowPersistentToast(true);
    addToast({
      type: 'info',
      title: 'Persistent Toast',
      message: 'This toast will stay until you manually close it.',
      persistent: true,
      position: 'top-center',
    });
  };

  const handleMultipleToasts = () => {
    // Add multiple toasts quickly
    toastHelpers.success('First toast!', { duration: 2000 });
    setTimeout(() => toastHelpers.info('Second toast!', { duration: 2000 }), 500);
    setTimeout(() => toastHelpers.warning('Third toast!', { duration: 2000 }), 1000);
    setTimeout(() => toastHelpers.error('Fourth toast!', { duration: 2000 }), 1500);
  };

  const handleLongMessageToast = () => {
    toastHelpers.info(
      'This is a very long message that demonstrates how the toast handles extended content. It should wrap properly and maintain good readability across different screen sizes.',
      {
        title: 'Long Message Test',
        duration: 7000,
      }
    );
  };

  const handleActionToast = () => {
    toastHelpers.warning('Your workout session will expire in 5 minutes.', {
      title: 'Session Expiring',
      duration: 10000,
      action: {
        label: 'Extend Session',
        onClick: () => {
          toastHelpers.success('Session extended by 30 minutes!');
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Toast Notification Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test different toast types, positions, and configurations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Success Toast */}
          <Card variant="default" size="md">
            <CardHeader>
              <CardTitle>Success Toast</CardTitle>
              <CardDescription>Show success notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleSuccessToast}
                variant="success"
                fullWidth
              >
                Show Success Toast
              </Button>
            </CardContent>
          </Card>

          {/* Error Toast */}
          <Card variant="default" size="md">
            <CardHeader>
              <CardTitle>Error Toast</CardTitle>
              <CardDescription>Show error notifications with action</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleErrorToast}
                variant="destructive"
                fullWidth
              >
                Show Error Toast
              </Button>
            </CardContent>
          </Card>

          {/* Warning Toast */}
          <Card variant="default" size="md">
            <CardHeader>
              <CardTitle>Warning Toast</CardTitle>
              <CardDescription>Show warning notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleWarningToast}
                variant="warning"
                fullWidth
              >
                Show Warning Toast
              </Button>
            </CardContent>
          </Card>

          {/* Info Toast */}
          <Card variant="default" size="md">
            <CardHeader>
              <CardTitle>Info Toast</CardTitle>
              <CardDescription>Show info notifications with action</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleInfoToast}
                variant="primary"
                fullWidth
              >
                Show Info Toast
              </Button>
            </CardContent>
          </Card>

          {/* Custom Toast */}
          <Card variant="default" size="md">
            <CardHeader>
              <CardTitle>Custom Toast</CardTitle>
              <CardDescription>Custom duration and position</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleCustomToast}
                variant="outline"
                fullWidth
              >
                Show Custom Toast
              </Button>
            </CardContent>
          </Card>

          {/* Persistent Toast */}
          <Card variant="default" size="md">
            <CardHeader>
              <CardTitle>Persistent Toast</CardTitle>
              <CardDescription>Toast that stays until closed</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handlePersistentToast}
                variant="ghost"
                fullWidth
              >
                Show Persistent Toast
              </Button>
            </CardContent>
          </Card>

          {/* Multiple Toasts */}
          <Card variant="default" size="md">
            <CardHeader>
              <CardTitle>Multiple Toasts</CardTitle>
              <CardDescription>Show several toasts quickly</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleMultipleToasts}
                variant="secondary"
                fullWidth
              >
                Show Multiple Toasts
              </Button>
            </CardContent>
          </Card>

          {/* Long Message Toast */}
          <Card variant="default" size="md">
            <CardHeader>
              <CardTitle>Long Message Toast</CardTitle>
              <CardDescription>Test text wrapping</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleLongMessageToast}
                variant="outline"
                fullWidth
              >
                Show Long Message Toast
              </Button>
            </CardContent>
          </Card>

          {/* Action Toast */}
          <Card variant="default" size="md">
            <CardHeader>
              <CardTitle>Action Toast</CardTitle>
              <CardDescription>Toast with interactive action</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleActionToast}
                variant="warning"
                fullWidth
              >
                Show Action Toast
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Toast Control Panel</CardTitle>
            <CardDescription>Manage all active toasts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                onClick={clearToasts}
                variant="destructive"
              >
                Clear All Toasts
              </Button>
              <Button 
                onClick={() => setShowPersistentToast(false)}
                variant="outline"
                disabled={!showPersistentToast}
              >
                Close Persistent Toast
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Toast Features */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Toast Features</CardTitle>
            <CardDescription>What makes our toast system special</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Core Features</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• 4 toast types: Success, Error, Warning, Info</li>
                  <li>• 6 position options: Top/Bottom + Left/Right/Center</li>
                  <li>• Auto-dismiss with progress bar</li>
                  <li>• Persistent toasts (manual close only)</li>
                  <li>• Action buttons for interactive notifications</li>
                  <li>• Smooth slide-in/out animations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Advanced Features</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Context-based state management</li>
                  <li>• Customizable duration per toast</li>
                  <li>• Maximum toast limit (default: 5)</li>
                  <li>• Dark mode support</li>
                  <li>• Responsive design</li>
                  <li>• Accessibility features</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main page with ToastProvider
export default function ToastDemoPage() {
  return (
    <ToastProvider position="top-right" maxToasts={5} defaultDuration={5000}>
      <ToastDemo />
    </ToastProvider>
  );
}
