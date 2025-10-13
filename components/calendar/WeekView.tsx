'use client';

/**
 * WeekView component - displays a week (Sunday-Saturday) with time slots
 * Mobile-first design with horizontal scrolling for days and vertical scrolling for time
 * Enhanced with conflict detection, legend, and tooltips
 */

import { cn } from '@/lib/utils/cn';
import { BRAND_COLORS } from '@/lib/constants';
import { GraduationCap, Clock, Ban, AlertCircle } from 'lucide-react';

export interface CalendarEvent {
  id: string;
  title: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  type: 'class' | 'blocker' | 'availability' | 'event';
  location?: string;
  rsvpStatus?: 'going' | 'not_going' | 'maybe' | 'no_response'; // For events
}

interface WeekViewProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onSlotClick?: (dayOfWeek: number, hour: number) => void;
  onEventClick?: (event: CalendarEvent) => void;
  showLegend?: boolean;
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM
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

function getEventColor(type: CalendarEvent['type'], rsvpStatus?: 'going' | 'not_going' | 'maybe' | 'no_response'): { bg: string; border: string; text: string } {
  switch (type) {
    case 'class':
      return {
        bg: BRAND_COLORS.PRIMARY, // Maroon
        border: '#5c0000',
        text: '#ffffff'
      };
    case 'blocker':
      return {
        bg: '#ea580c', // Orange-red
        border: '#c2410c',
        text: '#ffffff'
      };
    case 'availability':
      return {
        bg: '#16a34a', // Green
        border: '#15803d',
        text: '#ffffff'
      };
    case 'event':
      // Different colors based on RSVP status
      if (rsvpStatus === 'going') {
        return {
          bg: '#16a34a', // Green - confirmed going
          border: '#15803d',
          text: '#ffffff'
        };
      } else if (rsvpStatus === 'maybe') {
        return {
          bg: '#f59e0b', // Amber - maybe
          border: '#d97706',
          text: '#ffffff'
        };
      } else if (rsvpStatus === 'not_going') {
        return {
          bg: '#dc2626', // Red - not going
          border: '#b91c1c',
          text: '#ffffff'
        };
      } else {
        return {
          bg: '#2563eb', // Blue - no response yet
          border: '#1e40af',
          text: '#ffffff'
        };
      }
    default:
      return {
        bg: '#6b7280', // Gray
        border: '#4b5563',
        text: '#ffffff'
      };
  }
}

function getTypeIcon(type: CalendarEvent['type']) {
  switch (type) {
    case 'class':
      return <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />;
    case 'blocker':
      return <Ban className="h-3 w-3 sm:h-4 sm:w-4" />;
    case 'availability':
      return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
    default:
      return null;
  }
}

