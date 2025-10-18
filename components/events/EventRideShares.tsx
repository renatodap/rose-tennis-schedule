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
    <div className="space-y-4">
      {/* Header with prominent CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Car className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                Ride Sharing Available
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {availableRides.length === 0
                  ? "Need a ride? Offer one to help teammates get to the event!"
                  : `${availableRides.length} ${availableRides.length === 1 ? 'ride is' : 'rides are'} available. Request a spot or offer your own!`
                }
              </p>
              <Button
                size="sm"
                onClick={() => setShowOfferDialog(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Offer a Ride
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Rides List */}
      {availableRides.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Car className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-sm font-medium text-gray-900 mb-1">No ride offers yet</p>
          <p className="text-xs text-gray-500 mb-4">
            Be the first to offer a ride and help your teammates!
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowOfferDialog(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Offer a Ride
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-gray-700 px-1">
            Available Rides ({availableRides.length})
          </h5>
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
