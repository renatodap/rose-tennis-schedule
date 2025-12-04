'use client';

/**
 * Event Filters Component
 * Filter tabs for Events page: All, Upcoming, Past, Needs RSVP
 * Mobile-optimized with sticky positioning
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Calendar, Clock, AlertCircle, List } from 'lucide-react';

export type EventFilter = 'all' | 'upcoming' | 'past' | 'needs-rsvp';

interface FilterCounts {
  all: number;
  upcoming: number;
  past: number;
  needsRsvp: number;
}

interface EventFiltersProps {
  activeFilter: EventFilter;
  onFilterChange: (filter: EventFilter) => void;
  counts?: FilterCounts;
  className?: string;
}

const filters: Array<{
  id: EventFilter;
  label: string;
  icon: React.ElementType;
  color: string;
}> = [
  {
    id: 'all',
    label: 'All',
    icon: List,
    color: 'text-neutral-700',
  },
  {
    id: 'upcoming',
    label: 'Upcoming',
    icon: Calendar,
    color: 'text-blue-600',
  },
  {
    id: 'past',
    label: 'Past',
    icon: Clock,
    color: 'text-neutral-500',
  },
  {
    id: 'needs-rsvp',
    label: 'Needs RSVP',
    icon: AlertCircle,
    color: 'text-red-600',
  },
];

export function EventFilters({
  activeFilter,
  onFilterChange,
  counts,
  className,
}: EventFiltersProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Desktop: Horizontal tabs */}
      <div className="hidden md:flex gap-2 p-1 bg-neutral-100 rounded-lg">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          const Icon = filter.icon;
          const countKey = filter.id === 'needs-rsvp' ? 'needsRsvp' : filter.id;
          const count = counts?.[countKey as keyof FilterCounts];

          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2.5 rounded-md',
                'text-sm font-semibold transition-all duration-200',
                'hover:bg-white/60',
                isActive
                  ? 'text-maroon-700 bg-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-maroon-700' : filter.color)} />
              <span>{filter.label}</span>
              {count !== undefined && count > 0 && (
                <span
                  className={cn(
                    'ml-1 px-2 py-0.5 text-xs font-bold rounded-full',
                    isActive
                      ? 'bg-maroon-700 text-white'
                      : 'bg-neutral-200 text-neutral-700'
                  )}
                >
                  {count}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeFilterIndicator"
                  className="absolute inset-0 bg-white rounded-md shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile: Scrollable chips */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          const Icon = filter.icon;
          const countKey = filter.id === 'needs-rsvp' ? 'needsRsvp' : filter.id;
          const count = counts?.[countKey as keyof FilterCounts];

          return (
            <motion.button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap snap-start',
                'text-sm font-semibold transition-all duration-200 shrink-0',
                'active:scale-95',
                isActive
                  ? 'bg-maroon-700 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              )}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Icon className="h-4 w-4" />
              <span>{filter.label}</span>
              {count !== undefined && count > 0 && (
                <span
                  className={cn(
                    'ml-0.5 px-1.5 py-0.5 text-xs font-bold rounded-full',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-neutral-200 text-neutral-700'
                  )}
                >
                  {count}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
