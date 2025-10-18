'use client';

/**
 * Match card component for displaying tennis matches
 * Enhanced version of EventCard with match-specific features:
 * - Opponent name
 * - Home/away/neutral indicator
 * - Match result (if completed)
 * - Conference match badge
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Trophy, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { EventWithRsvp } from '@/lib/hooks/useEvents';
import { RsvpButtons } from '../events/RsvpButtons';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';
import { EventDetailsDialog } from '../events/EventDetailsDialog';
import { HomeAwayType } from '@/lib/constants';

interface MatchCardProps {
  event: EventWithRsvp;
  onRsvpChange?: () => void;
  readOnly?: boolean;
}

export function MatchCard({ event, onRsvpChange, readOnly = false }: MatchCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const startDate = new Date(event.start_datetime);
  const endDate = new Date(event.end_datetime);

  // Determine if this is a past match
  const isPastMatch = endDate < new Date();

  // Home/Away colors
  const homeAwayColors = {
    [HomeAwayType.HOME]: 'bg-green-100 text-green-800 border-green-300',
    [HomeAwayType.AWAY]: 'bg-blue-100 text-blue-800 border-blue-300',
    [HomeAwayType.NEUTRAL]: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  const homeAwayLabels = {
    [HomeAwayType.HOME]: 'Home',
    [HomeAwayType.AWAY]: 'Away',
    [HomeAwayType.NEUTRAL]: 'Neutral',
  };

  // Determine win/loss from result
  const isWin = event.match_result?.startsWith('W');
  const isLoss = event.match_result?.startsWith('L');

  return (
    <>
      <Card
        className={cn(
          'hover:shadow-md transition-shadow cursor-pointer',
          isPastMatch && !event.match_result && 'opacity-75',
          event.is_conference_match && 'border-[#800000] border-2'
        )}
        onClick={() => setShowDetails(true)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {event.title}
                {event.match_result && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs ml-2',
                      isWin && 'bg-green-100 text-green-800 border-green-300',
                      isLoss && 'bg-red-100 text-red-800 border-red-300'
                    )}
                  >
                    {event.match_result}
                  </Badge>
                )}
              </CardTitle>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                {/* Home/Away Badge */}
                {event.home_away && (
                  <Badge
                    variant="outline"
                    className={cn('text-xs', homeAwayColors[event.home_away as HomeAwayType])}
                  >
                    {homeAwayLabels[event.home_away as HomeAwayType]}
                  </Badge>
                )}

                {/* Conference Match Badge */}
                {event.is_conference_match && (
                  <Badge variant="outline" className="text-xs bg-[#800000] text-white border-[#800000]">
                    HCAC
                  </Badge>
                )}

                {/* User RSVP Status */}
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

          {/* Opponent (if different from title) */}
          {event.opponent && !event.title.includes(event.opponent) && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Trophy className="h-4 w-4" />
              <span className="font-medium">vs {event.opponent}</span>
            </div>
          )}

          {/* External Link (Live Video, Box Score, etc.) */}
          {event.external_url && (
            <a
              href={event.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#800000] hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" />
              <span>
                {isPastMatch ? 'View Box Score/Recap' : 'Live Video'}
              </span>
            </a>
          )}

          {event.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-2">
              {event.description}
            </p>
          )}

          {!readOnly && !isPastMatch && (
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
        readOnly={readOnly || isPastMatch}
      />
    </>
  );
}
