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
  attendees?: Array<{
    id: string;
    first_name: string;
    last_name: string;
    gender?: string;
    team_level?: string;
  }>;
  attendee_count?: number;
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

      let eventIds: string[] = [];

      // Coaches and captains see ALL events
      if (profile.role === 'coach' || profile.role === 'captain') {
        // Fetch all events for admins
        const { data: allEventsData, error: allEventsError } = await supabase
          .from('events')
          .select('id');

        if (allEventsError) throw allEventsError;
        eventIds = (allEventsData || []).map(e => e.id);
      } else {
        // Regular players: filter by their team memberships
        const { data: userTeamsData, error: userTeamsError } = await supabase
          .from('user_teams')
          .select('team_id')
          .eq('user_id', profile.id);

        if (userTeamsError) throw userTeamsError;

        const userTeamIds = userTeamsData?.map(ut => ut.team_id) || [];

        if (userTeamIds.length === 0) {
          // User is not on any teams, show no events
          setEvents([]);
          setLoading(false);
          return;
        }

        // Get events that target the user's teams
        const { data: eventTeamsData, error: eventTeamsError } = await supabase
          .from('event_teams')
          .select('event_id')
          .in('team_id', userTeamIds);

        if (eventTeamsError) throw eventTeamsError;

        eventIds = eventTeamsData?.map(et => et.event_id) || [];
      }

      if (eventIds.length === 0) {
        // No events found
        setEvents([]);
        setLoading(false);
        return;
      }

      // Fetch the actual events
      const { data: eventsData, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .in('id', eventIds)
        .order('start_datetime', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      const fetchedEventIds = (eventsData || []).map(e => e.id);

      // Fetch user's RSVPs for these events
      const { data: rsvpsData } = await supabase
        .from('event_responses')
        .select('*')
        .eq('user_id', profile.id)
        .in('event_id', fetchedEventIds);

      // Fetch ALL RSVPs for social proof (attendee avatars)
      const { data: allRsvpsData } = await supabase
        .from('event_responses')
        .select(`
          *,
          users:user_id (
            id,
            first_name,
            last_name,
            gender,
            team_level
          )
        `)
        .in('event_id', fetchedEventIds)
        .eq('response', 'going');

      // Create a map of event_id to user RSVP
      const rsvpMap = new Map(
        (rsvpsData || []).map(rsvp => [rsvp.event_id, rsvp])
      );

      // Create a map of event_id to all attendees going
      const attendeesMap = new Map<string, any[]>();
      (allRsvpsData || []).forEach(rsvp => {
        const eventId = rsvp.event_id;
        if (!attendeesMap.has(eventId)) {
          attendeesMap.set(eventId, []);
        }
        attendeesMap.get(eventId)!.push(rsvp.users);
      });

      // Transform the data to include user's RSVP and attendees
      const eventsWithRsvp = (eventsData || []).map((event: any) => {
        const userRsvp = rsvpMap.get(event.id);
        const attendees = attendeesMap.get(event.id) || [];
        return {
          ...event,
          user_rsvp: userRsvp || undefined,
          attendees, // Array of users who are going
          attendee_count: attendees.length,
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
