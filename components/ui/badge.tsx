import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-semibold transition-all duration-200 ease-athletic focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        // New semantic variants
        default: '',
        primary: '',
        success: '',
        warning: '',
        danger: '',
        info: '',
        // Legacy variants for backward compatibility
        secondary: '',
        destructive: '',
        outline: '',
      },
      badgeStyle: {
        solid: '',
        soft: '',
        outline: '',
        dot: '',
      },
      size: {
        xs: 'text-[10px] leading-tight px-1.5 py-0.5 rounded-sm gap-0.5',
        sm: 'text-xs px-2 py-0.5 rounded',
        default: 'text-sm px-2.5 py-1 rounded-md',
        lg: 'text-base px-3 py-1.5 rounded-lg',
      },
    },
    compoundVariants: [
      // Default variant styles
      {
        variant: 'default',
        badgeStyle: 'solid',
        className: 'bg-neutral-600 text-white hover:bg-neutral-700',
      },
      {
        variant: 'default',
        badgeStyle: 'soft',
        className: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
      },
      {
        variant: 'default',
        badgeStyle: 'outline',
        className: 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50',
      },
      {
        variant: 'default',
        badgeStyle: 'dot',
        className: 'text-neutral-700',
      },

      // Primary (Maroon) variant styles
      {
        variant: 'primary',
        badgeStyle: 'solid',
        className: 'bg-maroon-700 text-white hover:bg-maroon-800 shadow-sm',
      },
      {
        variant: 'primary',
        badgeStyle: 'soft',
        className: 'bg-maroon-50 text-maroon-800 hover:bg-maroon-100',
      },
      {
        variant: 'primary',
        badgeStyle: 'outline',
        className: 'border border-maroon-600 text-maroon-700 hover:bg-maroon-50',
      },
      {
        variant: 'primary',
        badgeStyle: 'dot',
        className: 'text-maroon-700',
      },

      // Success variant styles
      {
        variant: 'success',
        badgeStyle: 'solid',
        className: 'bg-green-600 text-white hover:bg-green-700 shadow-sm',
      },
      {
        variant: 'success',
        badgeStyle: 'soft',
        className: 'bg-green-50 text-green-700 hover:bg-green-100',
      },
      {
        variant: 'success',
        badgeStyle: 'outline',
        className: 'border border-green-600 text-green-700 hover:bg-green-50',
      },
      {
        variant: 'success',
        badgeStyle: 'dot',
        className: 'text-green-700',
      },

      // Warning variant styles
      {
        variant: 'warning',
        badgeStyle: 'solid',
        className: 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm',
      },
      {
        variant: 'warning',
        badgeStyle: 'soft',
        className: 'bg-amber-50 text-amber-700 hover:bg-amber-100',
      },
      {
        variant: 'warning',
        badgeStyle: 'outline',
        className: 'border border-amber-500 text-amber-700 hover:bg-amber-50',
      },
      {
        variant: 'warning',
        badgeStyle: 'dot',
        className: 'text-amber-700',
      },

      // Danger variant styles
      {
        variant: 'danger',
        badgeStyle: 'solid',
        className: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
      },
      {
        variant: 'danger',
        badgeStyle: 'soft',
        className: 'bg-red-50 text-red-700 hover:bg-red-100',
      },
      {
        variant: 'danger',
        badgeStyle: 'outline',
        className: 'border border-red-600 text-red-700 hover:bg-red-50',
      },
      {
        variant: 'danger',
        badgeStyle: 'dot',
        className: 'text-red-700',
      },

      // Info variant styles
      {
        variant: 'info',
        badgeStyle: 'solid',
        className: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
      },
      {
        variant: 'info',
        badgeStyle: 'soft',
        className: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
      },
      {
        variant: 'info',
        badgeStyle: 'outline',
        className: 'border border-blue-600 text-blue-700 hover:bg-blue-50',
      },
      {
        variant: 'info',
        badgeStyle: 'dot',
        className: 'text-blue-700',
      },

      // Legacy variant support (backward compatibility)
      // 'secondary' maps to default soft
      {
        variant: 'secondary',
        className: 'bg-gray-200 text-gray-900 hover:bg-gray-300 border-transparent px-2.5 py-0.5 rounded-full text-xs',
      },
      // 'destructive' maps to danger solid
      {
        variant: 'destructive',
        className: 'bg-red-500 text-white hover:bg-red-600 border-transparent px-2.5 py-0.5 rounded-full text-xs',
      },
      // 'outline' as variant (legacy) maps to default outline style
      {
        variant: 'outline',
        className: 'text-gray-900 border border-gray-300 hover:bg-gray-50 px-2.5 py-0.5 rounded-full text-xs',
      },
    ],
    defaultVariants: {
      variant: 'default',
      badgeStyle: 'solid',
      size: 'default',
    },
  }
);

const dotVariants = cva('rounded-full', {
  variants: {
    variant: {
      default: 'bg-neutral-600',
      primary: 'bg-maroon-700',
      success: 'bg-green-600',
      warning: 'bg-amber-500',
      danger: 'bg-red-600',
      info: 'bg-blue-600',
      // Legacy support
      secondary: 'bg-gray-400',
      destructive: 'bg-red-500',
      outline: 'bg-gray-600',
    },
    size: {
      xs: 'w-1 h-1',
      sm: 'w-1.5 h-1.5',
      default: 'w-2 h-2',
      lg: 'w-2.5 h-2.5',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Icon element to display before the badge text */
  icon?: React.ReactNode;
  /** Show a remove button (for tags) */
  removable?: boolean;
  /** Callback when remove button is clicked */
  onRemove?: () => void;
  /** Pulse animation for attention */
  pulse?: boolean;
}

function Badge({
  className,
  variant,
  badgeStyle,
  size,
  icon,
  removable,
  onRemove,
  pulse,
  children,
  ...props
}: BadgeProps) {
  // For backward compatibility: if variant is a legacy variant, don't apply badgeStyle
  const isLegacyVariant = variant === 'secondary' || variant === 'destructive' || variant === 'outline';
  const effectiveStyle = isLegacyVariant ? undefined : badgeStyle;
  const showDot = effectiveStyle === 'dot';

  return (
    <div
      className={cn(
        badgeVariants({ variant, badgeStyle: effectiveStyle, size }),
        pulse && 'animate-pulse',
        className
      )}
      {...props}
    >
      {showDot && (
        <span className={cn(dotVariants({ variant, size }))} aria-hidden="true" />
      )}
      {icon && !showDot && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className={cn(
            'inline-flex items-center justify-center rounded-full hover:bg-black/10 transition-colors',
            size === 'xs' && 'w-3 h-3',
            size === 'sm' && 'w-3.5 h-3.5',
            size === 'default' && 'w-4 h-4',
            size === 'lg' && 'w-5 h-5'
          )}
          aria-label="Remove"
        >
          <X
            className={cn(
              size === 'xs' && 'w-2 h-2',
              size === 'sm' && 'w-2.5 h-2.5',
              size === 'default' && 'w-3 h-3',
              size === 'lg' && 'w-3.5 h-3.5'
            )}
          />
        </button>
      )}
    </div>
  );
}

export { Badge, badgeVariants };
