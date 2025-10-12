'use client';

/**
 * DayView component - displays a single day with hourly time slots
 * Shows class schedules in color-coded blocks
 */

import { cn } from '@/lib/utils/cn';
import { BRAND_COLORS } from '@/lib/constants';

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  type: 'class' | 'blocker' | 'availability' | 'event';
  location?: string;
}

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  onSlotClick?: (hour: number) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 11 PM

function formatHour(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:00 ${period}`;
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

export function DayView({ date, events, onSlotClick, onEventClick }: DayViewProps) {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 bg-white sticky top-0 z-10">
        <h2 className="text-lg font-semibold text-gray-900">{dayName}</h2>
      </div>

      {/* Time slots */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className={cn(
                'relative border-b border-gray-200 h-20 hover:bg-gray-50 cursor-pointer transition-colors',
                onSlotClick && 'active:bg-gray-100'
              )}
              onClick={() => onSlotClick?.(hour)}
            >
              {/* Time label */}
              <div className="absolute left-0 top-0 px-3 py-2 text-xs font-medium text-gray-500 w-24">
                {formatHour(hour)}
              </div>

              {/* Event container */}
              <div className="ml-24 h-full relative">
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

                    return (
                      <div
                        key={event.id}
                        className="absolute left-0 right-0 px-2 cursor-pointer hover:opacity-80 transition-opacity"
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
                          className="h-full rounded-md p-2 text-white shadow-sm"
                          style={{ backgroundColor: getEventColor(event.type) }}
                        >
                          <div className="text-xs font-semibold truncate">{event.title}</div>
                          <div className="text-xs opacity-90">
                            {event.startTime} - {event.endTime}
                          </div>
                          {event.location && (
                            <div className="text-xs opacity-75 truncate">{event.location}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
