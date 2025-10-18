'use client';

/**
 * Admin Matches Management Page
 * Manage tennis match schedules, scores, and results by team
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScheduleImportDialog } from '@/components/matches/ScheduleImportDialog';
import { EditEventDialog } from '@/components/events/EditEventDialog';
import { useEvents, Event } from '@/lib/hooks/useEvents';
import { getClient } from '@/lib/supabase/client';
import { Team } from '@/lib/types/database.types';
import { Plus, Trophy, Upload, Edit, Calendar, MapPin, Clock, Loader2, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { BRAND_COLORS, EventType, HomeAwayType } from '@/lib/constants';
import { cn } from '@/lib/utils/cn';

export default function AdminMatchesPage() {
  const { events, loading, error, refresh } = useEvents();
  const supabase = getClient();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Event | null>(null);
  const [eventTeams, setEventTeams] = useState<Record<string, string[]>>({});

  // Fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      const { data } = await supabase
        .from('teams')
        .select('*')
        .eq('is_active', true)
        .order('team_level', { ascending: false })
        .order('gender', { ascending: false });

      if (data) {
        setTeams(data);
      }
    };

    fetchTeams();
  }, [supabase]);

  // Fetch event-team mappings
  useEffect(() => {
    const fetchEventTeams = async () => {
      const { data } = await supabase
        .from('event_teams')
        .select('event_id, team_id');

      if (data) {
        const mapping: Record<string, string[]> = {};
        data.forEach(({ event_id, team_id }) => {
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
  const allMatches = events.filter(event => event.event_type === EventType.MATCH);

  // Filter by selected team
  const matches = selectedTeam === 'all'
    ? allMatches
    : allMatches.filter(match => {
        const teamIds = eventTeams[match.id] || [];
        return teamIds.includes(selectedTeam);
      });

  // Separate upcoming and past
  const now = new Date().toISOString();
  const upcomingMatches = matches.filter(m => m.start_datetime >= now)
    .sort((a, b) => a.start_datetime.localeCompare(b.start_datetime));
  const pastMatches = matches.filter(m => m.start_datetime < now)
    .sort((a, b) => b.start_datetime.localeCompare(a.start_datetime));

  // Calculate record for selected team
  const calculateRecord = () => {
    const teamMatches = selectedTeam === 'all' ? pastMatches : pastMatches.filter(m => {
      const teamIds = eventTeams[m.id] || [];
      return teamIds.includes(selectedTeam);
    });

    let wins = 0;
    let losses = 0;
    teamMatches.forEach(match => {
      if (match.match_result?.startsWith('W')) wins++;
      if (match.match_result?.startsWith('L')) losses++;
    });

    return { wins, losses, total: wins + losses };
  };

  const record = calculateRecord();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: BRAND_COLORS.PRIMARY }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading matches. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Match Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage match schedules and results</p>
        </div>
        <Button onClick={() => setShowImportDialog(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Import Schedule
        </Button>
      </div>

      {/* Team Filter & Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Filter by Team</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                {teams.map(team => (
                  <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Season Record</CardTitle>
            <Trophy className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{record.wins}-{record.losses}</div>
            <p className="text-xs text-gray-500 mt-1">
              {record.total} {record.total === 1 ? 'match' : 'matches'} played
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Matches</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingMatches.length}</div>
            <p className="text-xs text-gray-500 mt-1">Scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {record.total > 0 ? Math.round((record.wins / record.total) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Overall</p>
          </CardContent>
        </Card>
      </div>

      {/* Matches List */}
      {matches.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Matches Found</h3>
              <p className="text-gray-600 mb-4">
                {selectedTeam !== 'all'
                  ? 'No matches scheduled for this team.'
                  : 'Get started by importing a match schedule.'}
              </p>
              <Button onClick={() => setShowImportDialog(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Import Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Upcoming Matches */}
          {upcomingMatches.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Matches</h3>
              <div className="grid gap-4">
                {upcomingMatches.map(match => (
                  <Card key={match.id} className={cn(match.is_conference_match && 'border-[#800000] border-2')}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{match.title}</CardTitle>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {match.home_away && (
                              <Badge variant="outline" className={cn('text-xs', homeAwayColors[match.home_away as HomeAwayType])}>
                                {homeAwayLabels[match.home_away as HomeAwayType]}
                              </Badge>
                            )}
                            {match.is_conference_match && (
                              <Badge variant="outline" className="text-xs bg-[#800000] text-white border-[#800000]">
                                HCAC
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setEditingMatch(match)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(match.start_datetime), 'EEEE, MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>
                          {format(new Date(match.start_datetime), 'h:mm a')} - {format(new Date(match.end_datetime), 'h:mm a')}
                        </span>
                      </div>
                      {match.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{match.location}</span>
                        </div>
                      )}
                      {match.opponent && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Trophy className="h-4 w-4" />
                          <span className="font-medium">vs {match.opponent}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Past Matches */}
          {pastMatches.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Past Matches</h3>
              <div className="grid gap-4">
                {pastMatches.map(match => {
                  const isWin = match.match_result?.startsWith('W');
                  const isLoss = match.match_result?.startsWith('L');

                  return (
                    <Card key={match.id} className={cn('opacity-90', match.is_conference_match && 'border-[#800000] border-2')}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                              {match.title}
                              {match.match_result && (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'text-xs',
                                    isWin && 'bg-green-100 text-green-800 border-green-300',
                                    isLoss && 'bg-red-100 text-red-800 border-red-300'
                                  )}
                                >
                                  {match.match_result}
                                </Badge>
                              )}
                            </CardTitle>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {match.home_away && (
                                <Badge variant="outline" className={cn('text-xs', homeAwayColors[match.home_away as HomeAwayType])}>
                                  {homeAwayLabels[match.home_away as HomeAwayType]}
                                </Badge>
                              )}
                              {match.is_conference_match && (
                                <Badge variant="outline" className="text-xs bg-[#800000] text-white border-[#800000]">
                                  HCAC
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setEditingMatch(match)}>
                            <Edit className="h-4 w-4 mr-1" />
                            {match.match_result ? 'Update' : 'Add Result'}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(match.start_datetime), 'EEEE, MMMM d, yyyy')}</span>
                        </div>
                        {match.opponent && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Trophy className="h-4 w-4" />
                            <span className="font-medium">vs {match.opponent}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dialogs */}
      <ScheduleImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImportComplete={refresh}
      />

      <EditEventDialog
        event={editingMatch}
        open={!!editingMatch}
        onOpenChange={(open) => !open && setEditingMatch(null)}
        onEventUpdated={refresh}
        onEventDeleted={refresh}
      />
    </div>
  );
}
