/**
 * LoadingState - Flexible loading indicator component
 *
 * Provides consistent loading UI across the application with multiple variants.
 * Includes spinner, skeleton, and pulse options.
 *
 * @example
 * ```tsx
 * // Simple spinner
 * <LoadingState />
 *
 * // With message
 * <LoadingState message="Loading events..." />
 *
 * // Fullscreen overlay
 * <LoadingState fullscreen />
 *
 * // Skeleton loader
 * <LoadingState variant="skeleton" />
 * ```
 */

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  /**
   * Display variant
   * @default 'spinner'
   */
  variant?: 'spinner' | 'skeleton' | 'pulse' | 'dots';

  /**
   * Size of the loading indicator
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Optional message to display below the spinner
   */
  message?: string;

  /**
   * Whether to display as fullscreen overlay
   * @default false
   */
  fullscreen?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Number of skeleton rows (only for skeleton variant)
   * @default 3
   */
  rows?: number;
}

/**
 * Size mappings for spinner variant
 */
const spinnerSizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
} as const;

/**
 * LoadingState Component
 */
export function LoadingState({
  variant = 'spinner',
  size = 'md',
  message,
  fullscreen = false,
  className,
  rows = 3
}: LoadingStateProps) {
  // Fullscreen overlay wrapper
  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <LoadingState variant={variant} size="xl" />
          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </div>
      </div>
    );
  }

  // Spinner variant
  if (variant === 'spinner') {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2',
          className
        )}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <Loader2
          className={cn('animate-spin text-primary', spinnerSizes[size])}
          aria-hidden="true"
        />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Dots variant (three animated dots)
  if (variant === 'dots') {
    return (
      <div
        className={cn('flex items-center gap-1', className)}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={cn(
              'rounded-full bg-primary',
              size === 'sm' && 'h-1.5 w-1.5',
              size === 'md' && 'h-2 w-2',
              size === 'lg' && 'h-3 w-3',
              size === 'xl' && 'h-4 w-4'
            )}
            style={{
              animation: 'bounce 1.4s infinite ease-in-out both',
              animationDelay: `${i * 0.16}s`
            }}
          />
        ))}
        {message && (
          <span className="ml-2 text-sm text-muted-foreground">{message}</span>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Pulse variant (full-width pulsing bar)
  if (variant === 'pulse') {
    return (
      <div
        className={cn('space-y-2', className)}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div
          className={cn(
            'w-full animate-pulse rounded bg-muted',
            size === 'sm' && 'h-1',
            size === 'md' && 'h-2',
            size === 'lg' && 'h-3',
            size === 'xl' && 'h-4'
          )}
        />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Skeleton variant
  return (
    <div
      className={cn('space-y-3', className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse rounded bg-muted',
            size === 'sm' && 'h-8',
            size === 'md' && 'h-12',
            size === 'lg' && 'h-16',
            size === 'xl' && 'h-20',
            // Vary widths for more realistic skeleton
            i % 2 === 0 ? 'w-full' : 'w-11/12'
          )}
        />
      ))}
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Pre-configured loading states for common use cases
 */
LoadingState.Spinner = function LoadingSpinner() {
  return <LoadingState variant="spinner" />;
};

LoadingState.Skeleton = function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return <LoadingState variant="skeleton" rows={rows} />;
};

LoadingState.Dots = function LoadingDots() {
  return <LoadingState variant="dots" />;
};

LoadingState.Fullscreen = function LoadingFullscreen({ message }: { message?: string }) {
  return <LoadingState variant="spinner" fullscreen message={message} />;
};
