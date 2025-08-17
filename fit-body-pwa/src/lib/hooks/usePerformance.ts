// Performance Monitoring Hook - Fit Body PWA
// Tracks Core Web Vitals and performance metrics

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
  fmp: number | null; // First Meaningful Paint
}

interface UsePerformanceReturn {
  metrics: PerformanceMetrics;
  isReady: boolean;
  getPerformanceScore: () => number;
  logMetric: (name: string, value: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LayoutShiftEntry = PerformanceEntry & { hadRecentInput?: boolean; value?: number };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FirstInputEntry = PerformanceEntry & { processingStart: number };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PerformanceWithMemory = Performance & { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WindowWithGtag = Window & { gtag: (event: string, data: Record<string, unknown>) => void };

export const usePerformance = (): UsePerformanceReturn => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fmp: null,
  });
  const [isReady, setIsReady] = useState(false);
  const observerRef = useRef<PerformanceObserver | null>(null);
  const lcpEntryRef = useRef<PerformanceEntry | null>(null);

  // Get performance score based on Core Web Vitals
  const getPerformanceScore = useCallback((): number => {
    let score = 100;
    
    // LCP scoring (0-2500ms = good, 2500-4000ms = needs improvement, >4000ms = poor)
    if (metrics.lcp) {
      if (metrics.lcp > 4000) score -= 30;
      else if (metrics.lcp > 2500) score -= 15;
    }
    
    // FID scoring (0-100ms = good, 100-300ms = needs improvement, >300ms = poor)
    if (metrics.fid) {
      if (metrics.fid > 300) score -= 30;
      else if (metrics.fid > 100) score -= 15;
    }
    
    // CLS scoring (0-0.1 = good, 0.1-0.25 = needs improvement, >0.25 = poor)
    if (metrics.cls) {
      if (metrics.cls > 0.25) score -= 30;
      else if (metrics.cls > 0.1) score -= 15;
    }
    
    return Math.max(0, score);
  }, [metrics.lcp, metrics.fid, metrics.cls]);

  // Log custom performance metric
  const logMetric = (name: string, value: number) => {
    if ('performance' in window) {
      performance.mark(`${name}-start`);
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Performance Metric - ${name}:`, value);
      }
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Measure TTFB
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      setMetrics(prev => ({
        ...prev,
        ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
      }));
    }

    // FCP Observer
    try {
      observerRef.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
          }
        });
      });
      
      observerRef.current.observe({ entryTypes: ['paint'] });
    } catch {
      console.warn('PerformanceObserver not supported');
    }

    // LCP Observer
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          lcpEntryRef.current = lastEntry;
          setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
        }
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch {
      console.warn('LCP observer not supported');
    }

    // FID Observer
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'first-input') {
            const firstInputEntry = entry as FirstInputEntry;
            setMetrics(prev => ({ ...prev, fid: firstInputEntry.processingStart - firstInputEntry.startTime }));
          }
        });
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch {
      console.warn('FID observer not supported');
    }

    // CLS Observer
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as LayoutShiftEntry;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value || 0;
            setMetrics(prev => ({ ...prev, cls: clsValue }));
          }
        }
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch {
      console.warn('CLS observer not supported');
    }

    // Mark app as ready after initial metrics
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearTimeout(timer);
    };
  }, []);

  // Log metrics when they change
  useEffect(() => {
    if (isReady) {
      const score = getPerformanceScore();
      console.log('Performance Score:', score);
      console.log('Core Web Vitals:', metrics);
    }
  }, [metrics, isReady, getPerformanceScore]);

  return {
    metrics,
    isReady,
    getPerformanceScore,
    logMetric,
  };
};

// Performance monitoring for specific components
export const useComponentPerformance = (componentName: string) => {
  const startTime = useRef<number>(Date.now());
  const { logMetric } = usePerformance();

  useEffect(() => {
    const endTime = Date.now();
    const renderTime = endTime - startTime.current;
    
    logMetric(`${componentName}-render`, renderTime);
    
    // Log to analytics if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const windowWithGtag = window as unknown as WindowWithGtag;
      windowWithGtag.gtag('component_render', {
        component_name: componentName,
        render_time: renderTime,
      });
    }
  }, [componentName, logMetric]);

  return { logMetric };
};

// Memory usage monitoring
export const useMemoryUsage = () => {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    if ('memory' in performance) {
      const updateMemoryInfo = () => {
        const memory = (performance as PerformanceWithMemory).memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        });
      };

      updateMemoryInfo();
      const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, []);

  return memoryInfo;
};
