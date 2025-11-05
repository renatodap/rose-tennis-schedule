/**
 * Context providers barrel export
 *
 * Provides easy importing of context providers and hooks
 *
 * @example
 * ```tsx
 * import { ToastProvider, useToast, QuarterProvider, useQuarter } from '@/lib/contexts';
 * ```
 */

export { ToastProvider, useToast } from './toast-context';
export type { Toast, ToastType } from './toast-context';

export { QuarterProvider, useQuarter } from './quarter-context';
