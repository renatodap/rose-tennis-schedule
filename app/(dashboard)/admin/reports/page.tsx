'use client';

/**
 * Admin reports and availability dashboard page
 * Shows comprehensive availability analytics and best practice times
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AvailabilityHeatmap } from '@/components/admin/AvailabilityHeatmap';
import { BestTimesWidget } from '@/components/admin/BestTimesWidget';
import { useAvailabilityDashboard } from '@/lib/hooks/useAvailabilityDashboard';
import { Gender, TeamLevel } from '@/lib/constants';
import { Calendar, Download, Filter, Loader2, TrendingUp } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';

export default function AdminReportsPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [genderFilter, setGenderFilter] = useState<Gender | 'all'>('all');
  const [teamLevelFilter, setTeamLevelFilter] = useState<TeamLevel | 'all'>('all');

  // Calculate date range based on week offset
  const currentDate = new Date();
  const offsetDate = addWeeks(currentDate, weekOffset);
  const startDate = format(startOfWeek(offsetDate, { weekStartsOn: 0 }), 'yyyy-MM-dd');
  const endDate = format(endOfWeek(offsetDate, { weekStartsOn: 0 }), 'yyyy-MM-dd');

  const {
    loading,
    users,
    heatmapData,
    bestTimes,
    exportToCSV,
  } = useAvailabilityDashboard(startDate, endDate, {
    gender: genderFilter === 'all' ? undefined : genderFilter,
    teamLevel: teamLevelFilter === 'all' ? undefined : teamLevelFilter,
  });

  const handlePreviousWeek = () => {
    setWeekOffset(weekOffset - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(weekOffset + 1);
  };

  const handleThisWeek = () => {
    setWeekOffset(0);
  };

  const weekLabel = weekOffset === 0
    ? 'This Week'
    : weekOffset === -1
    ? 'Last Week'
    : weekOffset === 1
    ? 'Next Week'
    : `${Math.abs(weekOffset)} weeks ${weekOffset < 0 ? 'ago' : 'ahead'}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Availability Dashboard</h1>
        <p className="text-gray-600 mt-1">View team availability and find optimal practice times</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Week Selection</Label>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleThisWeek} className="flex-1">
                    {weekLabel}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNextWeek}>
                    Next
                  </Button>
                </div>
              </div>
              <div>
                <Label>Gender</Label>
                <Select
                  value={genderFilter}
                  onValueChange={(val) => setGenderFilter(val as Gender | 'all')}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    <SelectItem value={Gender.MEN}>Men's Team</SelectItem>
                    <SelectItem value={Gender.WOMEN}>Women's Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Team Level</Label>
                <Select
                  value={teamLevelFilter}
                  onValueChange={(val) => setTeamLevelFilter(val as TeamLevel | 'all')}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value={TeamLevel.JV}>JV</SelectItem>
                    <SelectItem value={TeamLevel.VARSITY}>Varsity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-sm text-gray-600">
                <Calendar className="inline h-4 w-4 mr-1" />
                {format(new Date(startDate), 'MMM d')} - {format(new Date(endDate), 'MMM d, yyyy')}
                {' • '}
                {users.length} player{users.length !== 1 ? 's' : ''}
              </div>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-1" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#800000]" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AvailabilityHeatmap data={heatmapData} />
            </div>
            <div>
              <BestTimesWidget bestTimes={bestTimes} />
            </div>
          </div>

          {bestTimes.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <CardTitle>Key Insights</CardTitle>
                    <CardDescription>Availability trends for selected period</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium">Best Overall Time</div>
                    <div className="text-sm text-gray-600">
                      {format(new Date(bestTimes[0].date), 'EEE, MMM d')} •{' '}
                      {bestTimes[0].timeSlot.start} - {bestTimes[0].timeSlot.end}
                      {' '}
                      ({bestTimes[0].availableUsers.length}/{bestTimes[0].totalUsers} players)
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium">Average Availability</div>
                    <div className="text-sm text-gray-600">
                      {Math.round(
                        bestTimes.reduce((sum, t) => sum + t.availabilityPercentage, 0) /
                          bestTimes.length
                      )}
                      % across top times
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium">Total Players Analyzed</div>
                    <div className="text-sm text-gray-600">{users.length} players</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
