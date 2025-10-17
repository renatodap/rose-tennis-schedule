/**
 * Notification Scheduler
 * Schedules reminder notifications for events
 */

import { getClient } from '../supabase/client';
import { Event } from '../types/database.types';

export type NotificationType = '24hr' | '7hr' | '2hr' | '1hr';

interface ScheduleNotificationParams {
  eventId: string;
  userId: string;
  eventStartTime: Date;
}

/**
 * Calculate when to send each notification type
 */
export function calculateNotificationTimes(eventStartTime: Date) {
  return {
    '24hr': new Date(eventStartTime.getTime() - 24 * 60 * 60 * 1000),
    '7hr': new Date(eventStartTime.getTime() - 7 * 60 * 60 * 1000),
    '2hr': new Date(eventStartTime.getTime() - 2 * 60 * 60 * 1000),
    '1hr': new Date(eventStartTime.getTime() - 1 * 60 * 60 * 1000),
  };
}

/**
 * Schedule all notification types for a user and event
 */
export async function scheduleEventNotifications({
  eventId,
  userId,
  eventStartTime,
}: ScheduleNotificationParams) {
  const supabase = getClient();
  const notificationTimes = calculateNotificationTimes(eventStartTime);
  const now = new Date();

  // Only schedule notifications that are in the future
  const schedulesToInsert = Object.entries(notificationTimes)
    .filter(([_, scheduledFor]) => scheduledFor > now)
    .map(([type, scheduledFor]) => ({
      event_id: eventId,
      user_id: userId,
      notification_type: type as NotificationType,
      scheduled_for: scheduledFor.toISOString(),
    }));

  if (schedulesToInsert.length === 0) {
    console.log(`No future notifications to schedule for user ${userId}, event ${eventId}`);
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from('notification_schedules')
    .insert(schedulesToInsert)
    .select();

  if (error) {
    console.error('Error scheduling notifications:', error);
    return { data: null, error };
  }

  console.log(`Scheduled ${schedulesToInsert.length} notifications for user ${userId}, event ${eventId}`);
  return { data, error: null };
}

/**
 * Cancel all pending notifications for a user and event
 * (e.g., when user RSVPs "Not Going")
 */
export async function cancelEventNotifications(eventId: string, userId: string) {
  const supabase = getClient();

  const { error } = await supabase
    .from('notification_schedules')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .is('sent_at', null); // Only delete unsent notifications

  if (error) {
    console.error('Error canceling notifications:', error);
    return { error };
  }

  console.log(`Canceled pending notifications for user ${userId}, event ${eventId}`);
  return { error: null };
}

/**
 * Reschedule notifications for a user when they change RSVP
 */
export async function rescheduleEventNotifications({
  eventId,
  userId,
  eventStartTime,
}: ScheduleNotificationParams) {
  // Cancel existing notifications
  await cancelEventNotifications(eventId, userId);

  // Schedule new ones
  return scheduleEventNotifications({ eventId, userId, eventStartTime });
}

/**
 * Get all users who should receive notifications for an event
 * (users on the targeted teams who haven't RSVP'd yet)
 */
export async function getUsersForEventNotifications(eventId: string) {
  const supabase = getClient();

  // Get event details and targeted teams
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select(`
      *,
      event_teams (
        team_id,
        teams (
          id,
          gender,
          team_level
        )
      )
    `)
    .eq('id', eventId)
    .single();

  if (eventError || !event) {
    console.error('Error fetching event:', eventError);
    return { data: null, error: eventError };
  }

  // Get all team IDs targeted by this event
  const teamIds = event.event_teams?.map((et: any) => et.team_id) || [];

  if (teamIds.length === 0) {
    console.log('No teams targeted for this event');
    return { data: [], error: null };
  }

  // Get all users on these teams
  const { data: userTeams, error: userTeamsError } = await supabase
    .from('user_teams')
    .select('user_id, users (id, email, first_name, last_name)')
    .in('team_id', teamIds);

  if (userTeamsError) {
    console.error('Error fetching user teams:', userTeamsError);
    return { data: null, error: userTeamsError };
  }

  // Get unique users (in case they're on multiple targeted teams)
  const uniqueUsers = Array.from(
    new Map(
      userTeams?.map((ut: any) => [ut.users.id, ut.users]) || []
    ).values()
  );

  return { data: uniqueUsers, error: null };
}

/**
 * Schedule notifications for all eligible users when an event is created
 */
export async function scheduleNotificationsForNewEvent(event: Event) {
  const { data: users, error: usersError } = await getUsersForEventNotifications(event.id);

  if (usersError || !users) {
    console.error('Error getting users for event notifications:', usersError);
    return { data: null, error: usersError };
  }

  const eventStartTime = new Date(event.start_datetime);
  const results = [];

  for (const user of users) {
    const result = await scheduleEventNotifications({
      eventId: event.id,
      userId: user.id,
      eventStartTime,
    });
    results.push(result);
  }

  console.log(`Scheduled notifications for ${users.length} users for event ${event.id}`);
  return { data: results, error: null };
}
