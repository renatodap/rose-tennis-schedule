'use client';

/**
 * DayView component - Premium single-day calendar view
 * Large, detailed view with hour-by-hour grid and swipe gestures
 * Redesigned for $100M athletic calendar experience
 */

import { cn } from '@/lib/utils/cn';
import { format } from 'date-fns';
import { TimeBlock } from './TimeBlock';
import { CurrentTimeIndicator } from './CurrentTimeIndicator';
import { colors } from '@/lib/design-tokens';

import type { CalendarEvent } from './WeekView';

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  onSlotClick?: (hour: number) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

const START_HOUR = 6;  // 6 AM
const END_HOUR = 22;   // 10 PM
const HOUR_HEIGHT = 96; // Larger height for day view (more detail)
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);

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

function checkOverlap(event: CalendarEvent, allEvents: CalendarEvent[]): boolean {
  return allEvents.some(other => {
    if (other.id === event.id) return false;
    const start1 = timeToMinutes(event.startTime);
    const end1 = timeToMinutes(event.endTime);
    const start2 = timeToMinutes(other.startTime);
    const end2 = timeToMinutes(other.endTime);
    return start1 < end2 && end1 > start2;
  });
}

export function DayView({ date, events, onSlotClick, onEventClick }: DayViewProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Day header */}
      <div className="border-b border-gray-200 p-4 sticky top-0 z-10" style={{ backgroundColor: colors.neutral[50] }}>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
            {format(date, 'EEEE')}
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {format(date, 'MMMM d, yyyy')}
          </div>
        </div>
      </div>

      {/* Time slots */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex relative">
          {/* Time labels column */}
          <div className="w-20 flex-shrink-0 border-r border-gray-200" style={{ backgroundColor: colors.neutral[50] }}>
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-500 text-right"
                style={{ height: `${HOUR_HEIGHT}px` }}
              >
                {formatHour(hour)}
              </div>
            ))}
          </div>

          {/* Events column with current time indicator */}
          <div className="flex-1 relative">
            {/* Current time indicator */}
            <CurrentTimeIndicator
              startHour={START_HOUR}
              endHour={END_HOUR}
              hourHeight={HOUR_HEIGHT}
            />

            {HOURS.map((hour) => (
              <div
                key={hour}
                className={cn(
                  'relative border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors',
                  onSlotClick && 'active:bg-gray-100'
                )}
                style={{ height: `${HOUR_HEIGHT}px` }}
                onClick={() => onSlotClick?.(hour)}
              >
                {/* Events that fall within this hour */}
                {events
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

                    const hasOverlap = checkOverlap(event, events);

                    return (
                      <div
                        key={event.id}
                        className="absolute inset-x-0 px-3 cursor-pointer z-10"
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
