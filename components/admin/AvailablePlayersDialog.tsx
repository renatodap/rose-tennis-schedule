'use client';

/**
 * AvailablePlayersDialog component
 * Shows detailed list of available players for a specific time slot
 * Beautiful, searchable, sortable player list with avatars and badges
 */

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from '@/lib/types/database.types';
import { format, parseISO } from 'date-fns';
import { Search, Users, TrendingUp } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

interface AvailablePlayersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  timeSlot: { start: string; end: string };
  availablePlayers: User[];
  totalPlayers: number;
}

export function AvailablePlayersDialog({
  open,
  onOpenChange,
  date,
  timeSlot,
  availablePlayers,
  totalPlayers,
}: AvailablePlayersDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate percentage
  const percentage = totalPlayers > 0 ? Math.round((availablePlayers.length / totalPlayers) * 100) : 0;

  // Filter players based on search
  const filteredPlayers = useMemo(() => {
    if (!searchQuery) return availablePlayers;
    const query = searchQuery.toLowerCase();
    return availablePlayers.filter(
      (player) =>
        player.first_name?.toLowerCase().includes(query) ||
        player.last_name?.toLowerCase().includes(query) ||
        `${player.first_name} ${player.last_name}`.toLowerCase().includes(query)
    );
  }, [availablePlayers, searchQuery]);

  // Sort players by last name
  const sortedPlayers = useMemo(() => {
    return [...filteredPlayers].sort((a, b) => {
      const lastNameA = a.last_name || '';
      const lastNameB = b.last_name || '';
      return lastNameA.localeCompare(lastNameB);
    });
  }, [filteredPlayers]);

  // Get initials for avatar
  const getInitials = (player: User) => {
    const first = player.first_name?.charAt(0) || '';
    const last = player.last_name?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  };

  // Get color for avatar based on gender
  const getAvatarColor = (player: User) => {
    if (player.gender === 'men') return 'bg-blue-100 text-blue-700';
    if (player.gender === 'women') return 'bg-pink-100 text-pink-700';
    return 'bg-gray-100 text-gray-700';
  };

  // Format time slot display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Available Players</DialogTitle>
        </DialogHeader>

        {/* Header Info */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
          <div>
            <div className="font-semibold text-lg">
              {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
            </div>
            <div className="text-sm text-gray-600 mt-0.5">
              {formatTime(timeSlot.start)} - {formatTime(timeSlot.end)}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: BRAND_COLORS.PRIMARY }}>
                {availablePlayers.length}
              </div>
              <div className="text-xs text-gray-600">of {totalPlayers} players</div>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke={BRAND_COLORS.PRIMARY}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${percentage * 1.75} ${175 - percentage * 1.75}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">{percentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Players List */}
        <div className="flex-1 overflow-y-auto min-h-[200px]">
          {sortedPlayers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              {searchQuery ? (
                <>
                  <Search className="h-12 w-12 mb-3 opacity-20" />
                  <p>No players found matching &quot;{searchQuery}&quot;</p>
                </>
              ) : (
                <>
                  <Users className="h-12 w-12 mb-3 opacity-20" />
                  <p>No players available at this time</p>
                  <p className="text-sm mt-1">Consider scheduling at a different time</p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
              {sortedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Avatar className={getAvatarColor(player)}>
                    <AvatarFallback className={getAvatarColor(player)}>
                      {getInitials(player)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {player.first_name} {player.last_name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      {player.team_level && (
                        <Badge
                          variant="outline"
                          className="text-xs uppercase"
                          style={{
                            borderColor: BRAND_COLORS.PRIMARY,
                            color: BRAND_COLORS.PRIMARY,
                          }}
                        >
                          {player.team_level}
                        </Badge>
                      )}
                      {player.gender && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {player.gender === 'men' ? "Men's" : "Women's"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {sortedPlayers.length > 0 && (
          <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg text-sm">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-gray-700">
              {searchQuery
                ? `Showing ${sortedPlayers.length} of ${availablePlayers.length} players`
                : `${percentage}% team availability - Great time to practice!`}
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
