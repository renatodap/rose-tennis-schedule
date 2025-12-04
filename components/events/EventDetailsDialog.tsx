'use client';

/**
 * Event details dialog showing full event information
 * Includes RSVP buttons and displays who's going (for coaches/captains)
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import { EventWithRsvp } from '@/lib/hooks/useEvents';
import { RsvpButtons } from './RsvpButtons';
import { cn } from '@/lib/utils/cn';
import { useEventManagement } from '@/lib/hooks/useEventManagement';
import { useEffect, useState } from 'react';

interface EventDetailsDialogProps {
  event: EventWithRsvp;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRsvpChange?: () => void;
  readOnly?: boolean;
}

export function EventDetailsDialog({
  event,
  open,
  onOpenChange,
  onRsvpChange,
  readOnly = false,
}: EventDetailsDialogProps) {
  const { isAdmin, getRsvpSummary } = useEventManagement();
  const [rsvpSummary, setRsvpSummary] = useState<any>(null);

  useEffect(() => {
    if (open && isAdmin) {
      getRsvpSummary(event.id).then(setRsvpSummary);
    }
  }, [open, isAdmin, event.id, getRsvpSummary]);

  const eventTypeConfig = {
    mandatory: {
      badgeVariant: 'danger' as const,
      badgeStyle: 'solid' as const,
      label: 'Mandatory',
    },
    recommended: {
      badgeVariant: 'warning' as const,
      badgeStyle: 'solid' as const,
      label: 'Recommended',
    },
    optional: {
      badgeVariant: 'info' as const,
      badgeStyle: 'soft' as const,
      label: 'Optional',
    },
    match: {
      badgeVariant: 'primary' as const,
      badgeStyle: 'solid' as const,
      label: 'Match',
    },
  };

  const typeConfig = eventTypeConfig[event.event_type];

  const startDate = new Date(event.start_datetime);
  const endDate = new Date(event.end_datetime);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant={typeConfig.badgeVariant}
                  badgeStyle={typeConfig.badgeStyle}
                  size="default"
                >
                  {typeConfig.label}
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">
                  {format(startDate, 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">
                  {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                </p>
              </div>
            </div>

            {event.location && (
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>
            )}
          </div>

          {event.description && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <DialogDescription className="text-gray-700 whitespace-pre-wrap">
                  {event.description}
                </DialogDescription>
              </div>
            </>
          )}

          {isAdmin && rsvpSummary && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  RSVP Summary
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-sm font-medium text-green-900">Going</span>
                    <span className="text-lg font-bold text-green-700">{rsvpSummary.going}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <span className="text-sm font-medium text-yellow-900">Maybe</span>
                    <span className="text-lg font-bold text-yellow-700">{rsvpSummary.maybe}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <span className="text-sm font-medium text-red-900">Not Going</span>
                    <span className="text-lg font-bold text-red-700">{rsvpSummary.not_going}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-900">No Response</span>
                    <span className="text-lg font-bold text-gray-700">{rsvpSummary.no_response}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Total eligible: {rsvpSummary.total_users} {rsvpSummary.total_users === 1 ? 'person' : 'people'}
                </p>
              </div>
            </>
          )}

          {!readOnly && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Your Response</h3>
                <RsvpButtons
                  eventId={event.id}
                  currentResponse={event.user_rsvp?.response}
                  onResponseChange={() => {
                    onRsvpChange?.();
                    if (isAdmin) {
                      getRsvpSummary(event.id).then(setRsvpSummary);
                    }
                  }}
                  fullWidth
                />
              </div>
            </>
          )}

          {event.user_rsvp && event.user_rsvp.response !== 'no_response' && event.user_rsvp.response_datetime && (
            <p className="text-xs text-gray-500 mt-2">
              You responded on {format(new Date(event.user_rsvp.response_datetime), 'MMM d, yyyy \'at\' h:mm a')}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
