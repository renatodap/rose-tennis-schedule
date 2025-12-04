'use client';

/**
 * CalendarHeader - Premium navigation and view controls
 * Handles week/day/list view switching, date navigation, and quick actions
 */

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { colors, radius, shadows } from '@/lib/design-tokens';

type ViewType = 'week' | 'day' | 'list';

interface CalendarHeaderProps {
  currentDate: Date;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  onNavigate: (direction: 'prev' | 'next' | 'today') => void;
  showQuarterSelector?: boolean;
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onNavigate,
}: CalendarHeaderProps) {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = addDays(weekStart, 6);

  const getDateRangeDisplay = () => {
    switch (view) {
      case 'week':
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      case 'list':
        return format(currentDate, 'MMMM yyyy');
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
      {/* Date Range Display */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('prev')}
            className="h-9 w-9 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous {view}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('today')}
            className="h-9 px-3 font-medium"
          >
            <CalendarIcon className="h-4 w-4 mr-1.5" />
            Today
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('next')}
            className="h-9 w-9 p-0"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next {view}</span>
          </Button>
        </div>

        <div className="hidden sm:block h-6 w-px bg-gray-300" />

        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          {getDateRangeDisplay()}
        </h2>
      </div>

      {/* View Toggle */}
      <div
        className="flex gap-1 p-1 rounded-lg"
        style={{ backgroundColor: colors.neutral[100] }}
      >
        {(['week', 'day', 'list'] as ViewType[]).map((viewType) => (
          <button
            key={viewType}
            onClick={() => onViewChange(viewType)}
            className={`
              px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-all
              ${view === viewType
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
            style={view === viewType ? { boxShadow: shadows.sm } : undefined}
          >
            {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
