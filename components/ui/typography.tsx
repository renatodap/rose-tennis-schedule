/**
 * Typography Components
 *
 * Responsive typography components with consistent styling.
 * Uses mobile-first approach with fluid sizing.
 *
 * @example
 * ```tsx
 * <Heading level={1}>Page Title</Heading>
 * <Heading level={2}>Section Title</Heading>
 * <Text>Body text content</Text>
 * <Text size="sm" muted>Small muted text</Text>
 * ```
 */

import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/lib/constants';

/**
 * Heading Component
 */
interface HeadingProps {
  /** Heading level (1-4) */
  level: 1 | 2 | 3 | 4;
  /** Content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Semantic HTML element to render as */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
}

export function Heading({
  level,
  children,
  className,
  as
}: HeadingProps) {
  const Component = as || (`h${level}` as 'h1' | 'h2' | 'h3' | 'h4');

  const styles = {
    1: TYPOGRAPHY.h1,
    2: TYPOGRAPHY.h2,
    3: TYPOGRAPHY.h3,
    4: TYPOGRAPHY.h4
  };

  return (
    <Component
      className={cn(
        styles[level],
        'tracking-tight text-foreground',
        className
      )}
    >
      {children}
    </Component>
  );
}

/**
 * Text Component
 */
interface TextProps {
  /** Size variant */
  size?: 'tiny' | 'small' | 'body' | 'large';
  /** Weight variant */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /** Muted color */
  muted?: boolean;
  /** Center align */
  align?: 'left' | 'center' | 'right';
  /** Content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** HTML element to render as */
  as?: 'p' | 'span' | 'div' | 'label';
}

export function Text({
  size = 'body',
  weight = 'normal',
  muted = false,
  align = 'left',
  children,
  className,
  as: Component = 'p'
}: TextProps) {
  const sizeClasses = {
    tiny: TYPOGRAPHY.tiny,
    small: TYPOGRAPHY.small,
    body: TYPOGRAPHY.body,
    large: 'text-base sm:text-lg'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <Component
      className={cn(
        sizeClasses[size],
        weightClasses[weight],
        alignClasses[align],
        muted ? 'text-muted-foreground' : 'text-foreground',
        className
      )}
    >
      {children}
    </Component>
  );
}

/**
 * Label Component (for form labels)
 */
interface LabelProps {
  /** Label text */
  children: React.ReactNode;
  /** Associated input ID */
  htmlFor?: string;
  /** Required indicator */
  required?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function Label({
  children,
  htmlFor,
  required = false,
  className
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
    >
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

/**
 * Code Component (for inline code)
 */
interface CodeProps {
  children: React.ReactNode;
  className?: string;
}

export function Code({ children, className }: CodeProps) {
  return (
    <code
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',
        className
      )}
    >
      {children}
    </code>
  );
}

/**
 * Pre Component (for code blocks)
 */
interface PreProps {
  children: React.ReactNode;
  className?: string;
}

export function Pre({ children, className }: PreProps) {
  return (
    <pre
      className={cn(
        'overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm',
        className
      )}
    >
      {children}
    </pre>
  );
}

/**
 * Quote Component (for blockquotes)
 */
interface QuoteProps {
  children: React.ReactNode;
  cite?: string;
  className?: string;
}

export function Quote({ children, cite, className }: QuoteProps) {
  return (
    <blockquote
      className={cn(
        'border-l-4 border-primary pl-4 italic text-muted-foreground',
        className
      )}
    >
      {children}
      {cite && (
        <footer className="mt-2 text-sm not-italic">
          — <cite>{cite}</cite>
        </footer>
      )}
    </blockquote>
  );
}

/**
 * List Component (for unordered/ordered lists)
 */
interface ListProps {
  /** List items */
  children: React.ReactNode;
  /** Ordered or unordered */
  ordered?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function List({ children, ordered = false, className }: ListProps) {
  const Component = ordered ? 'ol' : 'ul';

  return (
    <Component
      className={cn(
        'ml-6 space-y-2',
        ordered ? 'list-decimal' : 'list-disc',
        className
      )}
    >
      {children}
    </Component>
  );
}

/**
 * ListItem Component
 */
interface ListItemProps {
  children: React.ReactNode;
  className?: string;
}

export function ListItem({ children, className }: ListItemProps) {
  return (
    <li className={cn('text-sm sm:text-base', className)}>
      {children}
    </li>
  );
}

/**
 * Lead Text (intro paragraph)
 */
interface LeadProps {
  children: React.ReactNode;
  className?: string;
}

export function Lead({ children, className }: LeadProps) {
  return (
    <p
      className={cn(
        'text-lg sm:text-xl text-muted-foreground',
        className
      )}
    >
      {children}
    </p>
  );
}

/**
 * Muted Text (helper text, captions)
 */
interface MutedProps {
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

export function Muted({ children, className, as: Component = 'p' }: MutedProps) {
  return (
    <Component className={cn('text-xs sm:text-sm text-muted-foreground', className)}>
      {children}
    </Component>
  );
}

/**
 * Display Text (large marketing/hero text)
 */
interface DisplayProps {
  children: React.ReactNode;
  className?: string;
}

export function Display({ children, className }: DisplayProps) {
  return (
    <h1
      className={cn(
        'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
        className
      )}
    >
      {children}
    </h1>
  );
}
