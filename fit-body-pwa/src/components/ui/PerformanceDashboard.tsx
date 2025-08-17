// Performance Dashboard Component - Fit Body PWA
// Displays Core Web Vitals and performance metrics

'use client';

import React from 'react';
import { Card } from './Card';
import { usePerformance, useMemoryUsage } from '@/lib/hooks/usePerformance';
import { TrendingUp, TrendingDown, Minus, Activity, Zap, Clock, Target } from 'lucide-react';

interface PerformanceDashboardProps {
  className?: string;
  showMemory?: boolean;
  showDetails?: boolean;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  className = '',
  showMemory = true,
  showDetails = true,
}) => {
  const { metrics, isReady, getPerformanceScore } = usePerformance();
  const memoryInfo = useMemoryUsage();

  if (!isReady) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  const score = getPerformanceScore();
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (score >= 70) return <Minus className="w-5 h-5 text-yellow-600" />;
    return <TrendingDown className="w-5 h-5 text-red-600" />;
  };

  const getMetricStatus = (value: number | null, thresholds: { good: number; needsImprovement: number }) => {
    if (value === null) return 'unknown';
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.needsImprovement) return 'needs-improvement';
    return 'poor';
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getMetricIcon = (status: string) => {
    switch (status) {
      case 'good': return <TrendingUp className="w-4 h-4" />;
      case 'needs-improvement': return <Minus className="w-4 h-4" />;
      case 'poor': return <TrendingDown className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Performance Dashboard
        </h3>
        <div className="flex items-center gap-2">
          {getScoreIcon(score)}
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
          <span className="text-sm text-gray-500">/100</span>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* LCP */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">LCP</span>
            {getMetricIcon(getMetricStatus(metrics.lcp, { good: 2500, needsImprovement: 4000 }))}
          </div>
          <div className={`text-lg font-bold ${getMetricColor(getMetricStatus(metrics.lcp, { good: 2500, needsImprovement: 4000 }))}`}>
            {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A'}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Largest Contentful Paint</div>
        </div>

        {/* FID */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">FID</span>
            {getMetricIcon(getMetricStatus(metrics.fid, { good: 100, needsImprovement: 300 }))}
          </div>
          <div className={`text-lg font-bold ${getMetricColor(getMetricStatus(metrics.fid, { good: 100, needsImprovement: 300 }))}`}>
            {metrics.fid ? `${Math.round(metrics.fid)}ms` : 'N/A'}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">First Input Delay</div>
        </div>

        {/* CLS */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">CLS</span>
            {getMetricIcon(getMetricStatus(metrics.cls, { good: 0.1, needsImprovement: 0.25 }))}
          </div>
          <div className={`text-lg font-bold ${getMetricColor(getMetricStatus(metrics.cls, { good: 0.1, needsImprovement: 0.25 }))}`}>
            {metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Cumulative Layout Shift</div>
        </div>
      </div>

      {/* Additional Metrics */}
      {showDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* FCP */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">FCP</span>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'N/A'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">First Contentful Paint</div>
          </div>

          {/* TTFB */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">TTFB</span>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'N/A'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Time to First Byte</div>
          </div>
        </div>
      )}

      {/* Memory Usage */}
      {showMemory && memoryInfo && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Memory Usage
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024)}MB
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Used</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024)}MB
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {Math.round(memoryInfo.jsHeapSizeLimit / 1024 / 1024)}MB
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Limit</div>
          </div>
          </div>
        </div>
      )}

      {/* Performance Tips */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          Performance Tips
        </h4>
        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
          {score < 90 && (
            <>
                             {metrics.lcp && metrics.lcp > 2500 && (
                 <li>• LCP yavaş - büyük resimleri optimize edin</li>
               )}
               {metrics.fid && metrics.fid > 100 && (
                 <li>• FID yavaş - JavaScript bundle&apos;ı küçültün</li>
               )}
               {metrics.cls && metrics.cls > 0.1 && (
                 <li>• CLS yüksek - layout shift&apos;leri önleyin</li>
               )}
            </>
          )}
          {score >= 90 && (
            <li>• Mükemmel performans! 🎉</li>
          )}
        </ul>
      </div>
    </Card>
  );
};

// Performance Badge Component
export const PerformanceBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { getPerformanceScore, isReady } = usePerformance();

  if (!isReady) return null;

  const score = getPerformanceScore();
  const getBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColor(score)} ${className}`}>
      <Activity className="w-3 h-3" />
      {score}/100
    </div>
  );
};
