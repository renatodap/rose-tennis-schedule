'use client';

/**
 * Event List Skeleton Component
 * Loading state with skeleton cards that match the actual event cards
 */

import { CardSkeleton } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

interface EventListSkeletonProps {
  count?: number;
  className?: string;
}

export function EventListSkeleton({ count = 3, className }: EventListSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton
          key={index}
          showHeader
          showFooter
          lines={2}
          className="animate-pulse"
        />
      ))}
    </div>
  );
}
