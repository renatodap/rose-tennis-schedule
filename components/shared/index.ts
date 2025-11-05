/**
 * Shared components barrel export
 *
 * Provides easy importing of commonly used shared components
 *
 * @example
 * ```tsx
 * import { LoadingState, EmptyState, ErrorBoundary } from '@/components/shared';
 * ```
 */

export { LoadingState } from './loading-state';
export type { LoadingStateProps } from './loading-state';

export { EmptyState } from './empty-state';
export type { EmptyStateProps } from './empty-state';

export { ErrorBoundary, InlineErrorFallback, withErrorBoundary } from './error-boundary';
export type { ErrorBoundaryProps } from './error-boundary';
