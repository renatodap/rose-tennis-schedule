'use client';

/**
 * Hook for event management (coaches and captains only)
 * Provides functions to create, update, delete events and view RSVPs
 */

import { useState, useCallback } from 'react';
import { getClient } from '../supabase/client';
import { useUser } from './useUser';
import { toast } from './use-toast';
import { Event } from './useEvents';

export interface CreateEventData {
  title: string;
  description?: string;
  start_datetime: string;
  end_datetime: string;
  location?: string;
  event_type: 'optional' | 'recommended' | 'mandatory' | 'match';
  applies_to_men: boolean;
  applies_to_women: boolean;
  applies_to_jv: boolean;
  applies_to_varsity: boolean;
  // Match-specific fields
  opponent?: string;
  home_away?: 'home' | 'away' | 'neutral';
  match_result?: string;
  is_conference_match?: boolean;
  external_url?: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: string;
}

export interface EventRsvpSummary {
  event_id: string;
  going: number;
  not_going: number;
  maybe: number;
  no_response: number;
  total_users: number;
}

export interface UserRsvp {
  user_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  team_level: string;
  response: 'going' | 'not_going' | 'maybe' | 'no_response';
  response_datetime: string | null;
}

/**
 * Hook for event management (admin only)
 */
export function useEventManagement() {
  const { profile } = useUser();
  const [loading, setLoading] = useState(false);
  const supabase = getClient();

  // Check if user has admin permissions
  const isAdmin = profile?.role === 'coach' || profile?.role === 'captain';

  /**
   * Create a new event
   */
  const createEvent = useCallback(async (eventData: CreateEventData, teamIds?: string[]) => {
    if (!profile || !isAdmin) {
      toast({
        title: 'Permission Denied',
        description: 'Only coaches and captains can create events',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          created_by: profile.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Create event_teams entries if teamIds provided
      if (teamIds && teamIds.length > 0) {
        const eventTeams = teamIds.map(teamId => ({
          event_id: data.id,
          team_id: teamId,
        }));

        const { error: teamsError } = await supabase
          .from('event_teams')
          .insert(eventTeams);

        if (teamsError) {
          console.error('Error creating event teams:', teamsError);
          // Don't fail the whole operation
        }
      }

      // Send email notifications to eligible users
      try {
        const response = await fetch('/api/email/send-event-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ eventId: data.id }),
        });

        if (response.ok) {
          const result = await response.json();
          toast({
            title: 'Event Created',
            description: `"${eventData.title}" has been created and ${result.emailsSent || 0} notification(s) sent`,
          });
        } else {
          toast({
            title: 'Event Created',
            description: `"${eventData.title}" has been created (email notifications may have failed)`,
          });
        }
      } catch (emailError) {
        console.error('Error sending email notifications:', emailError);
        toast({
          title: 'Event Created',
          description: `"${eventData.title}" has been created (email notifications failed)`,
        });
      }

      return data as Event;
    } catch (err) {
      console.error('Error creating event:', err);
      toast({
        title: 'Error',
        description: 'Failed to create event. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [profile, isAdmin, supabase]);

  /**
   * Update an existing event
   */
  const updateEvent = useCallback(async (eventData: UpdateEventData) => {
    if (!profile || !isAdmin) {
      toast({
        title: 'Permission Denied',
        description: 'Only coaches and captains can update events',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setLoading(true);

      const { id, ...updateFields } = eventData;

      const { error } = await supabase
        .from('events')
        .update(updateFields)
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Event Updated',
        description: 'Event has been updated successfully',
      });

      return true;
    } catch (err) {
      console.error('Error updating event:', err);
      toast({
        title: 'Error',
        description: 'Failed to update event. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [profile, isAdmin, supabase]);

  /**
   * Delete an event
   */
  const deleteEvent = useCallback(async (eventId: string) => {
    if (!profile || !isAdmin) {
      toast({
        title: 'Permission Denied',
        description: 'Only coaches and captains can delete events',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Event Deleted',
        description: 'Event has been deleted successfully',
      });

      return true;
    } catch (err) {
      console.error('Error deleting event:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete event. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [profile, isAdmin, supabase]);

  /**
   * Get all events (admin view - no filtering)
   */
  const getAllEvents = useCallback(async () => {
    if (!profile || !isAdmin) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_datetime', { ascending: true });

      if (error) {
        throw error;
      }

      return data as Event[];
    } catch (err) {
      console.error('Error fetching all events:', err);
      return [];
    }
  }, [profile, isAdmin, supabase]);

  /**
   * Get RSVP summary for an event
   */
  const getRsvpSummary = useCallback(async (eventId: string): Promise<EventRsvpSummary | null> => {
    if (!profile || !isAdmin) {
      return null;
    }

    try {
      // Get eligible users by joining event_teams with user_teams
      const { data: eligibleUsers, error: usersError } = await supabase
        .from('event_teams')
        .select(`
          team_id,
          user_teams!inner(user_id)
        `)
        .eq('event_id', eventId);

      if (usersError) {
        throw usersError;
      }

      // Extract unique user IDs
      const uniqueUserIds = new Set(
        eligibleUsers?.flatMap((et: any) => et.user_teams.map((ut: any) => ut.user_id)) || []
      );
      const totalUsers = uniqueUserIds.size;

      // Get all responses for this event
      const { data: responses, error: responsesError } = await supabase
        .from('event_responses')
        .select('response')
        .eq('event_id', eventId);

      if (responsesError) {
        throw responsesError;
      }

      // Count responses
      const going = responses?.filter(r => r.response === 'going').length || 0;
      const not_going = responses?.filter(r => r.response === 'not_going').length || 0;
      const maybe = responses?.filter(r => r.response === 'maybe').length || 0;
      const responded = going + not_going + maybe;
      const no_response = totalUsers - responded;

      return {
        event_id: eventId,
        going,
        not_going,
        maybe,
        no_response,
        total_users: totalUsers,
      };
    } catch (err) {
      console.error('Error fetching RSVP summary:', err);
      return null;
    }
  }, [profile, isAdmin, supabase]);

  /**
   * Get detailed RSVP list for an event
   */
  const getRsvpList = useCallback(async (eventId: string): Promise<UserRsvp[]> => {
    if (!profile || !isAdmin) {
      return [];
    }

    try {
      // Get eligible users by joining event_teams with user_teams and users
      const { data: eligibleUsers, error: usersError } = await supabase
        .from('event_teams')
        .select(`
          team_id,
          user_teams!inner(
            user_id,
            users!inner(
              id,
              first_name,
              last_name,
              gender,
              team_level
            )
          )
        `)
        .eq('event_id', eventId);

      if (usersError) {
        throw usersError;
      }

      // Extract unique users (a user might be on multiple teams for this event)
      const userMap = new Map();
      eligibleUsers?.forEach((et: any) => {
        et.user_teams.forEach((ut: any) => {
          const user = ut.users;
          if (!userMap.has(user.id)) {
            userMap.set(user.id, {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              gender: user.gender,
              team_level: user.team_level,
            });
          }
        });
      });

      // Get all responses for this event
      const { data: responses, error: responsesError } = await supabase
        .from('event_responses')
        .select('user_id, response, response_datetime')
        .eq('event_id', eventId);

      if (responsesError) {
        throw responsesError;
      }

      // Map responses to users
      const responseMap = new Map(
        responses?.map(r => [r.user_id, { response: r.response, response_datetime: r.response_datetime }]) || []
      );

      // Combine user data with responses
      const userRsvps: UserRsvp[] = Array.from(userMap.values()).map(user => ({
        user_id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        gender: user.gender,
        team_level: user.team_level,
        response: responseMap.get(user.id)?.response || 'no_response',
        response_datetime: responseMap.get(user.id)?.response_datetime || null,
      }));

      return userRsvps;
    } catch (err) {
      console.error('Error fetching RSVP list:', err);
      return [];
    }
  }, [profile, isAdmin, supabase]);

  return {
    isAdmin,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    getAllEvents,
    getRsvpSummary,
    getRsvpList,
  };
}
