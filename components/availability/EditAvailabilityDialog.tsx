'use client';

/**
 * Dialog for editing or deleting existing practice availability
 */

import { useState, useEffect } from 'react';
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
import { PracticeAvailability } from '@/lib/types/database.types';
import { Loader2, Trash2 } from 'lucide-react';

interface EditAvailabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availability: PracticeAvailability | null;
}

export function EditAvailabilityDialog({
  open,
  onOpenChange,
  availability,
}: EditAvailabilityDialogProps) {
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { updateAvailability, deleteAvailability } = useAvailability();

  // Initialize form when availability changes
  useEffect(() => {
    if (availability) {
      setDate(availability.date);
      setNotes(availability.notes || '');
      setShowDeleteConfirm(false);
    }
  }, [availability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!availability) return;

    setIsSubmitting(true);

    try {
      await updateAvailability(availability.id, {
        date,
        notes: notes || undefined,
      });

      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!availability) return;

    setIsSubmitting(true);

    try {
      const success = await deleteAvailability(availability.id);
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!availability) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Availability</DialogTitle>
          <DialogDescription>
            Update or delete this availability entry
          </DialogDescription>
        </DialogHeader>

        {!showDeleteConfirm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>

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

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
                className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 sm:mr-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: '#800000' }}
                  className="hover:bg-[#5c0000] flex-1 sm:flex-none"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md bg-red-50 border border-red-200 p-4">
              <h3 className="text-sm font-medium text-red-800 mb-1">
                Confirm Deletion
              </h3>
              <p className="text-sm text-red-700">
                Are you sure you want to delete this availability entry? This action cannot be undone.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Availability
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
