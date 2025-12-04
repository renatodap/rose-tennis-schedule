'use client';

/**
 * UpcomingEventsList component
 * Compact preview of next 3-5 upcoming events
 * Quick RSVP actions inline
 */

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';

interface UpcomingEvent {
  id: string;
  title: string;
  startDatetime: string;
  endDatetime: string;
  location?: string;
  eventType: 'optional' | 'recommended' | 'mandatory' | 'match';
  userRsvp?: 'going' | 'maybe' | 'not_going' | 'no_response';
  attendeeCount?: number;
}

interface UpcomingEventsListProps {
  events: UpcomingEvent[];
  maxEvents?: number;
  onEventClick?: (eventId: string) => void;
}

const eventTypeColors = {
  mandatory: 'danger',
  recommended: 'warning',
  optional: 'success',
  match: 'info',
} as const;

const rsvpStatusColors = {
  going: 'bg-green-50 border-green-200',
  maybe: 'bg-yellow-50 border-yellow-200',
  not_going: 'bg-red-50 border-red-200',
  no_response: 'border-neutral-200',
};

export function UpcomingEventsList({
  events,
  maxEvents = 5,
  onEventClick
}: UpcomingEventsListProps) {
  const getRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'MMM d');
  };

  const displayEvents = events.slice(0, maxEvents);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-maroon-600" />
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
          </div>
          {events.length > maxEvents && (
            <Link href="/events">
              <Button variant="ghost" size="sm" iconRight={<ChevronRight className="h-4 w-4" />}>
                View all
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {displayEvents.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 bg-neutral-50 rounded-full mb-3">
              <Calendar className="h-7 w-7 text-neutral-400" />
            </div>
            <p className="text-sm text-neutral-600">No upcoming events</p>
          </div>
        ) : (
          // Event list
          <div className="space-y-3">
            {displayEvents.map((event, index) => {
              const startDate = new Date(event.startDatetime);
              const endDate = new Date(event.endDatetime);
              const hasRsvp = event.userRsvp && event.userRsvp !== 'no_response';

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onEventClick?.(event.id)}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md',
                    hasRsvp && rsvpStatusColors[event.userRsvp!],
                    !hasRsvp && rsvpStatusColors.no_response,
                    event.eventType === 'mandatory' && !hasRsvp && 'border-red-300 bg-red-50/30'
                  )}
                >
                  {/* Event header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-neutral-900 text-sm mb-1 truncate">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant={eventTypeColors[event.eventType]}
                          badgeStyle="soft"
                          size="xs"
                        >
                          {event.eventType}
                        </Badge>
                        {hasRsvp && (
                          <Badge
                            variant={
                              event.userRsvp === 'going' ? 'success' :
                              event.userRsvp === 'maybe' ? 'warning' :
                              'danger'
                            }
                            badgeStyle="dot"
                            size="xs"
                          >
                            {event.userRsvp === 'going' ? 'Going' :
                             event.userRsvp === 'maybe' ? 'Maybe' :
                             'Not going'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Event details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-neutral-700">
                      <Calendar className="h-3 w-3 shrink-0" />
                      <span className="font-medium">{getRelativeTime(event.startDatetime)}</span>
                      <span>•</span>
                      <Clock className="h-3 w-3 shrink-0" />
                      <span>{format(startDate, 'h:mm a')}</span>
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-2 text-xs text-neutral-600">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}

                    {event.attendeeCount !== undefined && event.attendeeCount > 0 && (
                      <div className="flex items-center gap-2 text-xs text-green-700 font-medium">
                        <span>{event.attendeeCount} {event.attendeeCount === 1 ? 'person' : 'people'} going</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>

      {events.length > maxEvents && (
        <CardFooter className="pt-0">
          <Link href="/events" className="w-full">
            <Button variant="outline" fullWidth>
              View all {events.length} events
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
