'use client';

/**
 * WeekView component - Premium week calendar view
 * Mobile-first design with smooth scrolling, current time indicator, and conflict detection
 * Redesigned for $100M athletic calendar experience
 */

import { cn } from '@/lib/utils/cn';
import { parseISO, isSameDay, startOfWeek, addDays, format, isToday } from 'date-fns';
import { TimeBlock } from './TimeBlock';
import { CurrentTimeIndicator } from './CurrentTimeIndicator';
import { colors } from '@/lib/design-tokens';

export interface CalendarEvent {
  id: string;
  title: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  date?: string; // YYYY-MM-DD for one-time events (events/matches)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  type: 'class' | 'blocker' | 'availability' | 'event' | 'match';
  location?: string;
  rsvpStatus?: 'going' | 'not_going' | 'maybe' | 'no_response'; // For events
  opponent?: string; // For matches
  homeAway?: 'home' | 'away' | 'neutral'; // For matches
}

interface WeekViewProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onSlotClick?: (dayOfWeek: number, hour: number) => void;
  onEventClick?: (event: CalendarEvent) => void;
  showLegend?: boolean;
}

const START_HOUR = 6;  // 6 AM
const END_HOUR = 22;   // 10 PM
const HOUR_HEIGHT = 80; // Height of each hour slot in pixels
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour > 12) return `${hour - 12} PM`;
  return `${hour} AM`;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Check if two events overlap in time
 */
function eventsOverlap(event1: CalendarEvent, event2: CalendarEvent): boolean {
  if (event1.dayOfWeek !== event2.dayOfWeek) return false;

  const start1 = timeToMinutes(event1.startTime);
  const end1 = timeToMinutes(event1.endTime);
  const start2 = timeToMinutes(event2.startTime);
  const end2 = timeToMinutes(event2.endTime);

  return start1 < end2 && end1 > start2;
}

/**
 * Detect conflicts for a given event
 */
function hasConflict(event: CalendarEvent, allEvents: CalendarEvent[]): boolean {
  return allEvents.some(other => other.id !== event.id && eventsOverlap(event, other));
}

export function WeekView({ events, selectedDate, onSlotClick, onEventClick }: WeekViewProps) {
  const weekStart = startOfWeek(selectedDate);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Sync header scroll with content scroll
    const headerScroll = e.currentTarget.previousElementSibling?.querySelector('.day-headers-scroll') as HTMLDivElement;
    if (headerScroll) {
      headerScroll.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Days header - sticky */}
      <div className="flex border-b border-gray-200 sticky top-0 z-20 flex-shrink-0" style={{ backgroundColor: colors.neutral[50] }}>
        {/* Time column header */}
        <div className="w-16 sm:w-20 flex-shrink-0 border-r border-gray-200 p-2">
          <span className="text-xs font-medium text-gray-500">Time</span>
        </div>

        {/* Day headers - scrollable to match columns below */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide day-headers-scroll">
          <div className="flex min-w-max">
            {DAYS.map((day, index) => {
              const currentDay = addDays(weekStart, index);
              const isCurrentDay = isToday(currentDay);

              return (
                <div
                  key={day}
                  className={cn(
                    "w-[140px] sm:w-[160px] flex-shrink-0 p-3 border-r border-gray-200 last:border-r-0 transition-colors",
                    isCurrentDay && "bg-maroon-50"
                  )}
                >
                  <div className="text-center">
                    <div className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      {day}
                    </div>
                    <div
                      className={cn(
                        "text-lg sm:text-xl font-semibold mx-auto w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full",
                        isCurrentDay
                          ? "bg-maroon-700 text-white"
                          : "text-gray-900"
                      )}
                    >
                      {format(currentDay, 'd')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time slots with horizontal scroll */}
      <div className="flex-1 overflow-auto relative" onScroll={handleScroll}>
        <div className="flex min-w-max relative">
          {/* Time labels column */}
          <div className="w-16 sm:w-20 flex-shrink-0 border-r border-gray-200" style={{ backgroundColor: colors.neutral[50] }}>
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="border-b border-gray-200 px-2 py-1 text-xs font-medium text-gray-500 text-right"
                style={{ height: `${HOUR_HEIGHT}px` }}
              >
                {formatHour(hour)}
              </div>
            ))}
          </div>

          {/* Days columns - Container for current time indicator */}
          <div className="flex flex-1 relative">
            {/* Current time indicator */}
            <CurrentTimeIndicator
              startHour={START_HOUR}
              endHour={END_HOUR}
              hourHeight={HOUR_HEIGHT}
            />

            {DAYS.map((_, dayIndex) => {
              const currentDay = addDays(weekStart, dayIndex);
              const isCurrentDay = isToday(currentDay);

              return (
                <div
                  key={dayIndex}
                  className={cn(
                    "w-[140px] sm:w-[160px] flex-shrink-0 border-r border-gray-200 last:border-r-0",
                    isCurrentDay && "bg-maroon-50/30"
                  )}
                >
                  {HOURS.map((hour) => {
                    const dayEvents = events.filter((event) => {
                      // For recurring items (classes, recurring blockers) - match by day of week
                      if (!event.date) {
                        return event.dayOfWeek === dayIndex;
                      }

                      // For one-time items (events, matches) - match by exact date
                      const eventDate = parseISO(event.date);
                      return isSameDay(eventDate, currentDay);
                    });

                    return (
                      <div
                        key={`${dayIndex}-${hour}`}
                        className={cn(
                          'relative border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors',
                          onSlotClick && 'active:bg-gray-100'
                        )}
                        style={{ height: `${HOUR_HEIGHT}px` }}
                        onClick={() => onSlotClick?.(dayIndex, hour)}
                      >
                        {/* Events that fall within this hour */}
                        {dayEvents
                          .filter((event) => {
                            const eventStart = timeToMinutes(event.startTime);
                            const eventEnd = timeToMinutes(event.endTime);
                            const hourStart = hour * 60;
                            const hourEnd = (hour + 1) * 60;
                            return eventStart < hourEnd && eventEnd > hourStart;
                          })
                          .map((event) => {
                            const eventStart = timeToMinutes(event.startTime);
                            const eventEnd = timeToMinutes(event.endTime);
                            const hourStart = hour * 60;
                            const hourEnd = (hour + 1) * 60;

                            // Calculate position and height
                            const top = Math.max(0, ((eventStart - hourStart) / 60) * 100);
                            const bottom = Math.max(0, ((hourEnd - eventEnd) / 60) * 100);

                            const hasOverlap = hasConflict(event, events);

                            return (
                              <div
                                key={event.id}
                                className="absolute inset-x-0 px-1.5 cursor-pointer z-10"
                                style={{
                                  top: `${top}%`,
                                  bottom: `${bottom}%`,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEventClick?.(event);
                                }}
                              >
                                <TimeBlock
                                  type={event.type}
                                  title={event.title}
                                  startTime={event.startTime}
                                  endTime={event.endTime}
                                  location={event.location}
                                  rsvpStatus={event.rsvpStatus}
                                  homeAway={event.homeAway}
                                  opponent={event.opponent}
                                  hasConflict={hasOverlap}
                                  compact={false}
                                />
                              </div>
                            );
                          })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
