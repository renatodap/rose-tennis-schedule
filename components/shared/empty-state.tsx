/**
 * EmptyState - Friendly empty state component
 *
 * Displays helpful guidance when there's no data to show.
 * Includes icon, title, description, and optional action button.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={Calendar}
 *   title="No events scheduled"
 *   description="Create your first event to get started"
 *   action={
 *     <Button onClick={handleCreate}>
 *       <Plus className="mr-2 h-4 w-4" />
 *       Create Event
 *     </Button>
 *   }
 * />
 * ```
 */

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  /**
   * Icon to display (Lucide icon component)
   */
  icon: LucideIcon;

  /**
   * Primary heading text
   */
  title: string;

  /**
   * Optional description text (can be React node for links)
   */
  description?: React.ReactNode;

  /**
   * Optional action button or element
   */
  action?: React.ReactNode;

  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Size mappings for responsive design
 */
const sizes = {
  sm: {
    container: 'py-6',
    icon: 'h-8 w-8',
    title: 'text-base',
    description: 'text-xs',
    spacing: 'mt-2 space-y-1'
  },
  md: {
    container: 'py-12',
    icon: 'h-12 w-12',
    title: 'text-lg',
    description: 'text-sm',
    spacing: 'mt-4 space-y-2'
  },
  lg: {
    container: 'py-16',
    icon: 'h-16 w-16',
    title: 'text-xl',
    description: 'text-base',
    spacing: 'mt-6 space-y-3'
  }
} as const;

/**
 * EmptyState Component
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  size = 'md',
  className
}: EmptyStateProps) {
  const sizeClasses = sizes[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizeClasses.container,
        className
      )}
      role="status"
    >
      {/* Icon */}
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-muted p-3',
          size === 'sm' && 'p-2',
          size === 'lg' && 'p-4'
        )}
      >
        <Icon
          className={cn(sizeClasses.icon, 'text-muted-foreground')}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className={sizeClasses.spacing}>
        <h3
          className={cn(
            'font-semibold tracking-tight',
            sizeClasses.title
          )}
        >
          {title}
        </h3>

        {description && (
          <p
            className={cn(
              'text-muted-foreground',
              sizeClasses.description
            )}
          >
            {description}
          </p>
        )}
      </div>

      {/* Action */}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}

/**
 * Pre-configured empty states for common scenarios
 */

EmptyState.NoResults = function NoResults({
  searchTerm,
  onClear
}: {
  searchTerm?: string;
  onClear?: () => void;
}) {
  const { Search } = require('lucide-react');
  const { Button } = require('@/components/ui/button');

  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description={
        searchTerm
          ? `No results found for "${searchTerm}"`
          : 'Try adjusting your search or filters'
      }
      action={
        onClear && (
          <Button variant="outline" onClick={onClear}>
            Clear filters
          </Button>
        )
      }
    />
  );
};

EmptyState.NoData = function NoData({
  resourceName = 'items',
  onCreate
}: {
  resourceName?: string;
  onCreate?: () => void;
}) {
  const { FileQuestion } = require('lucide-react');
  const { Button } = require('@/components/ui/button');
  const { Plus } = require('lucide-react');

  return (
    <EmptyState
      icon={FileQuestion}
      title={`No ${resourceName} yet`}
      description={`Get started by creating your first ${resourceName}`}
      action={
        onCreate && (
          <Button onClick={onCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create {resourceName}
          </Button>
        )
      }
    />
  );
};

EmptyState.Error = function ErrorState({
  onRetry
}: {
  onRetry?: () => void;
}) {
  const { AlertCircle } = require('lucide-react');
  const { Button } = require('@/components/ui/button');
  const { RefreshCw } = require('lucide-react');

  return (
    <EmptyState
      icon={AlertCircle}
      title="Something went wrong"
      description="We couldn't load this content. Please try again."
      action={
        onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        )
      }
    />
  );
};

EmptyState.ComingSoon = function ComingSoon({
  feature
}: {
  feature: string;
}) {
  const { Sparkles } = require('lucide-react');

  return (
    <EmptyState
      icon={Sparkles}
      title="Coming Soon"
      description={`${feature} is currently under development. Check back soon!`}
      size="lg"
    />
  );
};
