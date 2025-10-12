'use client';

/**
 * Event RSVP List for coaches and captains
 * Shows all users and their RSVP status, grouped by response type
 * Includes export to CSV functionality
 */

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEventManagement, UserRsvp } from '@/lib/hooks/useEventManagement';
import { Event } from '@/lib/hooks/useEvents';
import { Loader2, Download } from 'lucide-react';
import { format } from 'date-fns';

interface EventRsvpListProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventRsvpList({
  event,
  open,
  onOpenChange,
}: EventRsvpListProps) {
  const { getRsvpList } = useEventManagement();
  const [rsvps, setRsvps] = useState<UserRsvp[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event && open) {
      setLoading(true);
      getRsvpList(event.id).then((data) => {
        setRsvps(data);
        setLoading(false);
      });
    }
  }, [event, open, getRsvpList]);

  const groupedRsvps = {
    going: rsvps.filter(r => r.response === 'going'),
    maybe: rsvps.filter(r => r.response === 'maybe'),
    not_going: rsvps.filter(r => r.response === 'not_going'),
    no_response: rsvps.filter(r => r.response === 'no_response'),
  };

  const exportToCSV = () => {
    if (!event) return;

    const csvContent = [
      ['Name', 'Gender', 'Team Level', 'Response', 'Response Date'].join(','),
      ...rsvps.map(rsvp => [
        `"${rsvp.first_name} ${rsvp.last_name}"`,
        rsvp.gender,
        rsvp.team_level,
        rsvp.response,
        rsvp.response_datetime ? format(new Date(rsvp.response_datetime), 'yyyy-MM-dd HH:mm:ss') : 'N/A',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${event.title.replace(/[^a-z0-9]/gi, '_')}_rsvps.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle>RSVPs for {event.title}</DialogTitle>
              <DialogDescription>
                {format(new Date(event.start_datetime), 'EEEE, MMMM d, yyyy \'at\' h:mm a')}
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              disabled={loading || rsvps.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {/* Summary */}
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-900">Going</p>
                <p className="text-2xl font-bold text-green-700">{groupedRsvps.going.length}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm font-medium text-yellow-900">Maybe</p>
                <p className="text-2xl font-bold text-yellow-700">{groupedRsvps.maybe.length}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm font-medium text-red-900">Not Going</p>
                <p className="text-2xl font-bold text-red-700">{groupedRsvps.not_going.length}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-900">No Response</p>
                <p className="text-2xl font-bold text-gray-700">{groupedRsvps.no_response.length}</p>
              </div>
            </div>

            {/* Going */}
            {groupedRsvps.going.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-green-700 flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-green-600 rounded-full"></span>
                  Going ({groupedRsvps.going.length})
                </h3>
                <div className="space-y-2">
                  {groupedRsvps.going.map((rsvp) => (
                    <RsvpUserCard key={rsvp.user_id} rsvp={rsvp} />
                  ))}
                </div>
              </div>
            )}

            {/* Maybe */}
            {groupedRsvps.maybe.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-yellow-700 flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-yellow-600 rounded-full"></span>
                  Maybe ({groupedRsvps.maybe.length})
                </h3>
                <div className="space-y-2">
                  {groupedRsvps.maybe.map((rsvp) => (
                    <RsvpUserCard key={rsvp.user_id} rsvp={rsvp} />
                  ))}
                </div>
              </div>
            )}

            {/* Not Going */}
            {groupedRsvps.not_going.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-red-700 flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-red-600 rounded-full"></span>
                  Not Going ({groupedRsvps.not_going.length})
                </h3>
                <div className="space-y-2">
                  {groupedRsvps.not_going.map((rsvp) => (
                    <RsvpUserCard key={rsvp.user_id} rsvp={rsvp} />
                  ))}
                </div>
              </div>
            )}

            {/* No Response */}
            {groupedRsvps.no_response.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-gray-600 rounded-full"></span>
                  No Response ({groupedRsvps.no_response.length})
                </h3>
                <div className="space-y-2">
                  {groupedRsvps.no_response.map((rsvp) => (
                    <RsvpUserCard key={rsvp.user_id} rsvp={rsvp} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function RsvpUserCard({ rsvp }: { rsvp: UserRsvp }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-3">
        <div>
          <p className="font-medium text-gray-900">
            {rsvp.first_name} {rsvp.last_name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {rsvp.gender === 'men' ? 'Men' : 'Women'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {rsvp.team_level === 'jv' ? 'JV' : 'Varsity'}
            </Badge>
          </div>
        </div>
      </div>
      {rsvp.response_datetime && (
        <p className="text-xs text-gray-500">
          {format(new Date(rsvp.response_datetime), 'MMM d \'at\' h:mm a')}
        </p>
      )}
    </div>
  );
}
