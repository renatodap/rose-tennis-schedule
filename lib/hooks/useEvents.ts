'use client';

/**
 * Hook for fetching events visible to the current user
 * Filters events based on user's gender and team level
 */

import { useEffect, useState, useCallback } from 'react';
import { getClient } from '../supabase/client';
import { useUser } from './useUser';
import { getCurrentDateTimeISO } from '@/lib/utils/time';

export interface Event {
  id: string;
  title: string;
  description: string | null;
  start_datetime: string;
  end_datetime: string;
  location: string | null;
  event_type: 'optional' | 'recommended' | 'mandatory';
  applies_to_men: boolean;
  applies_to_women: boolean;
  applies_to_jv: boolean;
  applies_to_varsity: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EventWithRsvp extends Event {
  user_rsvp?: {
    response: 'going' | 'not_going' | 'maybe' | 'no_response';
    response_datetime: string | null;
  };
}

/**
 * Hook for accessing events visible to current user
 * Automatically filters based on user's gender and team level
 */
export function useEvents() {
  const { profile } = useUser();
  const [events, setEvents] = useState<EventWithRsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = getClient();

  const fetchEvents = useCallback(async () => {
    if (!profile) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build the query to filter events based on user's attributes
      let query = supabase
        .from('events')
        .select('*')
        .order('start_datetime', { ascending: true });

      // Filter by gender
      if (profile.gender === 'men') {
        query = query.eq('applies_to_men', true);
      } else if (profile.gender === 'women') {
        query = query.eq('applies_to_women', true);
      }

      // Filter by team level
      if (profile.team_level === 'jv') {
        query = query.eq('applies_to_jv', true);
      } else if (profile.team_level === 'varsity') {
        query = query.eq('applies_to_varsity', true);
      }

      const { data: eventsData, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Fetch user's RSVPs for these events
      const eventIds = (eventsData || []).map(e => e.id);
      const { data: rsvpsData } = await supabase
        .from('event_responses')
        .select('*')
        .eq('user_id', profile.id)
        .in('event_id', eventIds);

      // Create a map of event_id to RSVP
      const rsvpMap = new Map(
        (rsvpsData || []).map(rsvp => [rsvp.event_id, rsvp])
      );

      // Transform the data to include user's RSVP
      const eventsWithRsvp = (eventsData || []).map((event: any) => {
        const userRsvp = rsvpMap.get(event.id);
        return {
          ...event,
          user_rsvp: userRsvp || undefined,
        };
      });

      setEvents(eventsWithRsvp);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [profile, supabase]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  /**
   * Get upcoming events (start_datetime >= now)
   */
  const getUpcomingEvents = useCallback(() => {
    const now = getCurrentDateTimeISO();
    return events.filter(event => event.start_datetime >= now);
  }, [events]);

  /**
   * Get past events (start_datetime < now)
   */
  const getPastEvents = useCallback(() => {
    const now = getCurrentDateTimeISO();
    return events.filter(event => event.start_datetime < now);
  }, [events]);

  /**
   * Get events user has responded to
   */
  const getMyRsvps = useCallback(() => {
    return events.filter(event =>
      event.user_rsvp && event.user_rsvp.response !== 'no_response'
    );
  }, [events]);

  /**
   * Get events by RSVP response type
   */
  const getEventsByResponse = useCallback((response: 'going' | 'not_going' | 'maybe') => {
    return events.filter(event => event.user_rsvp?.response === response);
  }, [events]);

  return {
    events,
    loading,
    error,
    refresh: fetchEvents,
    getUpcomingEvents,
    getPastEvents,
    getMyRsvps,
    getEventsByResponse,
  };
}
