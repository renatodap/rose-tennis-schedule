'use client';

/**
 * Hook for managing RSVP responses to events
 * Handles creating and updating event responses with optimistic updates
 */

import { useState, useCallback } from 'react';
import { getClient } from '../supabase/client';
import { useUser } from './useUser';
import { toast } from './use-toast';
import { getCurrentDateTimeISO } from '@/lib/utils/time';

export type RsvpResponse = 'going' | 'not_going' | 'maybe' | 'no_response';

/**
 * Hook for managing event RSVP
 */
export function useEventRsvp() {
  const { profile } = useUser();
  const [updating, setUpdating] = useState(false);
  const supabase = getClient();

  /**
   * Update or create RSVP response for an event
   */
  const updateRsvp = useCallback(async (eventId: string, response: RsvpResponse) => {
    if (!profile) {
      toast({
        title: 'Error',
        description: 'You must be logged in to RSVP',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setUpdating(true);

      const { error } = await supabase
        .from('event_responses')
        .upsert({
          event_id: eventId,
          user_id: profile.id,
          response,
          response_datetime: getCurrentDateTimeISO(),
        }, {
          onConflict: 'event_id,user_id',
        });

      if (error) {
        throw error;
      }

      // Show success message
      const responseLabels = {
        going: 'Going',
        not_going: 'Not Going',
        maybe: 'Maybe',
        no_response: 'No Response',
      };

      toast({
        title: 'RSVP Updated',
        description: `You marked yourself as "${responseLabels[response]}"`,
      });

      return true;
    } catch (err) {
      console.error('Error updating RSVP:', err);
      toast({
        title: 'Error',
        description: 'Failed to update RSVP. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setUpdating(false);
    }
  }, [profile, supabase]);

  /**
   * Get RSVP for a specific event
   */
  const getRsvp = useCallback(async (eventId: string) => {
    if (!profile) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('event_responses')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', profile.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Error fetching RSVP:', err);
      return null;
    }
  }, [profile, supabase]);

  return {
    updateRsvp,
    getRsvp,
    updating,
  };
}
