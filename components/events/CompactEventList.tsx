'use client';

/**
 * CompactEventList component
 * Displays events in a compact, tap-to-expand list format
 * Shows one-line preview when collapsed, full details when expanded
 * Optimized for mobile with giant RSVP tap zones
 */

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { EventWithRsvp } from '@/lib/hooks/useEvents';
import { AttendeeAvatars } from './AttendeeAvatars';
import { MobileRsvpZones } from './MobileRsvpZones';
import { RsvpButtons } from './RsvpButtons';
import { cn } from '@/lib/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface CompactEventListProps {
  events: EventWithRsvp[];
  onRsvpChange?: () => void;
}

export function CompactEventList({ events, onRsvpChange }: CompactEventListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleExpand = (eventId: string) => {
    setExpandedId(expandedId === eventId ? null : eventId);
  };

  const getRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'MMM d');
  };

  const eventTypeConfig = {
    mandatory: {
      badgeVariant: 'danger' as const,
      badgeStyle: 'solid' as const,
      label: 'Mandatory',
      borderColor: 'border-l-4 border-l-red-600',
    },
    recommended: {
      badgeVariant: 'warning' as const,
      badgeStyle: 'solid' as const,
      label: 'Recommended',
      borderColor: 'border-l-4 border-l-amber-600',
    },
    optional: {
      badgeVariant: 'info' as const,
      badgeStyle: 'soft' as const,
      label: 'Optional',
      borderColor: 'border-l-4 border-l-blue-600',
    },
    match: {
      badgeVariant: 'primary' as const,
      badgeStyle: 'solid' as const,
      label: 'Match',
      borderColor: 'border-l-4 border-l-maroon-700',
    },
  };

  const getRsvpBadgeColor = (response?: string) => {
    if (!response || response === 'no_response') return '';
    if (response === 'going') return 'bg-green-50 text-green-700 border-green-300';
    if (response === 'maybe') return 'bg-yellow-50 text-yellow-700 border-yellow-300';
    if (response === 'not_going') return 'bg-red-50 text-red-700 border-red-300';
    return '';
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {events.map((event) => {
        const isExpanded = expandedId === event.id;
        const startDate = new Date(event.start_datetime);
        const endDate = new Date(event.end_datetime);
        const hasRsvp = event.user_rsvp && event.user_rsvp.response !== 'no_response';

        const typeConfig = eventTypeConfig[event.event_type];

        return (
          <Card
            key={event.id}
            variant="interactive"
            className={cn(
              'overflow-hidden transition-all duration-200',
              typeConfig.borderColor,
              hasRsvp && event.user_rsvp?.response === 'going' && 'bg-green-50/30',
              hasRsvp && event.user_rsvp?.response === 'maybe' && 'bg-amber-50/20',
              hasRsvp && event.user_rsvp?.response === 'not_going' && 'bg-red-50/20'
            )}
          >
            {/* Collapsed Preview */}
            <button
              onClick={() => toggleExpand(event.id)}
              className="w-full p-4 text-left hover:bg-neutral-50/50 transition-colors active:bg-neutral-100/50"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge
                      variant={typeConfig.badgeVariant}
                      badgeStyle={typeConfig.badgeStyle}
                      size="xs"
                    >
                      {typeConfig.label}
                    </Badge>
                    {hasRsvp && (
                      <Badge
                        variant={
                          event.user_rsvp?.response === 'going'
                            ? 'success'
                            : event.user_rsvp?.response === 'maybe'
                            ? 'warning'
                            : 'danger'
                        }
                        badgeStyle="dot"
                        size="xs"
                      >
                        {event.user_rsvp?.response === 'going' && "You're Going"}
                        {event.user_rsvp?.response === 'maybe' && "You're Maybe"}
                        {event.user_rsvp?.response === 'not_going' && "Can't Attend"}
                      </Badge>
                    )}
                  </div>
                  <span className="font-bold text-neutral-900 truncate block">
                    {event.title}
                  </span>
                  <div className="flex items-center gap-3 mt-1.5 text-sm text-neutral-600">
                    <span className="font-medium">{getRelativeTime(event.start_datetime)}</span>
                    <span className="text-neutral-400">•</span>
                    <span>{format(startDate, 'h:mm a')}</span>
                    {event.attendee_count !== undefined && event.attendee_count > 0 && (
                      <>
                        <span className="text-neutral-400">•</span>
                        <span className="text-green-600 font-semibold">
                          {event.attendee_count} going
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-neutral-400" />
                  )}
                </div>
              </div>
            </button>

            {/* Expanded Details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <CardContent className="border-t border-neutral-200 pt-4 space-y-4">
                    {/* Event Details */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-sm text-neutral-700">
                        <Calendar className="h-4 w-4 shrink-0 text-neutral-500" />
                        <span className="font-medium">{format(startDate, 'EEEE, MMMM d, yyyy')}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-neutral-700">
                        <Clock className="h-4 w-4 shrink-0 text-neutral-500" />
                        <span className="font-medium">
                          {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                        </span>
                      </div>

                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                          <MapPin className="h-4 w-4 shrink-0 text-neutral-500" />
                          <span className="font-medium">{event.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {event.description && (
                      <p className="text-sm text-neutral-600 leading-relaxed bg-neutral-50 p-3 rounded-md">
                        {event.description}
                      </p>
                    )}

                    {/* Attendees */}
                    {event.attendees && event.attendees.length > 0 && (
                      <AttendeeAvatars attendees={event.attendees} maxVisible={6} size="md" />
                    )}

                    {/* RSVP Buttons */}
                    <div className="pt-2 border-t border-neutral-200">
                      {isMobile ? (
                        <MobileRsvpZones
                          eventId={event.id}
                          eventType={event.event_type}
                          currentResponse={event.user_rsvp?.response}
                          onResponseChange={onRsvpChange}
                        />
                      ) : (
                        <RsvpButtons
                          eventId={event.id}
                          currentResponse={event.user_rsvp?.response}
                          onResponseChange={onRsvpChange}
                          fullWidth
                        />
                      )}
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
}
