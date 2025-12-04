'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

interface AttendeeInfo {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  status: 'confirmed' | 'declined';
  location: 'bubble' | 'src';
}

interface AttendanceListProps {
  attendees: AttendeeInfo[];
  showDeclined?: boolean;
}

export function AttendanceList({ attendees, showDeclined = true }: AttendanceListProps) {
  const confirmed = attendees.filter(a => a.status === 'confirmed');
  const declined = attendees.filter(a => a.status === 'declined');

  const renderAttendee = (attendee: AttendeeInfo) => {
    const initials = `${attendee.first_name[0]}${attendee.last_name[0]}`.toUpperCase();
    const isConfirmed = attendee.status === 'confirmed';

    return (
      <div
        key={attendee.id}
        className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50"
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback className={isConfirmed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-neutral-900 truncate">
            {attendee.first_name} {attendee.last_name}
          </p>
          <p className="text-sm text-neutral-500 capitalize">
            {attendee.gender === 'men' ? "Men's" : "Women's"} Team
          </p>
        </div>
        <Badge
          variant={attendee.location === 'bubble' ? 'primary' : 'secondary'}
          size="sm"
        >
          {attendee.location === 'bubble' ? 'Bubble' : 'SRC'}
        </Badge>
        {isConfirmed ? (
          <Check className="h-5 w-5 text-green-600" />
        ) : (
          <X className="h-5 w-5 text-red-600" />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Confirmed */}
      <div>
        <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
          <Check className="h-5 w-5 text-green-600" />
          Going ({confirmed.length})
        </h3>
        {confirmed.length === 0 ? (
          <p className="text-sm text-neutral-500 italic p-3 bg-neutral-50 rounded-lg">
            No one has confirmed yet
          </p>
        ) : (
          <div className="space-y-2">
            {confirmed.map(renderAttendee)}
          </div>
        )}
      </div>

      {/* Declined */}
      {showDeclined && declined.length > 0 && (
        <div>
          <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
            <X className="h-5 w-5 text-red-600" />
            Not Going ({declined.length})
          </h3>
          <div className="space-y-2">
            {declined.map(renderAttendee)}
          </div>
        </div>
      )}
    </div>
  );
}
