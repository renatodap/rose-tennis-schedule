'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils/cn';

const textareaVariants = cva(
  'flex w-full rounded-md text-sm transition-all duration-200 placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 resize-none',
  {
    variants: {
      variant: {
        default: 'bg-white border border-neutral-300 focus:bg-neutral-50',
        filled: 'bg-neutral-100 border border-transparent focus:bg-neutral-200 focus:border-neutral-300',
        outlined: 'bg-transparent border-2 border-neutral-300 focus:bg-white',
      },
      state: {
        default: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon-700 focus-visible:ring-offset-2 focus-visible:border-maroon-700',
        error: 'border-error-500 focus-visible:ring-error-500 focus-visible:border-error-500',
        success: 'border-success-500 focus-visible:ring-success-500 focus-visible:border-success-500',
      },
    },
    defaultVariants: {
      variant: 'default',
      state: 'default',
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  autoResize?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      state,
      autoResize = false,
      showCharCount = false,
      maxLength,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const handleRef = React.useCallback(
      (element: HTMLTextAreaElement | null) => {
        textareaRef.current = element;
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      },
      [ref]
    );

    // Auto-resize functionality
    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [value, autoResize]);

    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            textareaVariants({ variant, state }),
            'min-h-[100px] px-4 py-3',
            showCharCount && 'pb-8',
            className
          )}
          ref={handleRef}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {showCharCount && (
          <div className="absolute bottom-2 right-3 text-xs text-neutral-400">
            {maxLength ? `${charCount} / ${maxLength}` : charCount}
          </div>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
