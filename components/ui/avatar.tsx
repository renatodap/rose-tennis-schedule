'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils/cn';

const avatarVariants = cva(
  'relative inline-flex shrink-0 overflow-hidden rounded-full transition-all duration-200 ease-athletic',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-[10px]',
        sm: 'h-8 w-8 text-xs',
        default: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg',
        '2xl': 'h-24 w-24 text-2xl',
      },
      ring: {
        none: '',
        default: 'ring-2 ring-white shadow-sm',
        primary: 'ring-2 ring-maroon-500 shadow-md',
        success: 'ring-2 ring-green-500 shadow-md',
        warning: 'ring-2 ring-amber-500 shadow-md',
        danger: 'ring-2 ring-red-500 shadow-md',
      },
    },
    defaultVariants: {
      size: 'default',
      ring: 'none',
    },
  }
);

const statusDotVariants = cva(
  'absolute bottom-0 right-0 rounded-full ring-2 ring-white',
  {
    variants: {
      status: {
        online: 'bg-green-500',
        away: 'bg-amber-500',
        busy: 'bg-red-500',
        offline: 'bg-neutral-400',
      },
      size: {
        xs: 'w-1.5 h-1.5',
        sm: 'w-2 h-2',
        default: 'w-2.5 h-2.5',
        lg: 'w-3 h-3',
        xl: 'w-4 h-4',
        '2xl': 'w-5 h-5',
      },
    },
    defaultVariants: {
      status: 'online',
      size: 'default',
    },
  }
);

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  /** Online status indicator */
  status?: 'online' | 'away' | 'busy' | 'offline';
  /** Enable hover scale effect */
  hover?: boolean;
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, ring, status, hover, children, ...props }, ref) => {
  return (
    <div className="relative inline-flex">
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          avatarVariants({ size, ring }),
          hover && 'hover:scale-105 cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </AvatarPrimitive.Root>
      {status && (
        <span
          className={cn(statusDotVariants({ status, size }))}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
});
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full object-cover', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-neutral-100 text-neutral-700 font-semibold select-none',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback, avatarVariants };
