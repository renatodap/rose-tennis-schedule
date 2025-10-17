'use client';

/**
 * OfferRideDialog Component
 * Form to offer a ride for an event
 */

import { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRideShares } from '@/lib/hooks/useRideShares';
import { EventWithRsvp } from '@/lib/hooks/useEvents';

interface OfferRideDialogProps {
  event: EventWithRsvp;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OfferRideDialog({
  event,
  open,
  onOpenChange,
}: OfferRideDialogProps) {
  const { createRideOffer } = useRideShares(event.id);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    capacity: 3,
    departure_location: '',
    departure_time: '',
    return_time: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const offerData = {
      event_id: event.id,
      capacity: formData.capacity,
      departure_location: formData.departure_location,
      departure_time: formData.departure_time,
      return_time: formData.return_time || undefined,
      notes: formData.notes || undefined,
    };

    const { error } = await createRideOffer(offerData);

    if (!error) {
      // Success confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#10B981', '#F59E0B'],
      });

      // Reset form
      setFormData({
        capacity: 3,
        departure_location: '',
        departure_time: '',
        return_time: '',
        notes: '',
      });

      onOpenChange(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Offer a Ride 🚗</DialogTitle>
          <DialogDescription>
            Help teammates get to {event.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Capacity */}
          <div>
            <Label htmlFor="capacity">How many passengers can you take?</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFormData({ ...formData, capacity: num })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.capacity === num
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl font-bold">{num}</div>
                  <div className="text-xs text-gray-500">
                    {num === 1 ? 'person' : 'people'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Departure Location */}
          <div>
            <Label htmlFor="departure_location">Departure Location *</Label>
            <Input
              id="departure_location"
              type="text"
              placeholder="e.g., Apartment Complex, Main Campus, etc."
              value={formData.departure_location}
              onChange={(e) =>
                setFormData({ ...formData, departure_location: e.target.value })
              }
              required
              className="mt-1"
            />
          </div>

          {/* Departure Time */}
          <div>
            <Label htmlFor="departure_time">Departure Time *</Label>
            <Input
              id="departure_time"
              type="datetime-local"
              value={formData.departure_time}
              onChange={(e) =>
                setFormData({ ...formData, departure_time: e.target.value })
              }
              required
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Event starts at{' '}
              {new Date(event.start_datetime).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Return Time */}
          <div>
            <Label htmlFor="return_time">Return Time (Optional)</Label>
            <Input
              id="return_time"
              type="datetime-local"
              value={formData.return_time}
              onChange={(e) =>
                setFormData({ ...formData, return_time: e.target.value })
              }
              className="mt-1"
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="e.g., Meeting at parking lot B, call when ready, etc."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Offering...' : 'Offer Ride'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
