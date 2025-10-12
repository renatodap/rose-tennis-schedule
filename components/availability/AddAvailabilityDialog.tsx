'use client';

/**
 * Dialog for adding new practice availability
 * Supports single date or date range
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
import { useAvailability } from '@/lib/hooks/useAvailability';
import { Loader2, AlertCircle } from 'lucide-react';

interface AddAvailabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: string;
}

export function AddAvailabilityDialog({
  open,
  onOpenChange,
  defaultDate,
}: AddAvailabilityDialogProps) {
  const [isRange, setIsRange] = useState(false);
  const [date, setDate] = useState(defaultDate || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictWarning, setConflictWarning] = useState(false);

  const { addAvailability, addAvailabilityRange, checkConflicts } = useAvailability();

  const resetForm = () => {
    setIsRange(false);
    setDate(defaultDate || '');
    setStartDate('');
    setEndDate('');
    setStartTime('');
    setEndTime('');
    setNotes('');
    setConflictWarning(false);
  };

  const handleCheckConflict = async () => {
    if (!isRange && date && startTime && endTime) {
      const hasConflict = await checkConflicts(date, startTime, endTime);
      setConflictWarning(hasConflict);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isRange) {
        if (!startDate || !endDate || !startTime || !endTime) {
          return;
        }

        await addAvailabilityRange({
          start_date: startDate,
          end_date: endDate,
          start_time: startTime,
          end_time: endTime,
          notes: notes || undefined,
        });
      } else {
        if (!date || !startTime || !endTime) {
          return;
        }

        await addAvailability({
          date,
          start_time: startTime,
          end_time: endTime,
          notes: notes || undefined,
        });
      }

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
          <DialogTitle>Add Practice Availability</DialogTitle>
          <DialogDescription>
            Mark when you are available for practice. This helps coordinate team practice times.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Range Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isRange"
              checked={isRange}
              onChange={(e) => setIsRange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#800000] focus:ring-[#800000]"
            />
            <Label htmlFor="isRange" className="text-sm font-normal cursor-pointer">
              Add for multiple days (date range)
            </Label>
          </div>

          {/* Date Selection */}
          {!isRange ? (
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setConflictWarning(false);
                }}
                onBlur={handleCheckConflict}
                required
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  min={startDate || format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
            </div>
          )}

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setConflictWarning(false);
                }}
                onBlur={handleCheckConflict}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  setConflictWarning(false);
                }}
                onBlur={handleCheckConflict}
                required
              />
            </div>
          </div>

          {/* Conflict Warning */}
          {conflictWarning && (
            <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 p-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Schedule Conflict</p>
                <p className="text-amber-700 mt-0.5">
                  This availability overlaps with your classes or existing blockers.
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional information..."
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
              disabled={isSubmitting}
              style={{ backgroundColor: '#800000' }}
              className="hover:bg-[#5c0000]"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Availability
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
