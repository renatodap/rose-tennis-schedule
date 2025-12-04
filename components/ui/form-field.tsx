'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { Label } from './label';

export interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  htmlFor?: string;
  error?: string | boolean;
  success?: string | boolean;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
  labelClassName?: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      children,
      label,
      htmlFor,
      error,
      success,
      hint,
      required,
      optional,
      className,
      labelClassName,
    },
    ref
  ) => {
    const errorMessage = typeof error === 'string' ? error : undefined;
    const successMessage = typeof success === 'string' ? success : undefined;
    const hasError = Boolean(error);
    const hasSuccess = Boolean(success) && !hasError;

    return (
      <div ref={ref} className={cn('w-full space-y-2', className)}>
        {label && (
          <Label
            htmlFor={htmlFor}
            required={required}
            optional={optional}
            className={labelClassName}
          >
            {label}
          </Label>
        )}

        {children}

        {/* Hint text */}
        {hint && !hasError && !hasSuccess && (
          <div className="flex items-start gap-1.5 text-xs text-neutral-500">
            <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            <span>{hint}</span>
          </div>
        )}

        {/* Error message with animation */}
        <AnimatePresence mode="wait">
          {hasError && errorMessage && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="flex items-start gap-1.5 text-xs text-error-600"
              role="alert"
            >
              <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success message with animation */}
        <AnimatePresence mode="wait">
          {hasSuccess && successMessage && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="flex items-start gap-1.5 text-xs text-success-600"
              role="status"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
FormField.displayName = 'FormField';

export { FormField };
