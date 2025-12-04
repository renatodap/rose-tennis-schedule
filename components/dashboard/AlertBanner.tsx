'use client';

/**
 * AlertBanner component
 * Prominent notifications for important actions or information
 * Dismissible but persistent if marked as important
 */

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Info, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

interface AlertBannerProps {
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'success' | 'danger';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variantStyles = {
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-600',
    text: 'text-blue-900',
    Icon: Info,
  },
  warning: {
    container: 'bg-orange-50 border-orange-200',
    icon: 'text-orange-600',
    text: 'text-orange-900',
    Icon: AlertCircle,
  },
  success: {
    container: 'bg-green-50 border-green-200',
    icon: 'text-green-600',
    text: 'text-green-900',
    Icon: CheckCircle,
  },
  danger: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-600',
    text: 'text-red-900',
    Icon: AlertCircle,
  },
};

export function AlertBanner({
  children,
  variant = 'info',
  dismissible = true,
  onDismiss,
  className,
}: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const styles = variantStyles[variant];
  const { Icon } = styles;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={cn(
              'border-2 rounded-lg p-4',
              styles.container,
              className
            )}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={cn('shrink-0 mt-0.5', styles.icon)}>
                <Icon className="h-5 w-5" />
              </div>

              {/* Content */}
              <div className={cn('flex-1 min-w-0', styles.text)}>
                {children}
              </div>

              {/* Dismiss button */}
              {dismissible && (
                <button
                  onClick={handleDismiss}
                  className={cn(
                    'shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors',
                    styles.icon
                  )}
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
