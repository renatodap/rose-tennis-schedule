'use client';

/**
 * Event card component displaying event details and RSVP buttons
 * Shows event type badge, date/time, location, and current RSVP status
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { EventWithRsvp } from '@/lib/hooks/useEvents';
import { RsvpButtons } from './RsvpButtons';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';
import { EventDetailsDialog } from './EventDetailsDialog';

interface EventCardProps {
  event: EventWithRsvp;
  onRsvpChange?: () => void;
  readOnly?: boolean;
}

export function EventCard({ event, onRsvpChange, readOnly = false }: EventCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const eventTypeColors = {
    mandatory: 'bg-red-100 text-red-800 border-red-300',
    recommended: 'bg-orange-100 text-orange-800 border-orange-300',
    optional: 'bg-green-100 text-green-800 border-green-300',
  };

  const eventTypeLabels = {
    mandatory: 'Mandatory',
    recommended: 'Recommended',
    optional: 'Optional',
  };

  const startDate = new Date(event.start_datetime);
  const endDate = new Date(event.end_datetime);

  return (
    <>
      <Card
        className={cn(
          'hover:shadow-md transition-shadow cursor-pointer',
          event.event_type === 'mandatory' && 'border-red-500 border-2'
        )}
        onClick={() => setShowDetails(true)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="outline"
                  className={cn('text-xs', eventTypeColors[event.event_type])}
                >
                  {eventTypeLabels[event.event_type]}
                </Badge>
                {event.user_rsvp && event.user_rsvp.response !== 'no_response' && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      event.user_rsvp.response === 'going' && 'bg-green-50 text-green-700 border-green-300',
                      event.user_rsvp.response === 'maybe' && 'bg-yellow-50 text-yellow-700 border-yellow-300',
                      event.user_rsvp.response === 'not_going' && 'bg-red-50 text-red-700 border-red-300'
                    )}
                  >
                    {event.user_rsvp.response === 'going' && 'You\'re Going'}
                    {event.user_rsvp.response === 'maybe' && 'You\'re Maybe'}
                    {event.user_rsvp.response === 'not_going' && 'You\'re Not Going'}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{format(startDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}

          {event.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-2">
              {event.description}
            </p>
          )}

          {!readOnly && (
            <div className="pt-2" onClick={(e) => e.stopPropagation()}>
              <RsvpButtons
                eventId={event.id}
                currentResponse={event.user_rsvp?.response}
                onResponseChange={onRsvpChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <EventDetailsDialog
        event={event}
        open={showDetails}
        onOpenChange={setShowDetails}
        onRsvpChange={onRsvpChange}
        readOnly={readOnly}
      />
    </>
  );
}
