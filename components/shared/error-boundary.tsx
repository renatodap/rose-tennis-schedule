/**
 * ErrorBoundary - React error boundary for graceful error handling
 *
 * Catches JavaScript errors in child components, logs errors,
 * and displays a fallback UI instead of crashing the app.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <EventList />
 * </ErrorBoundary>
 *
 * // With custom fallback
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <ComplexComponent />
 * </ErrorBoundary>
 * ```
 */

'use client';

import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export interface ErrorBoundaryProps {
  /**
   * Child components to render
   */
  children: React.ReactNode;

  /**
   * Custom fallback UI to show on error
   */
  fallback?: React.ReactNode;

  /**
   * Callback when error occurs (for logging)
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;

  /**
   * Whether to show error details in development
   * @default true in development, false in production
   */
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * ErrorBoundary Component (Class component - required for error boundaries)
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so next render shows fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console
    console.error('Error caught by ErrorBoundary:', error, errorInfo);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo
    });

    // TODO: Log to error tracking service (Sentry, LogRocket, etc.)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          showDetails={
            this.props.showDetails ??
            process.env.NODE_ENV === 'development'
          }
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default error fallback UI
 */
interface DefaultErrorFallbackProps {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  onReset: () => void;
  showDetails: boolean;
}

function DefaultErrorFallback({
  error,
  errorInfo,
  onReset,
  showDetails
}: DefaultErrorFallbackProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Something went wrong</h2>
              <p className="text-sm text-muted-foreground">
                An unexpected error occurred
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {showDetails && error && (
            <div className="space-y-2">
              <div>
                <h3 className="text-sm font-medium">Error Message:</h3>
                <pre className="mt-1 overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                  {error.message}
                </pre>
              </div>

              {error.stack && (
                <div>
                  <h3 className="text-sm font-medium">Stack Trace:</h3>
                  <pre className="mt-1 max-h-40 overflow-auto rounded-lg bg-muted p-3 text-xs">
                    {error.stack}
                  </pre>
                </div>
              )}

              {errorInfo?.componentStack && (
                <div>
                  <h3 className="text-sm font-medium">Component Stack:</h3>
                  <pre className="mt-1 max-h-40 overflow-auto rounded-lg bg-muted p-3 text-xs">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          )}

          {!showDetails && (
            <p className="text-sm text-muted-foreground">
              We've been notified and are working to fix this issue.
              Please try refreshing the page or contact support if the problem persists.
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={onReset}
            className="w-full sm:w-auto"
            variant="default"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            className="w-full sm:w-auto"
            variant="outline"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

/**
 * Simple error fallback for inline errors (not full page)
 */
export function InlineErrorFallback({
  error,
  onRetry
}: {
  error?: Error | string;
  onRetry?: () => void;
}) {
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-center">
      <AlertCircle className="h-8 w-8 text-red-600" />
      <div>
        <h3 className="text-sm font-medium text-red-900">
          Failed to load content
        </h3>
        {errorMessage && (
          <p className="mt-1 text-xs text-red-700">{errorMessage}</p>
        )}
      </div>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 h-3 w-3" />
          Retry
        </Button>
      )}
    </div>
  );
}

/**
 * HOC to wrap a component with an error boundary
 *
 * @example
 * ```tsx
 * const SafeEventList = withErrorBoundary(EventList);
 * ```
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WrappedComponent;
}
