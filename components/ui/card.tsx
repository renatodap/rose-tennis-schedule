'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

/**
 * $100M DESIGN SYSTEM - CARD COMPONENT
 *
 * Premium card system with variants, interactive states, and micro-interactions.
 * Cards are the primary content container - must be elegant, informative, and touchable.
 *
 * Features:
 * - 6 visual variants (default, elevated, outlined, filled, glass, interactive)
 * - Responsive behavior (mobile-first, full-width on mobile)
 * - Interactive states (hover lift, press feedback, selected)
 * - Loading skeleton state
 * - Positioned badges for status indicators
 * - Media areas with aspect ratio support
 * - Smooth transitions and micro-interactions
 */

// Card variant styles using CVA
const cardVariants = cva(
  // Base styles - common to all variants
  'rounded-lg transition-all duration-200 ease-athletic',
  {
    variants: {
      variant: {
        // Default: Subtle border, light shadow
        default: [
          'border border-neutral-200 bg-white text-neutral-950',
          'shadow-sm',
          'dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
        ].join(' '),

        // Elevated: Raised with shadow, premium feel
        elevated: [
          'border border-neutral-100 bg-white text-neutral-950',
          'shadow-md hover:shadow-lg',
          'dark:border-neutral-900 dark:bg-neutral-950 dark:text-neutral-50',
        ].join(' '),

        // Outlined: Border-only, minimal and clean
        outlined: [
          'border-2 border-neutral-200 bg-transparent text-neutral-950',
          'dark:border-neutral-700 dark:text-neutral-50',
        ].join(' '),

        // Filled: Solid background for emphasis
        filled: [
          'border-0 bg-neutral-50 text-neutral-950',
          'dark:bg-neutral-900 dark:text-neutral-50',
        ].join(' '),

        // Glass: Subtle blur/transparency for overlays
        glass: [
          'border border-white/20 bg-white/80 text-neutral-950',
          'backdrop-blur-md shadow-lg',
          'dark:border-neutral-800/20 dark:bg-neutral-900/80 dark:text-neutral-50',
        ].join(' '),

        // Interactive: Hover effects, cursor pointer
        interactive: [
          'border border-neutral-200 bg-white text-neutral-950',
          'shadow-sm hover:shadow-hover cursor-pointer',
          'active:shadow-press active:scale-[0.99]',
          'dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
          'transition-all duration-200',
        ].join(' '),
      },

      // Size variants
      size: {
        default: 'p-6',
        sm: 'p-4',
        lg: 'p-8',
      },

      // Selected state
      selected: {
        true: 'border-maroon-700 ring-2 ring-maroon-700/20',
      },

      // Loading state
      loading: {
        true: 'animate-pulse pointer-events-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Card component with motion and variants
export interface CardProps
  extends Omit<HTMLMotionProps<'div'>, 'children'>,
    VariantProps<typeof cardVariants> {
  children?: React.ReactNode;
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, selected, loading, children, ...props }, ref) => {
    const MotionDiv = motion.div;

    return (
      <MotionDiv
        ref={ref}
        className={cn(cardVariants({ variant, size, selected, loading }), className)}
        // Hover lift animation for interactive cards
        whileHover={
          variant === 'interactive' || variant === 'elevated'
            ? { y: -2, transition: { duration: 0.2 } }
            : undefined
        }
        {...props}
      >
        {children}
      </MotionDiv>
    );
  }
);
Card.displayName = 'Card';

// Card Header - Title area with optional actions
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col space-y-1.5',
      'px-6 py-5',
      'sm:px-6 sm:py-6', // Slightly more padding on larger screens
      className
    )}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

// Card Title - Primary text with proper typography scale
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      // Responsive typography
      'text-lg font-semibold leading-tight tracking-tight',
      'sm:text-xl', // Larger on desktop
      'text-neutral-900 dark:text-neutral-50',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

// Card Description - Secondary text, muted
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm leading-relaxed',
      'text-neutral-600 dark:text-neutral-400',
      className
    )}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

// Card Content - Main body area with generous spacing
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'px-6 pb-6',
      'space-y-4', // Vertical rhythm for child elements
      className
    )}
    {...props}
  />
));
CardContent.displayName = 'CardContent';

// Card Footer - Actions area with proper alignment
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center gap-3',
      'px-6 pb-6',
      'flex-wrap', // Wrap on mobile for better touch targets
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Card Media - Image/video area with aspect ratio support
export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'video' | 'square';
  src?: string;
  alt?: string;
}

const CardMedia = React.forwardRef<HTMLDivElement, CardMediaProps>(
  ({ className, aspectRatio = '16/9', src, alt, children, ...props }, ref) => {
    const aspectRatioClasses = {
      '16/9': 'aspect-video',
      '4/3': 'aspect-[4/3]',
      '1/1': 'aspect-square',
      'video': 'aspect-video',
      'square': 'aspect-square',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden',
          'rounded-t-lg', // Match card border radius
          'bg-neutral-100 dark:bg-neutral-900',
          aspectRatioClasses[aspectRatio],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || ''}
            className="h-full w-full object-cover"
          />
        ) : (
          children
        )}
      </div>
    );
  }
);
CardMedia.displayName = 'CardMedia';

// Card Badge - Positioned status indicators
export interface CardBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'mandatory' | 'recommended' | 'optional' | 'match' | 'default';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const CardBadge = React.forwardRef<HTMLDivElement, CardBadgeProps>(
  ({ className, variant = 'default', position = 'top-right', children, ...props }, ref) => {
    const positionClasses = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4',
    };

    const variantClasses = {
      mandatory: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
      recommended: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
      optional: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
      match: 'bg-maroon-100 text-maroon-800 border-maroon-300 dark:bg-maroon-900/30 dark:text-maroon-300 dark:border-maroon-800',
      default: 'bg-neutral-100 text-neutral-800 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'absolute z-10',
          'inline-flex items-center justify-center',
          'rounded-full border',
          'px-3 py-1',
          'text-xs font-semibold uppercase tracking-wide',
          'shadow-sm',
          positionClasses[position],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardBadge.displayName = 'CardBadge';

// Loading skeleton component
export interface CardSkeletonProps {
  className?: string;
  showHeader?: boolean;
  showMedia?: boolean;
  showFooter?: boolean;
  lines?: number;
}

const CardSkeleton = React.forwardRef<HTMLDivElement, CardSkeletonProps>(
  ({ className, showHeader = true, showMedia = false, showFooter = true, lines = 3 }, ref) => {
    return (
      <Card ref={ref} loading className={className}>
        {showMedia && (
          <CardMedia className="bg-neutral-200 dark:bg-neutral-800" />
        )}

        {showHeader && (
          <CardHeader>
            <div className="h-6 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-4 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded" />
          </CardHeader>
        )}

        <CardContent>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-4 bg-neutral-200 dark:bg-neutral-800 rounded',
                i === lines - 1 && 'w-2/3'
              )}
            />
          ))}
        </CardContent>

        {showFooter && (
          <CardFooter>
            <div className="h-10 w-24 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-10 w-24 bg-neutral-200 dark:bg-neutral-800 rounded" />
          </CardFooter>
        )}
      </Card>
    );
  }
);
CardSkeleton.displayName = 'CardSkeleton';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardMedia,
  CardBadge,
  CardSkeleton,
};