function getTypeLabel(type: CalendarEvent['type']): string {
  switch (type) {
    case 'class':
      return 'Class';
    case 'blocker':
      return 'Blocker';
    case 'availability':
      return 'Available';
    case 'event':
      return 'Event';
    default:
      return 'Unknown';
  }
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

export function WeekView({ events, selectedDate, onSlotClick, onEventClick, showLegend = true }: WeekViewProps) {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Sync header scroll with content scroll
    const headerScroll = e.currentTarget.previousElementSibling?.querySelector('.flex-1') as HTMLDivElement;
    if (headerScroll) {
      headerScroll.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Legend - Compact */}
      {showLegend && (
        <div className="mb-2 flex flex-wrap gap-1.5 sm:gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1">
            <div className="flex items-center justify-center w-4 h-4 sm:w-4 sm:h-4 rounded" style={{ backgroundColor: BRAND_COLORS.PRIMARY }}>
              <GraduationCap className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-white" />
            </div>
            <span className="font-medium text-gray-700">Class</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center justify-center w-4 h-4 rounded bg-green-600">
              <Clock className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-white" />
            </div>
            <span className="font-medium text-gray-700">Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center justify-center w-4 h-4 rounded bg-orange-600">
              <Ban className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-white" />
            </div>
            <span className="font-medium text-gray-700">Blocker</span>
          </div>
          <span className="text-gray-500 hidden sm:inline">|</span>
          <span className="font-semibold text-gray-700 hidden sm:inline">Events:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-blue-600" />
            <span className="font-medium text-gray-700">No RSVP</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-green-600" />
            <span className="font-medium text-gray-700">Going</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-amber-500" />
            <span className="font-medium text-gray-700">Maybe</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-red-600" />
            <span className="font-medium text-gray-700">Not Going</span>
          </div>
          <div className="flex items-center gap-1 sm:ml-auto">
            <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-600" />
            <span className="font-medium text-gray-700">Conflict</span>
          </div>
        </div>
      )}

      <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col">
        {/* Days header - sticky */}
        <div className="flex border-b border-gray-200 bg-gray-50 sticky top-0 z-20 flex-shrink-0">
        {/* Time column header */}
        <div className="w-14 sm:w-16 flex-shrink-0 border-r border-gray-200" />

        {/* Day headers - scrollable to match columns below */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide">
          <div className="flex min-w-max">
            {DAYS.map((day, index) => (
              <div
                key={day}
                className="w-[120px] sm:w-[140px] flex-shrink-0 p-2 text-center border-r border-gray-200 last:border-r-0"
              >
                <div className="text-xs font-semibold text-gray-600 hidden sm:block">{DAYS_FULL[index]}</div>
                <div className="text-xs font-semibold text-gray-600 sm:hidden">{day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time slots with horizontal scroll */}
      <div className="flex-1 overflow-auto" onScroll={handleScroll}>
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
          <div className="flex">
            {DAYS.map((_, dayIndex) => (
              <div key={dayIndex} className="w-[120px] sm:w-[140px] flex-shrink-0 border-r border-gray-200 last:border-r-0">
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

                          const colors = getEventColor(event.type, event.rsvpStatus);
                          const hasOverlap = hasConflict(event, events);

                          return (
                            <div
                              key={event.id}
                              className="absolute inset-x-0 px-0.5 sm:px-1 cursor-pointer group"
                              style={{
                                top: `${top}%`,
                                bottom: `${bottom}%`,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onEventClick?.(event);
                              }}
                              title={`${getTypeLabel(event.type)}: ${event.title}\n${event.startTime} - ${event.endTime}${event.location ? '\n' + event.location : ''}${event.rsvpStatus && event.type === 'event' ? '\nRSVP: ' + event.rsvpStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : ''}${hasOverlap ? '\n⚠️ Conflicts with other events' : ''}`}
                            >
                              <div
                                className={cn(
                                  "h-full rounded shadow-sm overflow-hidden p-0.5 sm:p-1 transition-all group-hover:shadow-md",
                                  hasOverlap && "ring-2 ring-yellow-400 ring-offset-1"
                                )}
                                style={{
                                  backgroundColor: colors.bg,
                                  borderLeft: `3px solid ${colors.border}`,
                                  color: colors.text
                                }}
                              >
                                <div className="flex items-start gap-0.5 sm:gap-1 mb-0.5">
                                  <div className="flex-shrink-0 mt-0.5">
                                    {getTypeIcon(event.type)}
                                  </div>
                                  <div className="text-[10px] sm:text-xs font-semibold truncate leading-tight flex-1">
                                    {event.title}
                                  </div>
                                  {hasOverlap && (
                                    <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-300 flex-shrink-0" />
                                  )}
                                </div>
                                <div className="text-[9px] sm:text-xs opacity-90 leading-tight hidden sm:block truncate">
                                  {event.startTime} - {event.endTime}
                                </div>
                                {event.location && (
                                  <div className="text-[8px] sm:text-xs opacity-75 leading-tight hidden sm:block truncate">
                                    {event.location}
                                  </div>
                                )}
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
    </div>
  );
}
