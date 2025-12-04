'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

const inputVariants = cva(
  'flex w-full rounded-md text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-white border border-neutral-300 focus:bg-neutral-50',
        filled: 'bg-neutral-100 border border-transparent focus:bg-neutral-200 focus:border-neutral-300',
        outlined: 'bg-transparent border-2 border-neutral-300 focus:bg-white',
      },
      inputSize: {
        sm: 'h-9 px-3 py-1.5 text-sm',     // 36px
        default: 'h-11 px-4 py-2.5 text-base',  // 44px
        lg: 'h-13 px-5 py-3.5 text-base',       // 52px
      },
      state: {
        default: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon-700 focus-visible:ring-offset-2 focus-visible:border-maroon-700',
        error: 'border-error-500 focus-visible:ring-error-500 focus-visible:border-error-500',
        success: 'border-success-500 focus-visible:ring-success-500 focus-visible:border-success-500',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
      state: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  clearable?: boolean;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      inputSize,
      state,
      leadingIcon,
      trailingIcon,
      prefix,
      suffix,
      clearable,
      onClear,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(value || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      setInternalValue('');
      onClear?.();
    };

    const showClearButton = clearable && (value || internalValue);

    return (
      <motion.div
        className="relative w-full"
        initial={false}
        animate={isFocused ? { scale: 1 } : { scale: 1 }}
      >
        {leadingIcon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {leadingIcon}
          </div>
        )}

        {prefix && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500 font-medium">
            {prefix}
          </div>
        )}

        <input
          type={type}
          className={cn(
            inputVariants({ variant, inputSize, state }),
            leadingIcon && 'pl-10',
            prefix && 'pl-12',
            (trailingIcon || suffix || showClearButton) && 'pr-10',
            className
          )}
          ref={ref}
          value={value !== undefined ? value : internalValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {showClearButton && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Clear input"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {!showClearButton && trailingIcon && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {trailingIcon}
          </div>
        )}

        {!showClearButton && !trailingIcon && suffix && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500 font-medium">
            {suffix}
          </div>
        )}
      </motion.div>
    );
  }
);
Input.displayName = 'Input';

export { Input, inputVariants };
