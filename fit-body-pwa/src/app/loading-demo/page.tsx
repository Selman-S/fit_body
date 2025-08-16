'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Spinner, {
  PulseSpinner,
  DotsSpinner,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonList,
  ProgressBar,
  CircularProgress,
  LoadingOverlay,
  LoadingButton,
} from '@/components/ui/Loading';

export default function LoadingDemoPage() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Simulate progress
  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + 10, 100));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const handleSimulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  const handleShowOverlay = () => {
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 3000);
  };

  const resetProgress = () => {
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Loading States Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test different loading components, spinners, and skeleton loaders
          </p>
        </div>

        {/* Spinners Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Spinner Components</CardTitle>
            <CardDescription>Different types of loading spinners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Default Spinner</h4>
                <div className="space-y-4">
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                  <Spinner size="xl" />
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Colored Spinners</h4>
                <div className="space-y-4">
                  <Spinner variant="primary" size="md" />
                  <Spinner variant="success" size="md" />
                  <Spinner variant="warning" size="md" />
                  <Spinner variant="error" size="md" />
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Pulse Spinner</h4>
                <div className="space-y-4">
                  <PulseSpinner variant="primary" size="md" />
                  <PulseSpinner variant="success" size="md" />
                  <PulseSpinner variant="warning" size="md" />
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Dots Spinner</h4>
                <div className="space-y-4">
                  <DotsSpinner />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skeleton Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Skeleton Loaders</CardTitle>
            <CardDescription>Content placeholders while loading</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Basic Skeleton</h4>
                <div className="space-y-3">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-3/4 h-4" />
                  <Skeleton className="w-1/2 h-4" />
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Skeleton Text</h4>
                <SkeletonText lines={4} lineHeight="md" />
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Skeleton Card</h4>
                <SkeletonCard />
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Skeleton List</h4>
                <SkeletonList items={3} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Progress Indicators</CardTitle>
            <CardDescription>Linear and circular progress bars</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Progress Bars</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Small Progress Bar</p>
                    <ProgressBar value={progress} size="sm" showLabel />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Medium Progress Bar</p>
                    <ProgressBar value={progress} size="md" variant="success" showLabel />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Large Progress Bar</p>
                    <ProgressBar value={progress} size="lg" variant="warning" showLabel />
                  </div>
                </div>
                <Button onClick={resetProgress} variant="outline" className="mt-4">
                  Reset Progress
                </Button>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Circular Progress</h4>
                <div className="flex flex-wrap gap-6">
                  <div className="text-center">
                    <CircularProgress value={progress} size="sm" showLabel />
                    <p className="text-xs text-gray-500 mt-2">Small</p>
                  </div>
                  <div className="text-center">
                    <CircularProgress value={progress} size="md" variant="success" showLabel />
                    <p className="text-xs text-gray-500 mt-2">Medium</p>
                  </div>
                  <div className="text-center">
                    <CircularProgress value={progress} size="lg" variant="warning" showLabel />
                    <p className="text-xs text-gray-500 mt-2">Large</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Interactive Loading States</CardTitle>
            <CardDescription>Test loading overlays and buttons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Loading Button</h4>
                <div className="space-y-3">
                  <LoadingButton loading={isLoading}>
                    <Button onClick={handleSimulateLoading} variant="primary">
                      Simulate Loading
                    </Button>
                  </LoadingButton>
                  
                  <LoadingButton loading={isLoading}>
                    <Button variant="secondary">
                      Secondary Button
                    </Button>
                  </LoadingButton>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Loading Overlay</h4>
                <LoadingOverlay isLoading={showOverlay} text="Processing data...">
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                      Content Area
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This content will be covered by a loading overlay when you click the button below.
                    </p>
                  </div>
                </LoadingOverlay>
                <Button onClick={handleShowOverlay} variant="outline" className="mt-3">
                  Show Loading Overlay
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-world Examples */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Real-world Examples</CardTitle>
            <CardDescription>How loading states look in actual UI patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Profile Skeleton */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">User Profile Loading</h4>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                </div>
              </div>
              
              {/* Workout Card Skeleton */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Workout Card Loading</h4>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-3 w-8 rounded-full" />
                      <Skeleton className="h-3 w-12 rounded-full" />
                      <Skeleton className="h-3 w-10 rounded-full" />
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading Features */}
        <Card>
          <CardHeader>
            <CardTitle>Loading Features</CardTitle>
            <CardDescription>What makes our loading system special</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Spinner Types</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• <strong>Spinner</strong> - Classic rotating border spinner</li>
                  <li>• <strong>PulseSpinner</strong> - Pulsing circle animation</li>
                  <li>• <strong>DotsSpinner</strong> - Bouncing dots animation</li>
                  <li>• <strong>LoadingButton</strong> - Button with integrated spinner</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Skeleton & Progress</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• <strong>Skeleton</strong> - Content placeholders</li>
                  <li>• <strong>ProgressBar</strong> - Linear progress indicator</li>
                  <li>• <strong>CircularProgress</strong> - Circular progress indicator</li>
                  <li>• <strong>LoadingOverlay</strong> - Full content overlay</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
