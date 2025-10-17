'use client';

/**
 * AttendeeAvatars component
 * Shows avatars of players who RSVP'd "Going" to an event
 * Provides social proof to encourage attendance
 */

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils/cn';

interface Attendee {
  id: string;
  first_name: string;
  last_name: string;
  gender?: string;
  team_level?: string;
}

interface AttendeeAvatarsProps {
  attendees: Attendee[];
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AttendeeAvatars({
  attendees,
  maxVisible = 5,
  size = 'md',
  className,
}: AttendeeAvatarsProps) {
  if (!attendees || attendees.length === 0) {
    return null;
  }

  const visibleAttendees = attendees.slice(0, maxVisible);
  const remainingCount = attendees.length - maxVisible;

  const getInitials = (attendee: Attendee) => {
    const first = attendee.first_name?.charAt(0) || '';
    const last = attendee.last_name?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  };

  const getAvatarColor = (attendee: Attendee) => {
    if (attendee.gender === 'men') return 'bg-blue-100 text-blue-700 border-blue-300';
    if (attendee.gender === 'women') return 'bg-pink-100 text-pink-700 border-pink-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const getName = (attendee: Attendee) => {
    return `${attendee.first_name} ${attendee.last_name}`;
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn('flex items-center gap-2', className)}>
        <div className="flex -space-x-2">
          {visibleAttendees.map((attendee) => (
            <Tooltip key={attendee.id}>
              <TooltipTrigger asChild>
                <Avatar
                  className={cn(
                    'border-2 border-white ring-1',
                    sizeClasses[size],
                    getAvatarColor(attendee)
                  )}
                >
                  <AvatarFallback className={getAvatarColor(attendee)}>
                    {getInitials(attendee)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{getName(attendee)}</p>
                {attendee.team_level && (
                  <p className="text-xs text-gray-500 capitalize">{attendee.team_level}</p>
                )}
              </TooltipContent>
            </Tooltip>
          ))}

          {remainingCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar
                  className={cn(
                    'border-2 border-white bg-gray-200 text-gray-700',
                    sizeClasses[size]
                  )}
                >
                  <AvatarFallback className="bg-gray-200 text-gray-700 font-semibold">
                    +{remainingCount}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">+{remainingCount} more going</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <span className="text-sm text-gray-600 font-medium">
          {attendees.length} going
        </span>
      </div>
    </TooltipProvider>
  );
}
