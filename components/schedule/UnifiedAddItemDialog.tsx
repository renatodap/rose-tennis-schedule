'use client';

/**
 * Unified Add Item Dialog
 * ONE dialog to add classes, availability, or blockers with multi-day selection
 */

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils/cn';
import { BRAND_COLORS } from '@/lib/constants';
import { GraduationCap, Clock, Ban } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type ItemType = 'class' | 'availability' | 'blocker';

interface UnifiedAddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    type: ItemType;
    days?: number[]; // For multi-day items (0 = Sunday)
    date?: string; // For single-day items
    dateRange?: { start: string; end: string }; // For date ranges
    startTime: string;
    endTime: string;
    courseName?: string;
    location?: string;
    quarter?: string;
    reason?: string;
    notes?: string;
    isRecurring?: boolean;
  }) => Promise<void>;
  initialDayOfWeek?: number;
  initialDate?: string;
  initialTime?: string;
  initialType?: ItemType;
}

const DAYS_OF_WEEK = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

const QUARTER_OPTIONS = [
  { label: 'Fall 2025', value: 'fall_2025' },
  { label: 'Winter 2025-26', value: 'winter_2025_26' },
  { label: 'Spring 2026', value: 'spring_2026' },
  { label: 'Summer 2026', value: 'summer_2026' },
];

