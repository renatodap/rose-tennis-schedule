'use client';

/**
 * WeekView component - displays a week (Sunday-Saturday) with time slots
 * Mobile-first design with horizontal scrolling for days and vertical scrolling for time
 */

import { cn } from '@/lib/utils/cn';
import { BRAND_COLORS } from '@/lib/constants';

export interface CalendarEvent {
  id: string;
  title: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  type: 'class' | 'blocker' | 'availability' | 'event';
  location?: string;
}

interface WeekViewProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onSlotClick?: (dayOfWeek: number, hour: number) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 11 PM
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatHour(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}${period}`;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function getEventColor(type: CalendarEvent['type']): string {
  switch (type) {
    case 'class':
      return BRAND_COLORS.PRIMARY; // Maroon
    case 'blocker':
      return '#ea580c'; // Orange-red
    case 'availability':
      return '#16a34a'; // Green
    case 'event':
      return '#2563eb'; // Blue
    default:
      return '#6b7280'; // Gray
  }
}

export function WeekView({ events, selectedDate, onSlotClick, onEventClick }: WeekViewProps) {
  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Days header - sticky */}
      <div className="flex border-b border-gray-200 bg-gray-50 sticky top-0 z-20">
        {/* Time column header */}
        <div className="w-14 sm:w-16 flex-shrink-0 border-r border-gray-200" />

        {/* Day headers */}
        <div className="flex-1 flex min-w-0">
          {DAYS.map((day, index) => (
            <div
              key={day}
              className="flex-1 min-w-[60px] sm:min-w-[80px] p-2 text-center border-r border-gray-200 last:border-r-0"
            >
              <div className="text-xs font-semibold text-gray-600 hidden sm:block">{DAYS_FULL[index]}</div>
              <div className="text-xs font-semibold text-gray-600 sm:hidden">{day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Time slots with horizontal scroll */}
      <div className="flex-1 overflow-auto">
        <div className="flex min-w-max">
          {/* Time labels column */}
          <div className="w-14 sm:w-16 flex-shrink-0 border-r border-gray-200 bg-gray-50">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-16 sm:h-20 border-b border-gray-200 px-1 sm:px-2 py-1 text-xs text-gray-500 font-medium"
              >
                {formatHour(hour)}
              </div>
            ))}
          </div>

          {/* Days columns */}
          <div className="flex-1 flex">
            {DAYS.map((_, dayIndex) => (
              <div key={dayIndex} className="flex-1 min-w-[60px] sm:min-w-[80px] border-r border-gray-200 last:border-r-0">
                {HOURS.map((hour) => {
                  const dayEvents = events.filter(
                    (event) => event.dayOfWeek === dayIndex
                  );

                  return (
                    <div
                      key={`${dayIndex}-${hour}`}
                      className={cn(
                        'relative h-16 sm:h-20 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors',
                        onSlotClick && 'active:bg-gray-100'
                      )}
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

                          return (
                            <div
                              key={event.id}
                              className="absolute inset-x-0 px-0.5 sm:px-1 cursor-pointer hover:opacity-80 transition-opacity"
                              style={{
                                top: `${top}%`,
                                bottom: `${bottom}%`,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onEventClick?.(event);
                              }}
                            >
                              <div
                                className="h-full rounded text-white shadow-sm overflow-hidden p-0.5 sm:p-1"
                                style={{ backgroundColor: getEventColor(event.type) }}
                              >
                                <div className="text-[10px] sm:text-xs font-semibold truncate leading-tight">
                                  {event.title}
                                </div>
                                <div className="text-[9px] sm:text-xs opacity-90 leading-tight hidden sm:block">
                                  {event.startTime}
                                </div>
                              </div>
                            </div>
                          );
                        })}
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
