// Lazy Loader Component - Fit Body PWA
// Provides lazy loading with loading states and error boundaries

'use client';

import React, { Suspense, lazy, ComponentType } from 'react';
import Loading from './Loading';

interface LazyLoaderProps {
  component: () => Promise<{ default: ComponentType<Record<string, unknown>> }>;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  className?: string;
}

interface LazyLoaderState {
  hasError: boolean;
  error?: Error;
}

export class LazyLoader extends React.Component<LazyLoaderProps, LazyLoaderState> {
  constructor(props: LazyLoaderProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): LazyLoaderState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LazyLoader error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.errorFallback || (
        <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg">
          <p>Bir hata oluştu. Lütfen sayfayı yenileyin.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Tekrar Dene
          </button>
        </div>
      );
    }

    const LazyComponent = lazy(this.props.component);

    return (
      <Suspense fallback={this.props.fallback || <Loading />}>
        <LazyComponent />
      </Suspense>
    );
  }
}

// Lazy loading wrapper for components
export const lazyLoad = <T extends ComponentType<Record<string, unknown>>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) => {
  return (
    <LazyLoader
      component={importFunc}
      fallback={fallback}
    />
  );
};

// Preload function for critical components
export const preloadComponent = <T extends ComponentType<Record<string, unknown>>>(
  importFunc: () => Promise<{ default: T }>
) => {
  return () => {
    importFunc();
    return null;
  };
};

// Intersection Observer based lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasIntersected, setHasIntersected] = React.useState(false);
  const elementRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasIntersected) {
        setIsIntersecting(true);
        setHasIntersected(true);
      }
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options, hasIntersected]);

  return { elementRef, isIntersecting, hasIntersected };
};

// Lazy Image Component
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzVMMTMwIDEwNUg3MFYxMzVIMTMwVjEwNUwxMDAgNzVaIiBmaWxsPSIjOUI5Q0FGIi8+Cjwvc3ZnPgo=',
  onLoad,
  onError,
}) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder);
  const [isLoading, setIsLoading] = React.useState(true);
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
  });

  React.useEffect(() => {
    if (isIntersecting && imageSrc === placeholder) {
      setImageSrc(src);
    }
  }, [isIntersecting, src, imageSrc, placeholder]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    onError?.();
  };

  return (
    <div ref={elementRef as React.RefObject<HTMLDivElement>} className={className}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};
