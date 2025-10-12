'use client';

/**
 * Widget showing the best practice times by availability
 * Lists top time slots with player count and details
 */

import { TimeSlotAvailability } from '@/lib/hooks/useAvailabilityDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Users, Trophy } from 'lucide-react';

interface BestTimesWidgetProps {
  bestTimes: TimeSlotAvailability[];
}

export function BestTimesWidget({ bestTimes }: BestTimesWidgetProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotAvailability | null>(null);

  if (bestTimes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Best Practice Times</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No availability data to analyze
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-600" />
            <div>
              <CardTitle>Best Practice Times</CardTitle>
              <CardDescription>Top time slots by player availability</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {bestTimes.map((slot, idx) => (
              <div
                key={`${slot.date}-${slot.timeSlot.start}`}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      idx === 0
                        ? 'bg-amber-100 text-amber-700'
                        : idx === 1
                        ? 'bg-gray-100 text-gray-700'
                        : idx === 2
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-50 text-gray-600'
                    } font-bold text-sm`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {format(parseISO(slot.date), 'EEE, MMM d')} •{' '}
                      {slot.timeSlot.start} - {slot.timeSlot.end}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="default">
                        {slot.availableUsers.length} / {slot.totalUsers} players
                      </Badge>
                      <span className="text-xs text-gray-600">
                        {Math.round(slot.availabilityPercentage)}% available
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSlot(slot)}
                >
                  <Users className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedSlot} onOpenChange={() => setSelectedSlot(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Available Players</DialogTitle>
          </DialogHeader>
          {selectedSlot && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">
                    {format(parseISO(selectedSlot.date), 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedSlot.timeSlot.start} - {selectedSlot.timeSlot.end}
                  </div>
                </div>
                <Badge variant="default" className="text-base px-4 py-2">
                  {selectedSlot.availableUsers.length} / {selectedSlot.totalUsers}
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Available Players</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedSlot.availableUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-2 border rounded flex items-center justify-between"
                    >
                      <span className="text-sm">
                        {user.first_name} {user.last_name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {user.team_level || 'N/A'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