export function UnifiedAddItemDialog({
  open,
  onOpenChange,
  onSave,
  initialDayOfWeek,
  initialDate,
  initialTime = '09:00',
  initialType = 'class',
}: UnifiedAddItemDialogProps) {
  // Type selection
  const [itemType, setItemType] = useState<ItemType>(initialType);

  // Multi-day selection (for classes and recurring items)
  const [selectedDays, setSelectedDays] = useState<number[]>(
    initialDayOfWeek !== undefined ? [initialDayOfWeek] : []
  );

  // Date selection (for single/range items)
  const [singleDate, setSingleDate] = useState(initialDate || '');
  const [isDateRange, setIsDateRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Time selection
  const [startTime, setStartTime] = useState(initialTime);
  const [endTime, setEndTime] = useState('10:00');

  // Class-specific fields
  const [courseName, setCourseName] = useState('');
  const [location, setLocation] = useState('');
  const [quarter, setQuarter] = useState('fall_2025');

  // Availability/Blocker fields
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  // UI state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setItemType(initialType);
      setSelectedDays(initialDayOfWeek !== undefined ? [initialDayOfWeek] : []);
      setSingleDate(initialDate || '');
      setStartTime(initialTime);
      setEndTime('10:00');
      setCourseName('');
      setLocation('');
      setQuarter('fall_2025');
      setReason('');
      setNotes('');
      setIsRecurring(false);
      setIsDateRange(false);
      setStartDate('');
      setEndDate('');
      setError('');
    }
  }, [open, initialDayOfWeek, initialDate, initialTime, initialType]);

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const handleSave = async () => {
    // Validation
    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    if (itemType === 'class') {
      if (selectedDays.length === 0) {
        setError('Please select at least one day');
        return;
      }
    } else {
      if (!isRecurring && !isDateRange && !singleDate) {
        setError('Please select a date');
        return;
      }
      if (isDateRange && (!startDate || !endDate)) {
        setError('Please select both start and end dates');
        return;
      }
      if (isRecurring && selectedDays.length === 0) {
        setError('Please select at least one day for recurring item');
        return;
      }
    }

    setError('');
    setLoading(true);

    try {
      await onSave({
        type: itemType,
        days: (itemType === 'class' || isRecurring) ? selectedDays : undefined,
        date: (!isRecurring && !isDateRange) ? singleDate : undefined,
        dateRange: isDateRange ? { start: startDate, end: endDate } : undefined,
        startTime,
        endTime,
        courseName: itemType === 'class' ? courseName.trim() || undefined : undefined,
        location: itemType === 'class' ? location.trim() || undefined : undefined,
        quarter: itemType === 'class' ? quarter : undefined,
        reason: itemType === 'blocker' ? reason.trim() || undefined : undefined,
        notes: notes.trim() || undefined,
        isRecurring,
      });

      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (itemType) {
      case 'class':
        return 'Add Class';
      case 'availability':
        return 'Add Availability';
      case 'blocker':
        return 'Add Blocker';
    }
  };

  const getButtonText = () => {
    if (loading) return 'Saving...';
    switch (itemType) {
      case 'class':
        return selectedDays.length > 1 ? `Add Class (${selectedDays.length} days)` : 'Add Class';
      case 'availability':
        return 'Add Availability';
      case 'blocker':
        return 'Add Blocker';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Type Selector */}
          <div className="grid gap-2">
            <Label>What would you like to add?</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all',
                  itemType === 'class'
                    ? 'border-[#800000] bg-[#80000010]'
                    : 'border-gray-200 hover:border-gray-300'
                )}
                onClick={() => setItemType('class')}
              >
                <GraduationCap className={cn('h-6 w-6 mb-2', itemType === 'class' ? 'text-[#800000]' : 'text-gray-400')} />
                <span className={cn('text-sm font-medium', itemType === 'class' ? 'text-[#800000]' : 'text-gray-600')}>
                  Class
                </span>
              </button>

              <button
                type="button"
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all',
                  itemType === 'availability'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
                onClick={() => setItemType('availability')}
              >
                <Clock className={cn('h-6 w-6 mb-2', itemType === 'availability' ? 'text-green-600' : 'text-gray-400')} />
                <span className={cn('text-sm font-medium', itemType === 'availability' ? 'text-green-600' : 'text-gray-600')}>
                  Available
                </span>
              </button>

              <button
                type="button"
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all',
                  itemType === 'blocker'
                    ? 'border-orange-600 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
                onClick={() => setItemType('blocker')}
              >
                <Ban className={cn('h-6 w-6 mb-2', itemType === 'blocker' ? 'text-orange-600' : 'text-gray-400')} />
                <span className={cn('text-sm font-medium', itemType === 'blocker' ? 'text-orange-600' : 'text-gray-600')}>
                  Blocker
                </span>
              </button>
            </div>
          </div>

          {/* CLASS: Quarter Selection */}
          {itemType === 'class' && (
            <div className="grid gap-2">
              <Label htmlFor="quarter">Quarter</Label>
              <Select value={quarter} onValueChange={setQuarter}>
                <SelectTrigger id="quarter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUARTER_OPTIONS.map(q => (
                    <SelectItem key={q.value} value={q.value}>{q.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Day Selection (for classes OR recurring items) */}
          {(itemType === 'class' || isRecurring) && (
            <div className="grid gap-2">
              <Label>Days of Week</Label>
              <div className="grid grid-cols-7 gap-1">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    className={cn(
                      'min-h-[44px] px-2 py-2 text-sm font-medium rounded-md border-2 transition-all',
                      selectedDays.includes(day.value)
                        ? 'text-white border-transparent'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    )}
                    style={
                      selectedDays.includes(day.value)
                        ? { backgroundColor: BRAND_COLORS.PRIMARY }
                        : undefined
                    }
                    onClick={() => toggleDay(day.value)}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                {selectedDays.length > 0
                  ? `Selected ${selectedDays.length} day${selectedDays.length > 1 ? 's' : ''}`
                  : 'Select one or more days'}
              </p>
            </div>
          )}

          {/* Date Selection (for non-recurring availability/blockers) */}
          {itemType !== 'class' && !isRecurring && (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDateRange"
                  checked={isDateRange}
                  onChange={(e) => setIsDateRange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#800000] focus:ring-[#800000]"
                />
                <Label htmlFor="isDateRange" className="text-sm font-normal cursor-pointer">
                  Add for multiple days (date range)
                </Label>
              </div>

              {!isDateRange ? (
                <div className="grid gap-2">
                  <Label htmlFor="singleDate">Date</Label>
                  <Input
                    id="singleDate"
                    type="date"
                    value={singleDate}
                    onChange={(e) => setSingleDate(e.target.value)}
                    className="h-12"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      className="h-12"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Recurring Toggle (for availability/blockers only) */}
          {itemType !== 'class' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#800000] focus:ring-[#800000]"
              />
              <Label htmlFor="isRecurring" className="text-sm font-normal cursor-pointer">
                Recurring (repeat weekly on selected days)
              </Label>
            </div>
          )}

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
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
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
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

          {/* CLASS: Course Name & Location */}
          {itemType === 'class' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="courseName">Course Name (Optional)</Label>
                <Input
                  id="courseName"
                  type="text"
                  placeholder="e.g., MA 111 - Calculus I"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="h-12"
                />
              </div>

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
            </>
          )}

          {/* BLOCKER: Reason */}
          {itemType === 'blocker' && (
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Input
                id="reason"
                type="text"
                placeholder="e.g., Doctor appointment, Study time"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="h-12"
              />
            </div>
          )}

          {/* AVAILABILITY/BLOCKER: Notes */}
          {itemType !== 'class' && (
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional information..."
                rows={3}
              />
            </div>
          )}

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
            {getButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
