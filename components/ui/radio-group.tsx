'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils/cn';

const radioGroupVariants = cva('grid gap-3', {
  variants: {
    variant: {
      default: 'gap-3',
      cards: 'gap-2',
    },
    layout: {
      vertical: 'grid-cols-1',
      horizontal: 'grid-flow-col auto-cols-fr',
    },
  },
  defaultVariants: {
    variant: 'default',
    layout: 'vertical',
  },
});

interface RadioGroupProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>, 'orientation'>,
    VariantProps<typeof radioGroupVariants> {}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, variant, layout, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(radioGroupVariants({ variant, layout }), className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const radioItemVariants = cva(
  'aspect-square rounded-full border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-maroon-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        default: 'h-6 w-6',  // 24px - touch-friendly
        lg: 'h-7 w-7',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioItemVariants> {}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, size, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        radioItemVariants({ size }),
        'border-neutral-400 text-maroon-700 hover:border-maroon-700 data-[state=checked]:border-maroon-700 data-[state=checked]:bg-maroon-700',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 25,
          }}
        >
          <Circle
            className={cn(
              'fill-white text-white',
              size === 'sm' ? 'h-2 w-2' : size === 'lg' ? 'h-3.5 w-3.5' : 'h-3 w-3'
            )}
          />
        </motion.div>
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

// Card-style Radio for RSVP-like selections
interface RadioCardProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'children'> {
  icon?: React.ReactNode;
  label: string;
  description?: string;
}

const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioCardProps
>(({ className, icon, label, description, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'group relative flex items-center gap-4 rounded-lg border-2 border-neutral-300 bg-white px-5 py-4 transition-all duration-200 hover:border-maroon-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-maroon-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-maroon-700 data-[state=checked]:bg-maroon-50 data-[state=checked]:shadow-sm cursor-pointer min-h-[60px]',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="absolute left-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 25,
          }}
          className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-maroon-700 bg-maroon-700"
        >
          <Circle className="h-3 w-3 fill-white text-white" />
        </motion.div>
      </RadioGroupPrimitive.Indicator>

      <div className="h-6 w-6 flex-shrink-0" /> {/* Spacer for indicator */}

      {icon && (
        <div className="flex-shrink-0 text-neutral-600 group-data-[state=checked]:text-maroon-700 transition-colors">
          {icon}
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        <div className="text-sm font-semibold text-neutral-900 group-data-[state=checked]:text-maroon-900">
          {label}
        </div>
        {description && (
          <div className="text-xs text-neutral-500 group-data-[state=checked]:text-maroon-700">
            {description}
          </div>
        )}
      </div>
    </RadioGroupPrimitive.Item>
  );
});
RadioCard.displayName = 'RadioCard';

// Radio with Label wrapper for convenience
interface RadioWithLabelProps extends RadioGroupItemProps {
  label: string;
  description?: string;
  id?: string;
}

const RadioWithLabel = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioWithLabelProps
>(({ label, description, id, className, size, ...props }, ref) => {
  const generatedId = React.useId();
  const radioId = id || generatedId;

  return (
    <div className="flex items-start gap-3">
      <RadioGroupItem ref={ref} id={radioId} size={size} className={className} {...props} />
      <div className="flex flex-col gap-1">
        <label
          htmlFor={radioId}
          className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-neutral-500">{description}</p>
        )}
      </div>
    </div>
  );
});
RadioWithLabel.displayName = 'RadioWithLabel';

export {
  RadioGroup,
  RadioGroupItem,
  RadioCard,
  RadioWithLabel,
  radioGroupVariants,
  radioItemVariants,
};
