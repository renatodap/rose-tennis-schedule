'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  [
    // Base styles
    'inline-flex items-center justify-center gap-2',
    'font-semibold tracking-tight',
    'transition-all duration-200',
    'disabled:pointer-events-none disabled:opacity-50',
    // Focus states - accessibility
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-offset-2',
    // Active state - press feedback
    'active:scale-[0.98]',
    // Ensure proper touch targets on mobile
    'touch-manipulation',
  ],
  {
    variants: {
      variant: {
        // Primary - Bold maroon CTAs
        default: [
          'bg-maroon-700 text-white',
          'shadow-md hover:shadow-lg',
          'hover:bg-maroon-800 hover:shadow-maroon',
          'focus-visible:ring-maroon-700',
          'active:bg-maroon-900',
        ],

        // Secondary - Outlined, subtle
        secondary: [
          'border-2 border-maroon-700 bg-transparent text-maroon-700',
          'shadow-sm hover:shadow',
          'hover:bg-maroon-50',
          'focus-visible:ring-maroon-700',
          'active:bg-maroon-100',
        ],

        // Ghost - Transparent until hover
        ghost: [
          'bg-transparent text-neutral-700',
          'hover:bg-neutral-100',
          'focus-visible:ring-neutral-400',
          'active:bg-neutral-200',
        ],

        // Destructive - Dangerous actions
        destructive: [
          'bg-error-500 text-white',
          'shadow-md hover:shadow-lg',
          'hover:bg-error-600',
          'focus-visible:ring-error-500',
          'active:bg-error-700',
        ],

        // Success - Positive confirmations (Going)
        success: [
          'bg-success-500 text-white',
          'shadow-md hover:shadow-lg',
          'hover:bg-success-600 hover:shadow-accent',
          'focus-visible:ring-success-500',
          'active:bg-success-700',
        ],

        // Warning - Cautionary (Maybe)
        warning: [
          'bg-warning-500 text-white',
          'shadow-md hover:shadow-lg',
          'hover:bg-warning-600',
          'focus-visible:ring-warning-500',
          'active:bg-warning-600',
        ],

        // Outline - Neutral border only
        outline: [
          'border-2 border-neutral-300 bg-transparent text-neutral-700',
          'shadow-sm hover:shadow',
          'hover:bg-neutral-50 hover:border-neutral-400',
          'focus-visible:ring-neutral-400',
          'active:bg-neutral-100',
        ],

        // Link - Text-only, inline
        link: [
          'bg-transparent text-maroon-700 underline-offset-4',
          'hover:underline',
          'focus-visible:ring-maroon-700',
          'shadow-none',
        ],
      },

      size: {
        // Extra small - Compact, icon-only viable (32px)
        xs: 'h-8 min-h-8 px-3 text-xs rounded-md gap-1.5',

        // Small - Tight spaces (36px)
        sm: 'h-9 min-h-9 px-4 text-sm rounded-md gap-2',

        // Default - Standard actions (44px - touch optimized)
        default: 'h-11 min-h-11 px-6 text-base rounded-lg gap-2',

        // Large - Primary CTAs (52px)
        lg: 'h-13 min-h-13 px-8 text-lg rounded-xl gap-2.5',

        // Extra large - Hero actions (60px)
        xl: 'h-15 min-h-15 px-10 text-xl rounded-2xl gap-3',

        // Icon - Square button for icons (44px x 44px)
        icon: 'h-11 w-11 min-h-11 min-w-11 rounded-lg p-0',

        // Icon variants for different sizes
        'icon-xs': 'h-8 w-8 min-h-8 min-w-8 rounded-md p-0',
        'icon-sm': 'h-9 w-9 min-h-9 min-w-9 rounded-md p-0',
        'icon-lg': 'h-13 w-13 min-h-13 min-w-13 rounded-xl p-0',
        'icon-xl': 'h-15 w-15 min-h-15 min-w-15 rounded-2xl p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'prefix'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const content = isLoading ? (
      <>
        <Loader2 className="h-[1.2em] w-[1.2em] animate-spin" />
        <span className="opacity-70">{children}</span>
      </>
    ) : (
      <>
        {iconLeft && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {iconLeft}
          </span>
        )}
        {children}
        {iconRight && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {iconRight}
          </span>
        )}
      </>
    );

    const buttonClasses = cn(
      buttonVariants({ variant, size }),
      fullWidth && 'w-full',
      className
    );

    // If asChild, use Slot without motion
    if (asChild) {
      return (
        <Slot
          className={buttonClasses}
          ref={ref}
          {...props}
        >
          {content}
        </Slot>
      );
    }

    // Otherwise use motion.button with micro-interactions
    return (
      <motion.button
        className={buttonClasses}
        ref={ref}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        {...(props as any)}
      >
        {content}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
