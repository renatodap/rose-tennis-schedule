'use client';

/**
 * EventRideShares Component
 * Shows ride shares for a specific event
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Car, Plus } from 'lucide-react';
import { useRideShares } from '@/lib/hooks/useRideShares';
import { RideShareCard } from '@/components/rides/RideShareCard';
import { OfferRideDialog } from '@/components/rides/OfferRideDialog';
import { EventWithRsvp } from '@/lib/hooks/useEvents';
import { Loader2 } from 'lucide-react';

interface EventRideSharesProps {
  event: EventWithRsvp;
}

export function EventRideShares({ event }: EventRideSharesProps) {
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const {
    availableRides,
    loading,
    requestRide,
    confirmRequest,
    cancelRequest,
    cancelRideOffer,
  } = useRideShares(event.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-gray-600" />
          <h4 className="font-semibold text-gray-900">
            Ride Shares ({availableRides.length})
          </h4>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowOfferDialog(true)}
          className="text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Offer Ride
        </Button>
      </div>

      {availableRides.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Car className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">No ride offers yet</p>
          <p className="text-xs text-gray-500">Be the first to offer a ride!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {availableRides.map((ride) => (
            <RideShareCard
              key={ride.id}
              ride={ride}
              onRequest={requestRide}
              onConfirm={confirmRequest}
              onCancelRequest={cancelRequest}
              onCancelOffer={cancelRideOffer}
            />
          ))}
        </div>
      )}

      <OfferRideDialog
        event={event}
        open={showOfferDialog}
        onOpenChange={setShowOfferDialog}
      />
    </div>
  );
}
