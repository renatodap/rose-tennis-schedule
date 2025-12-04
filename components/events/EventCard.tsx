'use client';

/**
 * Event Card Component - $100M DESIGN SYSTEM
 * Premium card with visual hierarchy, urgency indicators, and social proof
 * Features: Type badge, attendee avatars, RSVP status, interactive states
 */

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AvatarGroup } from '@/components/ui/avatar-group';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import { EventWithRsvp } from '@/lib/hooks/useEvents';
import { RsvpButtons } from './RsvpButtons';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';
import { EventDetailsDialog } from './EventDetailsDialog';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: EventWithRsvp;
  onRsvpChange?: () => void;
  readOnly?: boolean;
}

export function EventCard({ event, onRsvpChange, readOnly = false }: EventCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const eventTypeConfig = {
    mandatory: {
      badgeVariant: 'danger' as const,
      badgeStyle: 'solid' as const,
      label: 'Mandatory',
      borderColor: 'border-l-red-600',
    },
    recommended: {
      badgeVariant: 'warning' as const,
      badgeStyle: 'solid' as const,
      label: 'Recommended',
      borderColor: 'border-l-amber-600',
    },
    optional: {
      badgeVariant: 'info' as const,
      badgeStyle: 'soft' as const,
      label: 'Optional',
      borderColor: 'border-l-blue-600',
    },
    match: {
      badgeVariant: 'primary' as const,
      badgeStyle: 'solid' as const,
      label: 'Match',
      borderColor: 'border-l-maroon-700',
    },
  };

  const rsvpStatusConfig = {
    going: {
      label: "You're Going",
      variant: 'success' as const,
      style: 'soft' as const,
    },
    maybe: {
      label: "You're Maybe",
      variant: 'warning' as const,
      style: 'soft' as const,
    },
    not_going: {
      label: "Can't Attend",
      variant: 'danger' as const,
      style: 'soft' as const,
    },
  };

  const typeConfig = eventTypeConfig[event.event_type];
  const startDate = new Date(event.start_datetime);
  const endDate = new Date(event.end_datetime);
  const hasRsvp = event.user_rsvp && event.user_rsvp.response !== 'no_response';
  const rsvpConfig = hasRsvp && event.user_rsvp ? rsvpStatusConfig[event.user_rsvp.response as keyof typeof rsvpStatusConfig] : null;

  // Get initials for attendee avatars
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <Card
        variant="interactive"
        className={cn(
          'border-l-4',
          typeConfig.borderColor,
          hasRsvp && event.user_rsvp?.response === 'going' && 'bg-green-50/30'
        )}
        onClick={() => setShowDetails(true)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge
                  variant={typeConfig.badgeVariant}
                  badgeStyle={typeConfig.badgeStyle}
                  size="sm"
                >
                  {typeConfig.label}
                </Badge>
                {rsvpConfig && (
                  <Badge
                    variant={rsvpConfig.variant}
                    badgeStyle={rsvpConfig.style}
                    size="sm"
                  >
                    {rsvpConfig.label}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl font-bold text-neutral-900">
                {event.title}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-sm text-neutral-700">
            <Calendar className="h-4 w-4 text-neutral-500 shrink-0" />
            <span className="font-medium">{format(startDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-neutral-700">
            <Clock className="h-4 w-4 text-neutral-500 shrink-0" />
            <span className="font-medium">
              {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
            </span>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-neutral-700">
              <MapPin className="h-4 w-4 text-neutral-500 shrink-0" />
              <span className="font-medium">{event.location}</span>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <p className="text-sm text-neutral-600 line-clamp-2 mt-3 leading-relaxed">
              {event.description}
            </p>
          )}

          {/* Attendee Avatars */}
          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-center gap-3 pt-2">
              <Users className="h-4 w-4 text-neutral-500" />
              <AvatarGroup max={4} size="sm">
                {event.attendees.map((attendee) => (
                  <Avatar key={attendee.id} size="sm" ring="default">
                    <AvatarFallback className="bg-maroon-100 text-maroon-700 text-xs font-semibold">
                      {getInitials(attendee.first_name, attendee.last_name)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
              <span className="text-sm font-medium text-neutral-600">
                {event.attendee_count} {event.attendee_count === 1 ? 'person' : 'people'} going
              </span>
            </div>
          )}
        </CardContent>

        {/* RSVP Buttons */}
        {!readOnly && (
          <CardFooter className="pt-0" onClick={(e) => e.stopPropagation()}>
            <RsvpButtons
              eventId={event.id}
              currentResponse={event.user_rsvp?.response}
              onResponseChange={onRsvpChange}
            />
          </CardFooter>
        )}
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
