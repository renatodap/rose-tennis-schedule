'use client';

/**
 * Dialog for adding recurring time blockers (weekly commitments)
 */

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useBlockers } from '@/lib/hooks/useBlockers';
import { Loader2 } from 'lucide-react';
import { QUARTERS } from '@/lib/constants';

interface AddRecurringBlockerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

export function AddRecurringBlockerDialog({
  open,
  onOpenChange,
}: AddRecurringBlockerDialogProps) {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quarter, setQuarter] = useState('FALL_2025');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addRecurringBlocker } = useBlockers();

  const resetForm = () => {
    setSelectedDays([]);
    setStartTime('');
    setEndTime('');
    setTitle('');
    setDescription('');
    setQuarter('FALL_2025');
  };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDays.length === 0 || !startTime || !endTime || !title) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a blocker for each selected day
      await Promise.all(
        selectedDays.map((day) =>
          addRecurringBlocker({
            day_of_week: day,
            start_time: startTime,
            end_time: endTime,
            title,
            description: description || undefined,
            quarter,
          })
        )
      );

      resetForm();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Recurring Blocker</DialogTitle>
          <DialogDescription>
            Mark recurring commitments that make you unavailable for practice (e.g., study groups, meetings)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Study Group, TA Hours"
              required
            />
          </div>

          {/* Days of Week */}
          <div className="space-y-2">
            <Label>
              Days of Week <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    selectedDays.includes(day.value)
                      ? 'bg-[#800000] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
            {selectedDays.length === 0 && (
              <p className="text-xs text-gray-500">Select at least one day</p>
            )}
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">
                Start Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">
                End Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Quarter Selection */}
          <div className="space-y-2">
            <Label htmlFor="quarter">Quarter</Label>
            <select
              id="quarter"
              value={quarter}
              onChange={(e) => setQuarter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800000] focus-visible:ring-offset-2"
            >
              {Object.entries(QUARTERS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this commitment..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || selectedDays.length === 0}
              style={{ backgroundColor: '#800000' }}
              className="hover:bg-[#5c0000]"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Blocker
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
