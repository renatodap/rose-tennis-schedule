/**
 * Custom Hook: useRideShares
 * Manages ride share data and operations
 */

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { RideOffer, RideRequest, User } from '@/lib/types/database.types';
import { useAuth } from './useAuth';

export interface RideOfferWithDetails extends RideOffer {
  driver: User;
  requests: (RideRequest & { passenger: User })[];
}

export function useRideShares(eventId?: string) {
  const { user } = useAuth();
  const [rideOffers, setRideOffers] = useState<RideOfferWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchRideOffers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('ride_offers')
        .select(`
          *,
          driver:users!ride_offers_driver_id_fkey(*),
          requests:ride_requests(
            *,
            passenger:users!ride_requests_passenger_id_fkey(*)
          )
        `)
        .order('departure_time', { ascending: true });

      if (eventId) {
        query = query.eq('event_id', eventId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRideOffers(data as RideOfferWithDetails[]);
    } catch (err) {
      console.error('Error fetching ride offers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load rides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchRideOffers();

      // Subscribe to real-time updates
      const channel = supabase
        .channel(`ride-offers-${eventId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'ride_offers',
            filter: `event_id=eq.${eventId}`,
          },
          () => {
            fetchRideOffers();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'ride_requests',
          },
          () => {
            fetchRideOffers();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [eventId]);

  // Filter ride offers
  const availableRides = rideOffers.filter((r) => r.status === 'active');
  const myOfferedRides = rideOffers.filter((r) => r.driver_id === user?.id);

  // Create ride offer
  const createRideOffer = async (offerData: {
    event_id: string;
    capacity: number;
    departure_location: string;
    departure_time: string;
    return_time?: string;
    notes?: string;
  }) => {
    try {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('ride_offers')
        .insert({
          driver_id: user.id,
          ...offerData,
        })
        .select(`
          *,
          driver:users!ride_offers_driver_id_fkey(*),
          requests:ride_requests(
            *,
            passenger:users!ride_requests_passenger_id_fkey(*)
          )
        `)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Error creating ride offer:', err);
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to create ride offer',
      };
    }
  };

  // Request ride
  const requestRide = async (rideOfferId: string, notes?: string) => {
    try {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('ride_requests')
        .insert({
          ride_offer_id: rideOfferId,
          passenger_id: user.id,
          status: 'pending',
          notes,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Error requesting ride:', err);
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to request ride',
      };
    }
  };

  // Confirm ride request (driver action)
  const confirmRequest = async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('ride_requests')
        .update({ status: 'confirmed' })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Error confirming request:', err);
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to confirm request',
      };
    }
  };

  // Cancel ride request
  const cancelRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('ride_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      console.error('Error cancelling request:', err);
      return {
        error: err instanceof Error ? err.message : 'Failed to cancel request',
      };
    }
  };

  // Cancel ride offer
  const cancelRideOffer = async (offerId: string) => {
    try {
      const { error } = await supabase
        .from('ride_offers')
        .update({ status: 'cancelled' })
        .eq('id', offerId);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      console.error('Error cancelling ride offer:', err);
      return {
        error: err instanceof Error ? err.message : 'Failed to cancel ride offer',
      };
    }
  };

  return {
    rideOffers,
    availableRides,
    myOfferedRides,
    loading,
    error,
    createRideOffer,
    requestRide,
    confirmRequest,
    cancelRequest,
    cancelRideOffer,
    refresh: fetchRideOffers,
  };
}
