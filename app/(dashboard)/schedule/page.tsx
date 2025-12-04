'use client';

/**
 * Unified Schedule Page - Premium Calendar Experience
 * $100M redesign with week/day views, intuitive navigation, and gorgeous UI
 * Combines classes, availability, and blockers with premium athletic design
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WeekView, CalendarEvent } from '@/components/calendar/WeekView';
import { DayView } from '@/components/calendar/DayView';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { UnifiedAddItemDialog, ItemType } from '@/components/schedule/UnifiedAddItemDialog';
import { useUnifiedSchedule } from '@/lib/hooks/useUnifiedSchedule';
import { BRAND_COLORS } from '@/lib/constants';
import { Plus, GraduationCap, Clock, Ban, Trophy, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useToast } from '@/lib/hooks/use-toast';
import { addDays, addWeeks, subWeeks, startOfWeek } from 'date-fns';
import { colors } from '@/lib/design-tokens';

type ViewType = 'week' | 'day' | 'list';

export default function UnifiedSchedulePage() {
  const { toast } = useToast();
  const [selectedQuarter] = useState<'fall' | 'winter' | 'spring' | 'summer'>('fall');
  const [selectedYear] = useState<number>(2025);

  // View state
  const [view, setView] = useState<ViewType>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const {
    calendarEvents,
    loading,
    filter,
    setFilter,
    addMultiDayClass,
    addAvailabilityItem,
    addBlockerItem,
    deleteItem,
  } = useUnifiedSchedule({ quarter: selectedQuarter, year: selectedYear });

  // Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [initialDayOfWeek, setInitialDayOfWeek] = useState<number | undefined>();
  const [initialTime, setInitialTime] = useState<string>('09:00');
  const [initialType, setInitialType] = useState<ItemType>('class');

  // Navigation handlers
  const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentDate(new Date());
    } else if (view === 'week') {
      setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    } else if (view === 'day') {
      setCurrentDate(direction === 'next' ? addDays(currentDate, 1) : addDays(currentDate, -1));
    }
  };

  // Handle slot click (when user clicks empty calendar slot)
  const handleSlotClick = (dayOfWeek: number | undefined, hour: number) => {
    setInitialDayOfWeek(dayOfWeek);
    setInitialTime(`${hour.toString().padStart(2, '0')}:00`);
    setInitialType('class'); // Default to class
    setIsAddDialogOpen(true);
  };

  // Handle day view slot click
  const handleDaySlotClick = (hour: number) => {
    handleSlotClick(currentDate.getDay(), hour);
  };

  // Handle event click (when user clicks existing event)
  const handleEventClick = (event: CalendarEvent) => {
    // For now, just show info - could add edit/delete later
    const typeLabel = event.type.charAt(0).toUpperCase() + event.type.slice(1);
    toast({
      title: `${typeLabel}: ${event.title}`,
      description: `${event.startTime} - ${event.endTime}${event.location ? '\nLocation: ' + event.location : ''}`,
    });
  };

  // Handle save from unified dialog
  const handleSave = async (data: {
    type: ItemType;
    days?: number[];
    date?: string;
    dateRange?: { start: string; end: string };
    startTime: string;
    endTime: string;
    courseName?: string;
    location?: string;
    quarter?: string;
    reason?: string;
    notes?: string;
    isRecurring?: boolean;
  }) => {
    try {
      if (data.type === 'class' && data.days) {
        await addMultiDayClass({
          days: data.days,
          startTime: data.startTime,
          endTime: data.endTime,
          courseName: data.courseName,
          location: data.location,
        });

        toast({
          title: 'Classes added!',
          description: `Added ${data.days.length} class${data.days.length > 1 ? 'es' : ''} successfully`,
        });
      } else if (data.type === 'availability') {
        await addAvailabilityItem({
          date: data.date,
          dateRange: data.dateRange,
          startTime: data.startTime,
          endTime: data.endTime,
          notes: data.notes,
        });

        toast({
          title: 'Availability added!',
          description: 'Your availability has been saved',
        });
      } else if (data.type === 'blocker') {
        await addBlockerItem({
          isRecurring: data.isRecurring || false,
          days: data.days,
          date: data.date,
          dateRange: data.dateRange,
          startTime: data.startTime,
          endTime: data.endTime,
          reason: data.reason,
        });

        toast({
          title: 'Blocker added!',
          description: 'Time blocked successfully',
        });
      }
    } catch (error) {
      console.error('Failed to save:', error);
      toast({
        title: 'Failed to save',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
      throw error; // Re-throw so dialog knows it failed
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Schedule</h1>
          <p className="text-base sm:text-lg text-gray-600 mt-2">
            Your classes, availability, and commitments at a glance
          </p>
        </div>

        <Button
          onClick={() => {
            setInitialDayOfWeek(undefined);
            setInitialTime('09:00');
            setInitialType('class');
            setIsAddDialogOpen(true);
          }}
          style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
          className="text-white hover:opacity-90 shadow-md w-full sm:w-auto hidden sm:flex"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add to Schedule
        </Button>
      </div>

      {/* Calendar Navigation Header */}
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onNavigate={handleNavigate}
      />

      {/* Filter Pills & Legend */}
      <div className="flex flex-col gap-3">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              filter === 'all'
                ? 'text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            )}
            style={filter === 'all' ? { backgroundColor: BRAND_COLORS.PRIMARY } : undefined}
          >
            All Items
          </button>
          <button
            onClick={() => setFilter('class')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5',
              filter === 'class'
                ? 'text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            )}
            style={filter === 'class' ? { backgroundColor: BRAND_COLORS.PRIMARY } : undefined}
          >
            <GraduationCap className="h-4 w-4" />
            Classes
          </button>
          <button
            onClick={() => setFilter('availability')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5',
              filter === 'availability'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            )}
          >
            <Clock className="h-4 w-4" />
            Available
          </button>
          <button
            onClick={() => setFilter('blocker')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5',
              filter === 'blocker'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            )}
          >
            <Ban className="h-4 w-4" />
            Blockers
          </button>
          <button
            onClick={() => setFilter('event')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5',
              filter === 'event'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            Events
          </button>
        </div>

        {/* Compact Legend */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-600 px-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: BRAND_COLORS.PRIMARY }} />
            <span>Class</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-green-600" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-orange-600" />
            <span>Blocker</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-blue-600" />
            <span>Event</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-yellow-600" />
            <span>Conflict</span>
          </div>
        </div>
      </div>

      {/* Calendar Views */}
      <div className="h-[calc(100vh-400px)] sm:h-[calc(100vh-380px)] min-h-[500px]">
        {view === 'week' && (
          <WeekView
            events={calendarEvents}
            selectedDate={currentDate}
            onSlotClick={handleSlotClick}
            onEventClick={handleEventClick}
          />
        )}
        {view === 'day' && (
          <DayView
            date={currentDate}
            events={calendarEvents.filter(event => {
              // Filter to show only events for the current day
              if (!event.date) {
                return event.dayOfWeek === currentDate.getDay();
              }
              const eventDate = new Date(event.date);
              return eventDate.toDateString() === currentDate.toDateString();
            })}
            onSlotClick={handleDaySlotClick}
            onEventClick={handleEventClick}
          />
        )}
        {view === 'list' && (
          <div className="h-full bg-white rounded-xl border border-gray-200 p-6 overflow-y-auto">
            <p className="text-gray-500 text-center">List view coming soon...</p>
          </div>
        )}
      </div>

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-20 right-4 sm:hidden z-30">
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg"
          style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
          onClick={() => {
            setInitialDayOfWeek(undefined);
            setInitialTime('09:00');
            setInitialType('class');
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-6 w-6 text-white" />
          <span className="sr-only">Add to Schedule</span>
        </Button>
      </div>

      {/* Quick Tips */}
      <div className="rounded-xl p-4 sm:p-5 bg-info-50 border border-info-200">
        <h3 className="text-sm font-semibold mb-2 text-info-900">Quick Tips</h3>
        <ul className="text-sm space-y-1.5 text-info-800">
          <li>• Tap any time slot to add classes, availability, or blockers</li>
          <li>• Switch between Week and Day views for different perspectives</li>
          <li>• Yellow warning icons indicate scheduling conflicts</li>
          <li>• Use filter pills to focus on specific item types</li>
          <li>• Red line shows current time in real-time</li>
        </ul>
      </div>

      {/* Unified Add Dialog */}
      <UnifiedAddItemDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleSave}
        initialDayOfWeek={initialDayOfWeek}
        initialTime={initialTime}
        initialType={initialType}
      />
    </div>
  );
}
