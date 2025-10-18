'use client';

/**
 * Tennis Matches Page
 * Displays tennis match schedules by team with import functionality for coaches
 * Shows upcoming/past matches, win/loss records, and RSVP functionality
 */

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MatchCalendarView } from '@/components/matches/MatchCalendarView';
import { ScheduleImportDialog } from '@/components/matches/ScheduleImportDialog';
import { useEvents } from '@/lib/hooks/useEvents';
import { Trophy, Loader2, Upload } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';
import { getClient } from '@/lib/supabase/client';
import { Team } from '@/lib/types/database.types';
import { EventType } from '@/lib/constants';

export default function MatchesPage() {
  const { events, loading, error, refresh } = useEvents();
  const supabase = getClient();
  const [teams, setTeams] = useState<Team[]>([]);
  const [eventTeams, setEventTeams] = useState<Record<string, string[]>>({});
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isCoachOrCaptain, setIsCoachOrCaptain] = useState(false);

  // Fetch teams and check user role
  useEffect(() => {
    const fetchTeamsAndRole = async () => {
      // Fetch teams - prioritize varsity over JV, women's over men's
      const { data: teamsData } = await supabase
        .from('teams')
        .select('*')
        .eq('is_active', true)
        .order('team_level', { ascending: false }) // varsity before jv
        .order('gender', { ascending: false }); // women before men

      if (teamsData) {
        setTeams(teamsData);
      }

      // Check user role
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (userData && (userData.role === 'coach' || userData.role === 'captain')) {
          setIsCoachOrCaptain(true);
        }
      }
    };

    fetchTeamsAndRole();
  }, [supabase]);

  // Fetch event-team mappings
  useEffect(() => {
    const fetchEventTeams = async () => {
      const { data: eventTeamsData } = await supabase
        .from('event_teams')
        .select('event_id, team_id');

      if (eventTeamsData) {
        // Build a map: event_id -> [team_ids]
        const mapping: Record<string, string[]> = {};
        eventTeamsData.forEach(({ event_id, team_id }) => {
          if (!mapping[event_id]) {
            mapping[event_id] = [];
          }
          mapping[event_id].push(team_id);
        });
        setEventTeams(mapping);
      }
    };

    fetchEventTeams();
  }, [supabase]);

  // Filter only match events
  const matchEvents = events.filter(event => event.event_type === EventType.MATCH);

  // Get matches for a specific team
  const getMatchesByTeam = (teamId: string) => {
    return matchEvents.filter(event => {
      const teamIds = eventTeams[event.id] || [];
      return teamIds.includes(teamId);
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Match Schedule
          </h1>
          <p className="mt-2 text-gray-600">
            View tennis match schedules and results
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: BRAND_COLORS.PRIMARY }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Match Schedule
          </h1>
          <p className="mt-2 text-gray-600">
            View tennis match schedules and results
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-red-600">Error loading matches. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Match Schedule
          </h1>
          <p className="mt-2 text-gray-600">
            View tennis match schedules, results, and RSVP for matches
          </p>
        </div>

        {isCoachOrCaptain && (
          <Button
            onClick={() => setShowImportDialog(true)}
            style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
            className="text-white hover:opacity-90"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import Schedule
          </Button>
        )}
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Teams Found
          </h3>
          <p className="text-gray-600">
            No active tennis teams are configured.
          </p>
        </div>
      ) : (
        <Tabs defaultValue={teams[0]?.id || 'none'} className="space-y-4">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${teams.length}, 1fr)` }}>
            {teams.map((team) => {
              const teamMatches = getMatchesByTeam(team.id);
              return (
                <TabsTrigger key={team.id} value={team.id}>
                  {team.name} ({teamMatches.length})
                </TabsTrigger>
              );
            })}
          </TabsList>

          {teams.map((team) => {
            const teamMatches = getMatchesByTeam(team.id);

            return (
              <TabsContent key={team.id} value={team.id} className="space-y-4">
                {teamMatches.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                    <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${BRAND_COLORS.PRIMARY}10` }}>
                      <Trophy className="h-8 w-8" style={{ color: BRAND_COLORS.PRIMARY }} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Matches Scheduled
                    </h3>
                    <p className="text-gray-600 mb-4">
                      There are no matches scheduled for {team.name} yet.
                    </p>
                    {isCoachOrCaptain && (
                      <Button
                        onClick={() => setShowImportDialog(true)}
                        variant="outline"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Import Match Schedule
                      </Button>
                    )}
                  </div>
                ) : (
                  <MatchCalendarView
                    matches={teamMatches}
                    onRsvpChange={refresh}
                  />
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}

      {/* Import Dialog */}
      {isCoachOrCaptain && (
        <ScheduleImportDialog
          open={showImportDialog}
          onOpenChange={setShowImportDialog}
          onImportComplete={refresh}
        />
      )}
    </div>
  );
}
