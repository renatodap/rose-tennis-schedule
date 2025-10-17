/**
 * Cron Job: Send Scheduled Notifications
 * Runs every hour to check for pending notifications that need to be sent
 * Vercel Cron: 0 * * * * (every hour at minute 0)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { generateReminderEmail } from '@/lib/notifications/templates';
import { sendPushNotification } from '@/lib/notifications/sendPush';
import { Event, User, NotificationSchedule } from '@/lib/types/database.types';

// Initialize Supabase client with service role (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    // Get all pending notifications that should be sent in the next hour
    const { data: pendingNotifications, error: notificationsError } = await supabase
      .from('notification_schedules')
      .select('*')
      .is('sent_at', null)
      .lte('scheduled_for', oneHourFromNow.toISOString())
      .order('scheduled_for', { ascending: true });

    if (notificationsError) {
      console.error('Error fetching pending notifications:', notificationsError);
      return NextResponse.json(
        { error: 'Failed to fetch notifications', details: notificationsError },
        { status: 500 }
      );
    }

    if (!pendingNotifications || pendingNotifications.length === 0) {
      console.log('No pending notifications to send');
      return NextResponse.json({
        success: true,
        message: 'No notifications to send',
        sent: 0,
      });
    }

    console.log(`Found ${pendingNotifications.length} pending notifications to send`);

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    for (const notification of pendingNotifications as NotificationSchedule[]) {
      try {
        // Check if user has already RSVP'd (don't send reminders if they responded)
        const { data: rsvpData } = await supabase
          .from('event_responses')
          .select('status')
          .eq('event_id', notification.event_id)
          .eq('user_id', notification.user_id)
          .single();

        // Skip if user already responded
        if (rsvpData && rsvpData.status !== 'no_response') {
          console.log(`Skipping notification ${notification.id} - user already RSVP'd`);

          // Mark as "sent" (actually skipped) so we don't keep trying
          await supabase
            .from('notification_schedules')
            .update({ sent_at: now.toISOString() })
            .eq('id', notification.id);

          continue;
        }

        // Get event details
        const { data: event, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', notification.event_id)
          .single();

        if (eventError || !event) {
          console.error(`Error fetching event ${notification.event_id}:`, eventError);
          failureCount++;
          continue;
        }

        // Get user details
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', notification.user_id)
          .single();

        if (userError || !user) {
          console.error(`Error fetching user ${notification.user_id}:`, userError);
          failureCount++;
          continue;
        }

        // Generate email
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const { subject, html } = generateReminderEmail({
          event: event as Event,
          user: user as User,
          notificationType: notification.notification_type,
          appUrl,
        });

        // Send email via Resend
        const emailResult = await resend.emails.send({
          from: 'Rose-Hulman Tennis <tennis@updates.rose-hulman.edu>',
          to: user.email,
          subject,
          html,
        });

        let emailSuccess = true;
        if (emailResult.error) {
          console.error(`Error sending email to ${user.email}:`, emailResult.error);
          emailSuccess = false;
        }

        // Send push notification
        const pushPayload = {
          title: subject,
          body: event.title,
          icon: '/icon-192x192.svg',
          badge: '/icon-192x192.svg',
          tag: `event-${event.id}`,
          data: {
            url: `/events?event=${event.id}`,
            eventId: event.id,
          },
          actions: [
            {
              action: 'rsvp',
              title: 'RSVP Now',
            },
            {
              action: 'view',
              title: 'View Details',
            },
          ],
        };

        const pushResult = await sendPushNotification(user.id, pushPayload);
        console.log(`Push notification result for ${user.email}: ${pushResult.sentCount} sent, ${pushResult.failedCount} failed`);

        // Consider it a success if either email or push worked
        if (!emailSuccess && !pushResult.success) {
          console.error(`Failed to send notification to ${user.email} via both email and push`);
          failureCount++;
          results.push({
            notification_id: notification.id,
            user_email: user.email,
            status: 'failed',
            error: 'Both email and push failed',
          });
          continue;
        }

        // Mark notification as sent
        await supabase
          .from('notification_schedules')
          .update({ sent_at: now.toISOString() })
          .eq('id', notification.id);

        successCount++;
        results.push({
          notification_id: notification.id,
          user_email: user.email,
          status: 'sent',
          email_id: emailResult.data?.id,
          email_success: emailSuccess,
          push_sent: pushResult.sentCount,
          push_failed: pushResult.failedCount,
        });

        console.log(`Sent ${notification.notification_type} reminder to ${user.email} for event ${event.title}`);

      } catch (error) {
        console.error(`Error processing notification ${notification.id}:`, error);
        failureCount++;
        results.push({
          notification_id: notification.id,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${pendingNotifications.length} notifications`,
      sent: successCount,
      failed: failureCount,
      results,
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}
