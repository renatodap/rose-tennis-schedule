'use client';

/**
 * Elite Availability Heatmap
 * Interactive grid showing player availability with hover tooltips and click-to-expand
 * Responsive: Desktop grid view, mobile list view
 */

import { useState, useEffect, useMemo } from 'react';
import { HeatmapData } from '@/lib/hooks/useAvailabilityDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { User } from '@/lib/types/database.types';
import { AvailablePlayersDialog } from './AvailablePlayersDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AvailabilityHeatmapProps {
  data: HeatmapData[];
  onCellClick?: (date: string, timeSlot: { start: string; end: string }, users: User[]) => void;
}

export function AvailabilityHeatmap({ data }: AvailabilityHeatmapProps) {
  const [selectedCell, setSelectedCell] = useState<{
    date: string;
    timeSlot: { start: string; end: string };
    availableUsers: User[];
    total: number;
  } | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const timeSlots = data[0].timeSlots.map(ts => ts.timeSlot);

  // Get gradient color based on percentage
  const getGradientColor = (available: number, total: number): string => {
    if (total === 0) return 'from-gray-100 to-gray-200';
    const percentage = (available / total) * 100;

    if (percentage >= 80) return 'from-green-500 to-green-600';
    if (percentage >= 60) return 'from-green-400 to-green-500';
    if (percentage >= 40) return 'from-amber-400 to-amber-500';
    if (percentage >= 20) return 'from-orange-400 to-orange-500';
    return 'from-red-400 to-red-500';
  };

  // Get text color for contrast
  const getTextColor = (available: number, total: number): string => {
    if (total === 0) return 'text-gray-600';
    const percentage = (available / total) * 100;
    return percentage >= 40 ? 'text-white' : 'text-gray-700';
  };

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}${minutes !== '00' ? ':' + minutes : ''}${ampm}`;
  };

  const formatTimeRange = (start: string, end: string) => {
    return `${formatTime(start)}-${formatTime(end)}`;
  };

  // Get preview names for tooltip (first 3)
  const getPreviewNames = (users: User[]): string => {
    if (users.length === 0) return 'No players available';
    const names = users.slice(0, 3).map(u => `${u.first_name} ${u.last_name?.charAt(0)}.`);
    const remaining = users.length - 3;
    if (remaining > 0) {
      return `${names.join(', ')} (+${remaining} more)`;
    }
    return names.join(', ');
  };

  const handleCellClick = (
    date: string,
    timeSlot: { start: string; end: string },
    availableUsers: User[],
    total: number
  ) => {
    setSelectedCell({ date, timeSlot, availableUsers, total });
  };

  // Mobile List View
  if (isMobile) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.map((day) => {
              const isExpanded = expandedDay === day.date;
              return (
                <div key={day.date} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedDay(isExpanded ? null : day.date)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-semibold text-sm">
                      {format(parseISO(day.date), 'EEE, MMM d')}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-600" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-2 space-y-2 bg-white">
                      {day.timeSlots.map((slot, idx) => {
                        const percentage = slot.totalCount > 0
                          ? Math.round((slot.availableCount / slot.totalCount) * 100)
                          : 0;
                        const gradientClass = getGradientColor(slot.availableCount, slot.totalCount);

                        return (
                          <button
                            key={idx}
                            onClick={() => handleCellClick(day.date, slot.timeSlot, slot.availableUsers, slot.totalCount)}
                            className={cn(
                              "w-full flex items-center justify-between p-3 rounded-lg transition-all min-h-[52px]",
                              "bg-gradient-to-r hover:shadow-md active:scale-98",
                              gradientClass
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className={cn("font-medium text-sm", getTextColor(slot.availableCount, slot.totalCount))}>
                                {formatTimeRange(slot.timeSlot.start, slot.timeSlot.end)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="bg-white/90 text-gray-900 font-semibold">
                                {slot.availableCount}/{slot.totalCount}
                              </Badge>
                              <span className={cn("text-xs font-medium", getTextColor(slot.availableCount, slot.totalCount))}>
                                {percentage}%
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <AvailablePlayersDialog
          open={!!selectedCell}
          onOpenChange={() => setSelectedCell(null)}
          date={selectedCell?.date || ''}
          timeSlot={selectedCell?.timeSlot || { start: '', end: '' }}
          availablePlayers={selectedCell?.availableUsers || []}
          totalPlayers={selectedCell?.total || 0}
        />
      </>
    );
  }

  // Desktop Grid View
  return (
    <TooltipProvider delayDuration={200}>
      <Card>
        <CardHeader>
          <CardTitle>Availability Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-3 text-xs font-semibold text-gray-700 bg-gray-100 sticky left-0 z-10 min-w-[120px]">
                    Date
                  </th>
                  {timeSlots.map((slot, idx) => (
                    <th key={idx} className="border border-gray-300 p-2 text-xs font-semibold text-gray-700 bg-gray-100 min-w-[70px]">
                      <div>{formatTime(slot.start)}</div>
                      <div className="text-[10px] font-normal text-gray-500">
                        {formatTime(slot.end)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((day) => (
                  <tr key={day.date}>
                    <td className="border border-gray-300 p-3 text-sm font-medium sticky left-0 bg-white z-10">
                      <div>{format(parseISO(day.date), 'EEE')}</div>
                      <div className="text-xs text-gray-600">{format(parseISO(day.date), 'MMM d')}</div>
                    </td>
                    {day.timeSlots.map((slot, idx) => {
                      const gradientClass = getGradientColor(slot.availableCount, slot.totalCount);
                      const textColor = getTextColor(slot.availableCount, slot.totalCount);

                      return (
                        <Tooltip key={idx}>
                          <TooltipTrigger asChild>
                            <td
                              className={cn(
                                "border border-gray-300 p-2 text-center cursor-pointer transition-all",
                                "bg-gradient-to-br hover:scale-105 hover:shadow-lg hover:z-20 relative",
                                gradientClass
                              )}
                              onClick={() =>
                                handleCellClick(
                                  day.date,
                                  slot.timeSlot,
                                  slot.availableUsers,
                                  slot.totalCount
                                )
                              }
                            >
                              <div className={cn("text-sm font-bold", textColor)}>
                                {slot.availableCount}
                              </div>
                              <div className={cn("text-[10px] font-medium", textColor)}>
                                of {slot.totalCount}
                              </div>
                            </td>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[250px] p-3">
                            <div className="space-y-1">
                              <div className="font-semibold text-sm">
                                {slot.availableCount} / {slot.totalCount} players
                              </div>
                              <div className="text-xs text-gray-600">
                                {getPreviewNames(slot.availableUsers)}
                              </div>
                              <div className="text-xs text-gray-500 italic pt-1 border-t">
                                Click to see full list
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs p-4 bg-gray-50 rounded-lg">
            <span className="font-semibold text-gray-700">Availability:</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded shadow-sm" />
              <span>80%+</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded shadow-sm" />
              <span>60-79%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-500 rounded shadow-sm" />
              <span>40-59%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-500 rounded shadow-sm" />
              <span>20-39%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-500 rounded shadow-sm" />
              <span>0-19%</span>
            </div>
            <span className="ml-auto text-gray-600 italic">Hover for preview • Click for details</span>
          </div>
        </CardContent>
      </Card>

      <AvailablePlayersDialog
        open={!!selectedCell}
        onOpenChange={() => setSelectedCell(null)}
        date={selectedCell?.date || ''}
        timeSlot={selectedCell?.timeSlot || { start: '', end: '' }}
        availablePlayers={selectedCell?.availableUsers || []}
        totalPlayers={selectedCell?.total || 0}
      />
    </TooltipProvider>
  );
}
