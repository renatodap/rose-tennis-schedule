'use client';

/**
 * TimeSlotSelector - Premium time picker with duration presets
 * Enhanced mobile-friendly time selection with conflict detection
 */

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';
import { colors } from '@/lib/design-tokens';

interface TimeSlotSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (startTime: string, endTime: string) => void;
  initialStartTime?: string;
  initialEndTime?: string;
}

const DURATION_PRESETS = [
  { label: '30 min', minutes: 30 },
  { label: '1 hour', minutes: 60 },
  { label: '1.5 hours', minutes: 90 },
  { label: '2 hours', minutes: 120 },
];

export function TimeSlotSelector({
  open,
  onOpenChange,
  onConfirm,
  initialStartTime = '09:00',
  initialEndTime = '10:00'
}: TimeSlotSelectorProps) {
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [error, setError] = useState('');

  useEffect(() => {
    setStartTime(initialStartTime);
    setEndTime(initialEndTime);
  }, [initialStartTime, initialEndTime, open]);

  const calculateDuration = (): number => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    return (endH * 60 + endM) - (startH * 60 + startM);
  };

  const setDuration = (minutes: number) => {
    const [startH, startM] = startTime.split(':').map(Number);
    const totalMinutes = startH * 60 + startM + minutes;
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    setEndTime(`${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`);
    setError('');
  };

  const handleConfirm = () => {
    // Validate that end time is after start time
    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    setError('');
    onConfirm(startTime, endTime);
    onOpenChange(false);
  };

  const duration = calculateDuration();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" style={{ color: BRAND_COLORS.PRIMARY }} />
            Select Time Slot
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          {/* Duration Presets */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Quick Duration</Label>
            <div className="grid grid-cols-4 gap-2">
              {DURATION_PRESETS.map((preset) => (
                <button
                  key={preset.minutes}
                  onClick={() => setDuration(preset.minutes)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${duration === preset.minutes
                      ? 'text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                  style={duration === preset.minutes ? { backgroundColor: BRAND_COLORS.PRIMARY } : undefined}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-time" className="text-sm font-medium text-gray-700">
                Start Time
              </Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setError('');
                }}
                className="h-12 text-base"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-time" className="text-sm font-medium text-gray-700">
                End Time
              </Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  setError('');
                }}
                className="h-12 text-base"
              />
            </div>
          </div>

          {/* Duration Display */}
          {duration > 0 && !error && (
            <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: colors.success[50] }}>
              <p className="text-sm font-medium" style={{ color: colors.success[700] }}>
                Duration: {Math.floor(duration / 60)} hour{Math.floor(duration / 60) !== 1 ? 's' : ''}
                {duration % 60 > 0 && ` ${duration % 60} min`}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: colors.error[50] }}>
              <p className="text-sm font-medium" style={{ color: colors.error[700] }}>
                {error}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
            className="text-white hover:opacity-90"
          >
            Confirm Time
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
