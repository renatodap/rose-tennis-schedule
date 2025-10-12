'use client';

/**
 * TimeSlotSelector component for selecting start and end times
 * Uses native time input with validation
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TimeSlotSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (startTime: string, endTime: string) => void;
  initialStartTime?: string;
  initialEndTime?: string;
}

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Time Slot</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                setError('');
              }}
              className="h-12"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="end-time">End Time</Label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                setError('');
              }}
              className="h-12"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} style={{ backgroundColor: '#800000' }} className="text-white hover:opacity-90">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
