'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConfirmButton } from './ConfirmButton';
import { format, parseISO, startOfDay, isBefore, isEqual } from 'date-fns';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface PracticeDateCardProps {
  date: string; // ISO date string
  confirmedCount: number;
  declinedCount: number;
  myStatus: 'confirmed' | 'declined' | null;
  onConfirm: () => void;
  onDecline: () => void;
  loading?: boolean;
  onClick?: () => void; // For navigating to detail view
}

export function PracticeDateCard({
  date,
  confirmedCount,
  declinedCount,
  myStatus,
  onConfirm,
  onDecline,
  loading,
  onClick
}: PracticeDateCardProps) {
  const dateObj = parseISO(date);
  const todayStart = startOfDay(new Date());
  const dateStart = startOfDay(dateObj);
  const past = isBefore(dateStart, todayStart);
  const today = isEqual(dateStart, todayStart);

  return (
    <Card
      variant="elevated"
      className={cn(
        'transition-all',
        past && 'opacity-60',
        today && 'ring-2 ring-maroon-600',
        onClick && 'cursor-pointer hover:shadow-lg'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Date info */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center justify-center bg-maroon-50 rounded-lg p-2 min-w-[60px]">
              <span className="text-xs font-semibold text-maroon-700 uppercase">
                {format(dateObj, 'EEE')}
              </span>
              <span className="text-2xl font-bold text-maroon-900">
                {format(dateObj, 'd')}
              </span>
              <span className="text-xs text-maroon-600">
                {format(dateObj, 'MMM')}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-neutral-900">
                  {format(dateObj, 'EEEE, MMMM d')}
                </span>
                {today && (
                  <Badge variant="primary" size="sm">Today</Badge>
                )}
                {past && (
                  <Badge variant="secondary" size="sm">Past</Badge>
                )}
              </div>
              <span className="text-sm text-neutral-600">5:00 PM - 7:00 PM</span>

              {/* Attendance counts */}
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-sm">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-700">{confirmedCount} going</span>
                </div>
                {declinedCount > 0 && (
                  <div className="flex items-center gap-1 text-sm text-neutral-500">
                    <span>{declinedCount} not going</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Confirm buttons */}
          {!past && (
            <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
              <ConfirmButton
                status={myStatus}
                onConfirm={onConfirm}
                onDecline={onDecline}
                loading={loading}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
