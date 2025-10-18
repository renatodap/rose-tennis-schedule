'use client';

/**
 * RideShareCard Component
 * Displays a single ride offer with request/confirm actions
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  MapPin,
  Clock,
  Users,
  Check,
  X,
  MessageSquare,
  UserCheck,
} from 'lucide-react';
import { RideOfferWithDetails } from '@/lib/hooks/useRideShares';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface RideShareCardProps {
  ride: RideOfferWithDetails;
  onRequest?: (rideOfferId: string, notes?: string) => Promise<{ data: any; error: null } | { data: null; error: string }>;
  onConfirm?: (requestId: string) => Promise<{ data: any; error: null } | { data: null; error: string }>;
  onCancelRequest?: (requestId: string) => Promise<{ error: null } | { error: string }>;
  onCancelOffer?: (rideOfferId: string) => Promise<{ error: null } | { error: string }>;
}

export function RideShareCard({
  ride,
  onRequest,
  onConfirm,
  onCancelRequest,
  onCancelOffer,
}: RideShareCardProps) {
  const { user } = useAuth();
  const [isRequesting, setIsRequesting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const isDriver = ride.driver_id === user?.id;
  const confirmedRequests = ride.requests?.filter((r) => r.status === 'confirmed') || [];
  const pendingRequests = ride.requests?.filter((r) => r.status === 'pending') || [];
  const myRequest = ride.requests?.find((r) => r.passenger_id === user?.id);
  const spotsLeft = ride.capacity - confirmedRequests.length;

  const handleRequest = async () => {
    if (!onRequest) return;
    setIsRequesting(true);
    await onRequest(ride.id);
    setIsRequesting(false);
  };

  const handleCancelOffer = async () => {
    if (!onCancelOffer) return;
    setIsCancelling(true);
    await onCancelOffer(ride.id);
    setIsCancelling(false);
  };

  const getStatusBadge = () => {
    if (ride.status === 'full') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Full
        </span>
      );
    }
    if (ride.status === 'cancelled') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Car className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {ride.driver.first_name} {ride.driver.last_name}
            </h3>
            <p className="text-sm text-gray-500">Driver</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>From: {ride.departure_location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>
            Leaving:{' '}
            {new Date(ride.departure_time).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </span>
        </div>

        {ride.return_time && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>
              Returning:{' '}
              {new Date(ride.return_time).toLocaleString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>
            Capacity: {confirmedRequests.length} / {ride.capacity}
          </span>
        </div>

        {ride.notes && (
          <div className="flex items-start gap-2 text-sm text-gray-600 mt-3">
            <MessageSquare className="w-4 h-4 mt-0.5" />
            <span>{ride.notes}</span>
          </div>
        )}
      </div>

      {/* Confirmed Passengers */}
      {confirmedRequests.length > 0 && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-900">
              Confirmed Passengers
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {confirmedRequests.map((req) => (
              <span
                key={req.id}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-white text-green-800"
              >
                {req.passenger.first_name} {req.passenger.last_name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pending Requests (driver view) */}
      {isDriver && pendingRequests.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="text-sm font-semibold text-amber-900 mb-2">
            Pending Requests ({pendingRequests.length})
          </div>
          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between bg-white p-2 rounded"
              >
                <span className="text-sm text-gray-700">
                  {req.passenger.first_name} {req.passenger.last_name}
                </span>
                {onConfirm && spotsLeft > 0 && (
                  <Button
                    size="sm"
                    onClick={() => onConfirm(req.id)}
                    className="h-7 text-xs"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Confirm
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-4">
        {/* Non-driver can request ride */}
        {!isDriver && !myRequest && ride.status === 'active' && spotsLeft > 0 && onRequest && (
          <Button
            onClick={handleRequest}
            disabled={isRequesting}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="default"
          >
            <Users className="w-4 h-4 mr-2" />
            {isRequesting ? 'Sending Request...' : 'Request a Spot'}
          </Button>
        )}

        {/* Ride is full */}
        {!isDriver && !myRequest && ride.status === 'active' && spotsLeft === 0 && (
          <div className="w-full text-center p-3 bg-gray-100 rounded-lg text-sm text-gray-700 font-medium">
            This ride is full
          </div>
        )}

        {/* Show my request status */}
        {myRequest && myRequest.status === 'pending' && (
          <div className="w-full">
            <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-sm font-medium text-amber-900 mb-1">Request Pending</div>
              <p className="text-xs text-amber-700">
                Waiting for {ride.driver.first_name} to confirm your spot
              </p>
            </div>
            {onCancelRequest && (
              <Button
                onClick={() => onCancelRequest(myRequest.id)}
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-gray-600"
              >
                Cancel Request
              </Button>
            )}
          </div>
        )}

        {myRequest && myRequest.status === 'confirmed' && (
          <div className="w-full text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-green-900 mb-1">
              <Check className="w-4 h-4" />
              Spot Confirmed!
            </div>
            <p className="text-xs text-green-700">
              You&apos;re riding with {ride.driver.first_name}
            </p>
          </div>
        )}

        {/* Driver view - more prominent */}
        {isDriver && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Car className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-semibold text-blue-900">You&apos;re the driver</span>
            </div>
            {pendingRequests.length > 0 && (
              <p className="text-xs text-blue-700 mb-3">
                You have {pendingRequests.length} pending {pendingRequests.length === 1 ? 'request' : 'requests'}
              </p>
            )}
            {ride.status !== 'cancelled' && onCancelOffer && (
              <Button
                onClick={handleCancelOffer}
                disabled={isCancelling}
                variant="outline"
                size="sm"
                className="w-full border-red-300 text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                {isCancelling ? 'Cancelling...' : 'Cancel This Ride Offer'}
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
