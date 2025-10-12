'use client';

/**
 * Integrated calendar view showing all schedule items:
 * - Classes (maroon)
 * - Recurring blockers (orange)
 * - One-time blockers (red)
 * - Practice availability (green)
 * - Team events (blue)
 */

import { useState, useEffect, useMemo } from 'react';
import { format, startOfWeek, addDays, parseISO, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAvailability } from '@/lib/hooks/useAvailability';
import { useBlockers } from '@/lib/hooks/useBlockers';
import { createClient } from '@/lib/supabase/client';
import { ClassSchedule, Event } from '@/lib/types/database.types';
import { ChevronLeft, ChevronRight, Loader2, Plus } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/hooks/useAuth';

interface AvailabilityCalendarProps {
  onAddAvailability?: (date: string) => void;
  onAddBlocker?: (date: string) => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'class' | 'recurring-blocker' | 'onetime-blocker' | 'availability' | 'event';
  color: string;
  description?: string;
}

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM to 9 PM
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function AvailabilityCalendar({
  onAddAvailability,
  onAddBlocker,
}: AvailabilityCalendarProps) {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; hour: number } | null>(null);

  const { user } = useAuth();
  const { availability } = useAvailability();
  const { recurringBlockers, oneTimeBlockers } = useBlockers();
  const supabase = createClient();

  // Fetch classes and events
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        // Fetch classes
        const { data: classData } = await supabase
          .from('class_schedules')
          .select('*')
          .eq('user_id', user.id);

        // Fetch events for the week
        const weekEnd = addDays(weekStart, 7);
        const { data: eventData } = await supabase
          .from('events')
          .select('*')
          .gte('start_datetime', weekStart.toISOString())
          .lt('start_datetime', weekEnd.toISOString());

        setClasses(classData || []);
        setEvents(eventData || []);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, weekStart]);

  // Generate calendar events for each day
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const getEventsForDay = (date: Date): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const dayOfWeek = date.getDay();

    // Classes
    classes
      .filter((cls) => cls.day_of_week === dayOfWeek)
      .forEach((cls) => {
        events.push({
          id: `class-${cls.id}`,
          title: cls.class_name || 'Class',
          startTime: cls.start_time,
          endTime: cls.end_time,
          type: 'class',
          color: BRAND_COLORS.PRIMARY,
          description: cls.location,
        });
      });

    // Recurring blockers
    recurringBlockers
      .filter((blocker) => blocker.day_of_week === dayOfWeek)
      .forEach((blocker) => {
        events.push({
          id: `recurring-${blocker.id}`,
          title: blocker.title,
          startTime: blocker.start_time,
          endTime: blocker.end_time,
          type: 'recurring-blocker',
          color: '#f97316', // orange
          description: blocker.description,
        });
      });

    // One-time blockers
    oneTimeBlockers
      .filter((blocker) => {
        const blockerDate = parseISO(blocker.start_datetime);
        return isSameDay(blockerDate, date);
      })
      .forEach((blocker) => {
        const start = parseISO(blocker.start_datetime);
        const end = parseISO(blocker.end_datetime);
        events.push({
          id: `onetime-${blocker.id}`,
          title: blocker.title,
          startTime: format(start, 'HH:mm'),
          endTime: format(end, 'HH:mm'),
          type: 'onetime-blocker',
          color: '#ef4444', // red
          description: blocker.description,
        });
      });

    // Availability
    availability
      .filter((avail) => isSameDay(parseISO(avail.date), date))
      .forEach((avail) => {
        events.push({
          id: `availability-${avail.id}`,
          title: 'Available',
          startTime: '00:00',
          endTime: '23:59',
          type: 'availability',
          color: '#22c55e', // green
          description: avail.notes,
        });
      });

    return events;
  };

  const handleSlotClick = (date: Date, hour: number) => {
    setSelectedSlot({ date, hour });
  };

  const handleAddAvailability = () => {
    if (selectedSlot && onAddAvailability) {
      onAddAvailability(format(selectedSlot.date, 'yyyy-MM-dd'));
    }
    setSelectedSlot(null);
  };

  const handleAddBlocker = () => {
    if (selectedSlot && onAddBlocker) {
      onAddBlocker(format(selectedSlot.date, 'yyyy-MM-dd'));
    }
    setSelectedSlot(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: BRAND_COLORS.PRIMARY }} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: BRAND_COLORS.PRIMARY }} />
          <span>Classes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500" />
          <span>Recurring Blockers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span>One-Time Blockers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500" />
          <span>Team Events</span>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setWeekStart(subWeeks(weekStart, 1))}>
          <ChevronLeft className="h-4 w-4" />
          Previous Week
        </Button>
        <h3 className="font-semibold text-gray-900">
          {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </h3>
        <Button variant="outline" size="sm" onClick={() => setWeekStart(addWeeks(weekStart, 1))}>
          Next Week
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="grid grid-cols-8 border-b">
                <div className="p-2 text-xs font-medium text-gray-500 border-r">Time</div>
                {weekDays.map((day, i) => (
                  <div key={i} className="p-2 text-center border-r last:border-r-0">
                    <div className="text-xs font-medium text-gray-500">{DAYS[day.getDay()]}</div>
                    <div className="text-sm font-semibold text-gray-900">{format(day, 'd')}</div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b last:border-b-0">
                  <div className="p-2 text-xs text-gray-500 border-r">
                    {format(new Date(2000, 0, 1, hour), 'h a')}
                  </div>
                  {weekDays.map((day, dayIdx) => {
                    const dayEvents = getEventsForDay(day);
                    const hourEvents = dayEvents.filter((event) => {
                      const [startHour] = event.startTime.split(':').map(Number);
                      const [endHour] = event.endTime.split(':').map(Number);
                      return hour >= startHour && hour < endHour;
                    });

                    return (
                      <div
                        key={dayIdx}
                        className="relative min-h-[60px] p-1 border-r last:border-r-0 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSlotClick(day, hour)}
                      >
                        <div className="space-y-1">
                          {hourEvents.map((event) => (
                            <div
                              key={event.id}
                              className="text-xs p-1 rounded text-white truncate"
                              style={{ backgroundColor: event.color }}
                              title={`${event.title}${event.description ? ` - ${event.description}` : ''}`}
                            >
                              {event.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Add Menu */}
      {selectedSlot && (
        <DropdownMenu open={!!selectedSlot} onOpenChange={(open) => !open && setSelectedSlot(null)}>
          <DropdownMenuTrigger asChild>
            <div />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleAddAvailability}>
              <Plus className="mr-2 h-4 w-4" />
              Add Availability
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAddBlocker}>
              <Plus className="mr-2 h-4 w-4" />
              Add Blocker
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
