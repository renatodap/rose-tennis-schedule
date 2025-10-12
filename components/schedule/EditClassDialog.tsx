'use client';

/**
 * EditClassDialog component - form for editing or deleting an existing class
 * Similar to AddClassDialog but with delete functionality and pre-populated data
 */

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';
import { BRAND_COLORS } from '@/lib/constants';
import { Trash2 } from 'lucide-react';

export interface ClassSchedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  courseName?: string;
  location?: string;
}

interface EditClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: ClassSchedule | null;
  onUpdate: (id: string, data: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    courseName?: string;
    location?: string;
  }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function EditClassDialog({
  open,
  onOpenChange,
  classData,
  onUpdate,
  onDelete,
}: EditClassDialogProps) {
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [courseName, setCourseName] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Populate form when classData changes
  useEffect(() => {
    if (classData) {
      setDayOfWeek(classData.dayOfWeek);
      setStartTime(classData.startTime);
      setEndTime(classData.endTime);
      setCourseName(classData.courseName || '');
      setLocation(classData.location || '');
      setError('');
      setShowDeleteConfirm(false);
    }
  }, [classData]);

  const handleUpdate = async () => {
    if (!classData) return;

    // Validate
    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await onUpdate(classData.id, {
        dayOfWeek,
        startTime,
        endTime,
        courseName: courseName.trim() || undefined,
        location: location.trim() || undefined,
      });

      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update class');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!classData) return;

    setLoading(true);
    setError('');

    try {
      await onDelete(classData.id);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete class');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!classData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
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

          {/* Delete confirmation */}
          {showDeleteConfirm && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800 mb-2">Are you sure you want to delete this class?</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleDelete}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading || showDeleteConfirm}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 sm:mr-auto"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={loading}
              style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
              className="text-white hover:opacity-90 flex-1 sm:flex-none"
            >
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
