'use client';

/**
 * Unified Schedule Page
 * Combines classes, availability, and blockers into one intuitive interface
 * Multi-day selection, conflict detection, and easy management
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WeekView, CalendarEvent } from '@/components/calendar/WeekView';
import { UnifiedAddItemDialog, ItemType } from '@/components/schedule/UnifiedAddItemDialog';
import { useUnifiedSchedule } from '@/lib/hooks/useUnifiedSchedule';
import { BRAND_COLORS } from '@/lib/constants';
import { Plus, Calendar, Filter } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useToast } from '@/lib/hooks/use-toast';

export default function UnifiedSchedulePage() {
  const { toast } = useToast();
  const [selectedQuarter] = useState<'fall' | 'winter' | 'spring' | 'summer'>('fall');
  const [selectedYear] = useState<number>(2025);

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

  // Handle slot click (when user clicks empty calendar slot)
  const handleSlotClick = (dayOfWeek: number, hour: number) => {
    setInitialDayOfWeek(dayOfWeek);
    setInitialTime(`${hour.toString().padStart(2, '0')}:00`);
    setInitialType('class'); // Default to class
    setIsAddDialogOpen(true);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            View classes, team events, availability, and blockers in one place
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
          className="text-white hover:opacity-90 shadow-md w-full sm:w-auto"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add to Schedule
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            filter === 'all'
              ? 'text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          )}
          style={filter === 'all' ? { backgroundColor: BRAND_COLORS.PRIMARY } : undefined}
        >
          <Calendar className="h-4 w-4 inline mr-1.5" />
          All
        </button>
        <button
          onClick={() => setFilter('class')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            filter === 'class'
              ? 'text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          )}
          style={filter === 'class' ? { backgroundColor: BRAND_COLORS.PRIMARY } : undefined}
        >
          Classes
        </button>
        <button
          onClick={() => setFilter('event')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            filter === 'event'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          )}
        >
          Team Events
        </button>
        <button
          onClick={() => setFilter('availability')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            filter === 'availability'
              ? 'bg-green-600 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          )}
        >
          Available
        </button>
        <button
          onClick={() => setFilter('blocker')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            filter === 'blocker'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          )}
        >
          Blockers
        </button>
        <div className="ml-auto text-sm text-gray-600 flex items-center gap-1.5">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filter:</span>
          <span className="font-medium capitalize">{filter === 'event' ? 'Team Events' : filter}</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="h-[calc(100vh-320px)] min-h-[600px]">
        <WeekView
          events={calendarEvents}
          selectedDate={new Date()}
          onSlotClick={handleSlotClick}
          onEventClick={handleEventClick}
          showLegend={true}
        />
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

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Quick Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click any time slot to quickly add a class, availability, or blocker</li>
          <li>• Select multiple days at once when adding classes (e.g., MWF)</li>
          <li>• Yellow warning icons indicate scheduling conflicts</li>
          <li>• Use filters to focus on specific types of schedule items</li>
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
