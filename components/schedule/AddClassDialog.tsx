'use client';

/**
 * AddClassDialog component - form for adding a new class to the schedule
 * Includes day selector, time pickers, course name, and location
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';
import { BRAND_COLORS } from '@/lib/constants';

interface AddClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (classData: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    courseName?: string;
    location?: string;
  }) => Promise<void>;
  initialDayOfWeek?: number;
  initialStartTime?: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function AddClassDialog({
  open,
  onOpenChange,
  onSave,
  initialDayOfWeek = 1,
  initialStartTime = '09:00',
}: AddClassDialogProps) {
  const [dayOfWeek, setDayOfWeek] = useState(initialDayOfWeek);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState('10:00');
  const [courseName, setCourseName] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // Validate
    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await onSave({
        dayOfWeek,
        startTime,
        endTime,
        courseName: courseName.trim() || undefined,
        location: location.trim() || undefined,
      });

      // Reset form
      setDayOfWeek(1);
      setStartTime('09:00');
      setEndTime('10:00');
      setCourseName('');
      setLocation('');
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Class</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Day of Week Selector */}
          <div className="grid gap-2">
            <Label>Day of Week</Label>
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((day, index) => (
                <button
                  key={day}
                  type="button"
                  className={cn(
                    'min-h-[44px] px-2 py-2 text-xs sm:text-sm font-medium rounded-md border transition-colors',
                    dayOfWeek === index
                      ? 'text-white border-transparent'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  )}
                  style={
                    dayOfWeek === index
                      ? { backgroundColor: BRAND_COLORS.PRIMARY }
                      : undefined
                  }
                  onClick={() => setDayOfWeek(index)}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Time Pickers */}
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          {/* Course Name */}
          <div className="grid gap-2">
            <Label htmlFor="course-name">Course Name (Optional)</Label>
            <Input
              id="course-name"
              type="text"
              placeholder="e.g., MA 111 - Calculus I"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Location */}
          <div className="grid gap-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g., Crapo Hall 201"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
            className="text-white hover:opacity-90"
          >
            {loading ? 'Saving...' : 'Save Class'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
