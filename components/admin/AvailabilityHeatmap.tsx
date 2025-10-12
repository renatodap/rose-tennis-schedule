'use client';

/**
 * Heatmap visualization for availability data
 * Shows player count per time slot with color intensity
 */

import { useState } from 'react';
import { HeatmapData } from '@/lib/hooks/useAvailabilityDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { User } from '@/lib/types/database.types';

interface AvailabilityHeatmapProps {
  data: HeatmapData[];
  onCellClick?: (date: string, timeSlot: { start: string; end: string }, users: User[]) => void;
}

export function AvailabilityHeatmap({ data, onCellClick }: AvailabilityHeatmapProps) {
  const [selectedCell, setSelectedCell] = useState<{
    date: string;
    timeSlot: string;
    available: number;
    total: number;
  } | null>(null);

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            No availability data for selected date range
          </div>
        </CardContent>
      </Card>
    );
  }

  const timeSlots = data[0].timeSlots.map(ts => `${ts.timeSlot.start}-${ts.timeSlot.end}`);

  const getColorIntensity = (available: number, total: number) => {
    if (total === 0) return 'bg-gray-100';
    const percentage = (available / total) * 100;

    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 60) return 'bg-green-400';
    if (percentage >= 40) return 'bg-amber-400';
    if (percentage >= 20) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const handleCellClick = (date: string, timeSlotStr: string, available: number, total: number) => {
    setSelectedCell({ date, timeSlot: timeSlotStr, available, total });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Availability Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-xs font-medium text-gray-600 bg-gray-50 sticky left-0 z-10">
                    Date
                  </th>
                  {timeSlots.map((slot, idx) => (
                    <th key={idx} className="border p-2 text-xs font-medium text-gray-600 bg-gray-50">
                      {slot}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((day) => (
                  <tr key={day.date}>
                    <td className="border p-2 text-xs font-medium sticky left-0 bg-white z-10">
                      {format(parseISO(day.date), 'EEE, MMM d')}
                    </td>
                    {day.timeSlots.map((slot, idx) => {
                      const colorClass = getColorIntensity(slot.availableCount, slot.totalCount);
                      return (
                        <td
                          key={idx}
                          className={`border p-2 text-center cursor-pointer hover:opacity-80 transition-opacity ${colorClass}`}
                          onClick={() =>
                            handleCellClick(
                              day.date,
                              `${slot.timeSlot.start}-${slot.timeSlot.end}`,
                              slot.availableCount,
                              slot.totalCount
                            )
                          }
                        >
                          <div className="text-xs font-medium text-white">
                            {slot.availableCount}/{slot.totalCount}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs">
            <span className="font-medium">Legend:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-600 rounded" />
              <span>80%+</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-400 rounded" />
              <span>60-79%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-amber-400 rounded" />
              <span>40-59%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-orange-400 rounded" />
              <span>20-39%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-400 rounded" />
              <span>0-19%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedCell} onOpenChange={() => setSelectedCell(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Time Slot Details</DialogTitle>
          </DialogHeader>
          {selectedCell && (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Date</div>
                <div className="font-medium">{format(parseISO(selectedCell.date), 'EEEE, MMMM d, yyyy')}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Time Slot</div>
                <div className="font-medium">{selectedCell.timeSlot}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Availability</div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">
                    {selectedCell.available} / {selectedCell.total} players
                  </Badge>
                  <span className="text-sm text-gray-600">
                    ({Math.round((selectedCell.available / selectedCell.total) * 100)}%)
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
