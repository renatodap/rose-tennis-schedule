'use client';

/**
 * Match Calendar View component
 * Displays upcoming and past tennis matches with filters
 * Shows win/loss record and provides quick filtering options
 */

import { useState, useMemo } from 'react';
import { EventWithRsvp } from '@/lib/hooks/useEvents';
import { MatchCard } from './MatchCard';
import { Button } from '@/components/ui/button';
import { Trophy, Home, Plane, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HomeAwayType } from '@/lib/constants';

interface MatchCalendarViewProps {
  matches: EventWithRsvp[];
  onRsvpChange?: () => void;
  readOnly?: boolean;
}

type FilterType = 'all' | 'home' | 'away' | 'conference';

export function MatchCalendarView({
  matches,
  onRsvpChange,
  readOnly = false,
}: MatchCalendarViewProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  // Separate upcoming and past matches
  const now = new Date();
  const upcomingMatches = matches.filter(m => new Date(m.end_datetime) >= now);
  const pastMatches = matches.filter(m => new Date(m.end_datetime) < now);

  // Calculate win/loss record from past matches
  const record = useMemo(() => {
    let wins = 0;
    let losses = 0;
    pastMatches.forEach(match => {
      if (match.match_result?.startsWith('W')) wins++;
      if (match.match_result?.startsWith('L')) losses++;
    });
    return { wins, losses, total: pastMatches.length };
  }, [pastMatches]);

  // Apply filters
  const applyFilter = (matchList: EventWithRsvp[]) => {
    switch (filter) {
      case 'home':
        return matchList.filter(m => m.home_away === HomeAwayType.HOME);
      case 'away':
        return matchList.filter(m => m.home_away === HomeAwayType.AWAY);
      case 'conference':
        return matchList.filter(m => m.is_conference_match);
      default:
        return matchList;
    }
  };

  const filteredUpcoming = applyFilter(upcomingMatches);
  const filteredPast = applyFilter(pastMatches);

  return (
    <div className="space-y-6">
      {/* Record Display */}
      {record.total > 0 && (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
          <Trophy className="h-8 w-8 text-[#800000]" />
          <div>
            <h3 className="text-lg font-semibold">Season Record</h3>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                {record.wins} Wins
              </Badge>
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                {record.losses} Losses
              </Badge>
              <span className="text-sm text-gray-600">
                ({record.wins}-{record.losses})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Matches
        </Button>
        <Button
          variant={filter === 'home' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('home')}
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
        <Button
          variant={filter === 'away' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('away')}
        >
          <Plane className="mr-2 h-4 w-4" />
          Away
        </Button>
        <Button
          variant={filter === 'conference' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('conference')}
        >
          <Globe className="mr-2 h-4 w-4" />
          HCAC Conference
        </Button>
      </div>

      {/* Upcoming/Past Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
            Upcoming ({filteredUpcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({filteredPast.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {filteredUpcoming.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No upcoming matches</p>
              {filter !== 'all' && (
                <Button
                  variant="link"
                  onClick={() => setFilter('all')}
                  className="mt-2"
                >
                  Clear filter
                </Button>
              )}
            </div>
          ) : (
            filteredUpcoming.map((match) => (
              <MatchCard
                key={match.id}
                event={match}
                onRsvpChange={onRsvpChange}
                readOnly={readOnly}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {filteredPast.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No past matches</p>
              {filter !== 'all' && (
                <Button
                  variant="link"
                  onClick={() => setFilter('all')}
                  className="mt-2"
                >
                  Clear filter
                </Button>
              )}
            </div>
          ) : (
            filteredPast
              .sort((a, b) => new Date(b.start_datetime).getTime() - new Date(a.start_datetime).getTime())
              .map((match) => (
                <MatchCard
                  key={match.id}
                  event={match}
                  onRsvpChange={onRsvpChange}
                  readOnly={readOnly}
                />
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
