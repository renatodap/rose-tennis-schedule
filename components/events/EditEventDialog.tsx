'use client';

/**
 * Edit Event Dialog for coaches and captains
 * Form to update existing events with delete functionality
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useEventManagement, UpdateEventData } from '@/lib/hooks/useEventManagement';
import { Event } from '@/lib/hooks/useEvents';
import { Loader2, Trash2 } from 'lucide-react';
import { dateTimeLocalToISO, isoToDateTimeLocal } from '@/lib/utils/time';

interface EditEventDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventUpdated?: () => void;
  onEventDeleted?: () => void;
}

export function EditEventDialog({
  event,
  open,
  onOpenChange,
  onEventUpdated,
  onEventDeleted,
}: EditEventDialogProps) {
  const { updateEvent, deleteEvent, loading } = useEventManagement();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<UpdateEventData>({
    id: '',
    title: '',
    description: '',
    start_datetime: '',
    end_datetime: '',
    location: '',
    event_type: 'optional',
    applies_to_men: true,
    applies_to_women: true,
    applies_to_jv: true,
    applies_to_varsity: true,
  });

  useEffect(() => {
    if (event && open) {
      // Convert ISO datetime from DB to datetime-local format for input fields
      setFormData({
        id: event.id,
        title: event.title,
        description: event.description || '',
        start_datetime: isoToDateTimeLocal(event.start_datetime),
        end_datetime: isoToDateTimeLocal(event.end_datetime),
        location: event.location || '',
        event_type: event.event_type,
        applies_to_men: event.applies_to_men,
        applies_to_women: event.applies_to_women,
        applies_to_jv: event.applies_to_jv,
        applies_to_varsity: event.applies_to_varsity,
      });
    }
  }, [event, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least one team is selected
    if (!formData.applies_to_men && !formData.applies_to_women) {
      alert('Please select at least one gender');
      return;
    }

    if (!formData.applies_to_jv && !formData.applies_to_varsity) {
      alert('Please select at least one team level');
      return;
    }

    // Convert datetime-local to ISO for storage
    const eventDataForSubmit: UpdateEventData = {
      ...formData,
      start_datetime: formData.start_datetime ? dateTimeLocalToISO(formData.start_datetime) : undefined,
      end_datetime: formData.end_datetime ? dateTimeLocalToISO(formData.end_datetime) : undefined,
    };

    const success = await updateEvent(eventDataForSubmit);

    if (success) {
      onOpenChange(false);
      onEventUpdated?.();
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    const success = await deleteEvent(event.id);

    if (success) {
      setShowDeleteDialog(false);
      onOpenChange(false);
      onEventDeleted?.();
    }
  };

  if (!event) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update event details or delete the event.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="edit-title">
                Event Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Team Practice, Match vs. DePauw"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional event details..."
                rows={4}
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start_datetime">
                  Start Date & Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-start_datetime"
                  type="datetime-local"
                  value={formData.start_datetime}
                  onChange={(e) => setFormData({ ...formData, start_datetime: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-end_datetime">
                  End Date & Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-end_datetime"
                  type="datetime-local"
                  value={formData.end_datetime}
                  onChange={(e) => setFormData({ ...formData, end_datetime: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Indoor Tennis Center, Court 1"
              />
            </div>

            {/* Event Type */}
            <div className="space-y-2">
              <Label>
                Event Type <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={formData.event_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, event_type: value as 'optional' | 'recommended' | 'mandatory' })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mandatory" id="edit-mandatory" />
                  <Label htmlFor="edit-mandatory" className="font-normal cursor-pointer">
                    Mandatory - Required attendance
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recommended" id="edit-recommended" />
                  <Label htmlFor="edit-recommended" className="font-normal cursor-pointer">
                    Recommended - Strongly encouraged
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="optional" id="edit-optional" />
                  <Label htmlFor="edit-optional" className="font-normal cursor-pointer">
                    Optional - Not required
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Applies To - Gender */}
            <div className="space-y-2">
              <Label>
                Applies To (Gender) <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-applies_to_men"
                    checked={formData.applies_to_men}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, applies_to_men: checked as boolean })
                    }
                  />
                  <Label htmlFor="edit-applies_to_men" className="font-normal cursor-pointer">
                    Men&apos;s Team
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-applies_to_women"
                    checked={formData.applies_to_women}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, applies_to_women: checked as boolean })
                    }
                  />
                  <Label htmlFor="edit-applies_to_women" className="font-normal cursor-pointer">
                    Women&apos;s Team
                  </Label>
                </div>
              </div>
            </div>

            {/* Applies To - Level */}
            <div className="space-y-2">
              <Label>
                Applies To (Level) <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-applies_to_jv"
                    checked={formData.applies_to_jv}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, applies_to_jv: checked as boolean })
                    }
                  />
                  <Label htmlFor="edit-applies_to_jv" className="font-normal cursor-pointer">
                    JV
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-applies_to_varsity"
                    checked={formData.applies_to_varsity}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, applies_to_varsity: checked as boolean })
                    }
                  />
                  <Label htmlFor="edit-applies_to_varsity" className="font-normal cursor-pointer">
                    Varsity
                  </Label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={loading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Event
              </Button>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Event
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event &quot;{event.title}&quot; and all associated RSVPs.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
