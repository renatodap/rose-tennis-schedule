/**
 * Toast Context - Global toast notification system
 *
 * Provides a centralized way to show toast notifications throughout the app.
 * Manages toast state, duration, and auto-dismissal.
 *
 * @example
 * ```tsx
 * // In your app root
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 *
 * // In any component
 * const { toast } = useToast();
 *
 * toast.success('Event created successfully');
 * toast.error('Failed to load data');
 * toast.info('New message received');
 * ```
 */

'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NOTIFICATION_CONFIG, Z_INDEX } from '@/lib/constants';

/**
 * Toast type/severity
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast message data
 */
export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Toast context value
 */
interface ToastContextValue {
  toasts: Toast[];
  toast: {
    success: (title: string, description?: string, duration?: number) => void;
    error: (title: string, description?: string, duration?: number) => void;
    warning: (title: string, description?: string, duration?: number) => void;
    info: (title: string, description?: string, duration?: number) => void;
    custom: (toast: Omit<Toast, 'id'>) => void;
  };
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Toast Provider Component
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Adds a toast to the queue
   */
  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 11);
    const newToast: Toast = { ...toast, id };

    setToasts(prev => {
      // Limit max concurrent toasts
      const updated = [...prev, newToast];
      if (updated.length > NOTIFICATION_CONFIG.MAX_TOASTS) {
        return updated.slice(-NOTIFICATION_CONFIG.MAX_TOASTS);
      }
      return updated;
    });

    // Auto-dismiss after duration
    const duration = toast.duration || NOTIFICATION_CONFIG.TOAST_DURATION;
    setTimeout(() => {
      dismiss(id);
    }, duration);

    return id;
  }, []);

  /**
   * Removes a toast by ID
   */
  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  /**
   * Removes all toasts
   */
  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  /**
   * Convenience methods for different toast types
   */
  const toast = {
    success: (title: string, description?: string, duration?: number) => {
      addToast({
        type: 'success',
        title,
        description,
        duration: duration || NOTIFICATION_CONFIG.SUCCESS_DURATION
      });
    },
    error: (title: string, description?: string, duration?: number) => {
      addToast({
        type: 'error',
        title,
        description,
        duration: duration || NOTIFICATION_CONFIG.ERROR_DURATION
      });
    },
    warning: (title: string, description?: string, duration?: number) => {
      addToast({
        type: 'warning',
        title,
        description,
        duration
      });
    },
    info: (title: string, description?: string, duration?: number) => {
      addToast({
        type: 'info',
        title,
        description,
        duration
      });
    },
    custom: (toast: Omit<Toast, 'id'>) => {
      addToast(toast);
    }
  };

  const value: ToastContextValue = {
    toasts,
    toast,
    dismiss,
    dismissAll
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

/**
 * Hook to use toast notifications
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

/**
 * Toast Container - Renders all active toasts
 */
interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-0 right-0 z-[var(--z-toast)] flex flex-col gap-2 p-4 sm:bottom-4 sm:right-4"
      style={{ '--z-toast': Z_INDEX.TOAST } as React.CSSProperties}
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

/**
 * Individual Toast Item
 */
interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const styles = {
    success: {
      container: 'bg-green-50 border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900',
      description: 'text-green-700'
    },
    error: {
      container: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      title: 'text-red-900',
      description: 'text-red-700'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      description: 'text-yellow-700'
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      description: 'text-blue-700'
    }
  };

  const Icon = icons[toast.type];
  const style = styles[toast.type];

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-right-full',
        style.container
      )}
      role="alert"
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0', style.icon)} />

      <div className="flex-1 space-y-1">
        <p className={cn('text-sm font-medium', style.title)}>
          {toast.title}
        </p>
        {toast.description && (
          <p className={cn('text-sm', style.description)}>
            {toast.description}
          </p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className={cn(
              'mt-2 text-sm font-medium underline-offset-4 hover:underline',
              style.title
            )}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className={cn(
          'flex-shrink-0 rounded-md p-1 transition-colors hover:bg-black/5',
          style.icon
        )}
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
