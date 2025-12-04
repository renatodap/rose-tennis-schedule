'use client';

/**
 * TodayTimeline component
 * Shows a visual timeline of today's schedule with events and classes
 * Beautiful empty state when nothing is scheduled
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, GraduationCap } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface TimelineEvent {
  id: string;
  title: string;
  type: 'event' | 'class';
  startTime: string;
  endTime: string;
  location?: string;
  eventType?: 'optional' | 'recommended' | 'mandatory' | 'match';
}

interface TodayTimelineProps {
  events: TimelineEvent[];
  emptyMessage?: string;
}

const eventTypeColors = {
  mandatory: 'danger',
  recommended: 'warning',
  optional: 'success',
  match: 'info',
} as const;

export function TodayTimeline({ events, emptyMessage = "Your schedule is clear today" }: TodayTimelineProps) {
  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-maroon-600" />
          <CardTitle className="text-lg">Today&apos;s Schedule</CardTitle>
        </div>
        <p className="text-sm text-neutral-600 mt-1">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </CardHeader>

      <CardContent>
        {sortedEvents.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-green-50 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-neutral-900 font-semibold mb-1">All Clear!</p>
            <p className="text-sm text-neutral-600">{emptyMessage}</p>
          </div>
        ) : (
          // Timeline
          <div className="space-y-4">
            {sortedEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-8 pb-4 last:pb-0"
              >
                {/* Timeline line */}
                {index !== sortedEvents.length - 1 && (
                  <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-neutral-200" />
                )}

                {/* Timeline dot */}
                <div
                  className={cn(
                    'absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white',
                    event.type === 'event'
                      ? event.eventType === 'mandatory'
                        ? 'bg-red-500'
                        : event.eventType === 'recommended'
                        ? 'bg-orange-500'
                        : event.eventType === 'match'
                        ? 'bg-blue-500'
                        : 'bg-green-500'
                      : 'bg-neutral-400'
                  )}
                />

                {/* Event content */}
                <div className="bg-neutral-50 rounded-lg p-4 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {event.type === 'class' ? (
                          <GraduationCap className="h-4 w-4 text-neutral-600 shrink-0" />
                        ) : (
                          <Calendar className="h-4 w-4 text-neutral-600 shrink-0" />
                        )}
                        <h4 className="font-semibold text-neutral-900 text-sm">
                          {event.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-neutral-600">
                        <Clock className="h-3 w-3" />
                        <span>
                          {event.startTime} - {event.endTime}
                        </span>
                      </div>

                      {event.location && (
                        <div className="flex items-center gap-2 text-xs text-neutral-600 mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>

                    {event.type === 'event' && event.eventType && (
                      <Badge
                        variant={eventTypeColors[event.eventType]}
                        badgeStyle="soft"
                        size="sm"
                      >
                        {event.eventType}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
