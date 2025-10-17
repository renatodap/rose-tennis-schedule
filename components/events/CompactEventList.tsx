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

  const eventTypeColors = {
    mandatory: 'bg-red-100 text-red-800 border-red-300',
    recommended: 'bg-orange-100 text-orange-800 border-orange-300',
    optional: 'bg-green-100 text-green-800 border-green-300',
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

        return (
          <Card
            key={event.id}
            className={cn(
              'overflow-hidden transition-all duration-300',
              event.event_type === 'mandatory' && 'border-red-500 border-2',
              hasRsvp && getRsvpBadgeColor(event.user_rsvp?.response).includes('bg-green') && 'bg-green-50/30',
              hasRsvp && getRsvpBadgeColor(event.user_rsvp?.response).includes('bg-yellow') && 'bg-yellow-50/30',
              hasRsvp && getRsvpBadgeColor(event.user_rsvp?.response).includes('bg-red') && 'bg-red-50/30'
            )}
          >
            {/* Collapsed Preview */}
            <button
              onClick={() => toggleExpand(event.id)}
              className="w-full p-4 text-left hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 truncate">
                      {event.title}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn('text-xs shrink-0', eventTypeColors[event.event_type])}
                    >
                      {event.event_type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                    <span className="font-medium">{getRelativeTime(event.start_datetime)}</span>
                    <span>•</span>
                    <span>{format(startDate, 'h:mm a')}</span>
                    {event.attendee_count !== undefined && event.attendee_count > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-green-600 font-medium">
                          {event.attendee_count} going
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
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
                  <CardContent className="border-t pt-4 space-y-4">
                    {/* Event Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>{format(startDate, 'EEEE, MMMM d, yyyy')}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>
                          {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                        </span>
                      </div>

                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {event.description && (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {event.description}
                      </p>
                    )}

                    {/* Attendees */}
                    {event.attendees && event.attendees.length > 0 && (
                      <AttendeeAvatars attendees={event.attendees} maxVisible={6} />
                    )}

                    {/* RSVP Buttons */}
                    <div className="pt-2">
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
