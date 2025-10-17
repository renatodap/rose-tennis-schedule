/**
 * Server-side Push Notification Sender
 * Sends push notifications to user's subscribed devices
 */

import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Configure web-push with VAPID keys
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:tennis@rose-hulman.edu',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: {
    url?: string;
    eventId?: string;
    [key: string]: any;
  };
  actions?: Array<{
    action: string;
    title: string;
  }>;
}

/**
 * Send push notification to a specific user
 * Sends to all their subscribed devices
 */
export async function sendPushNotification(
  userId: string,
  payload: PushNotificationPayload
): Promise<{ success: boolean; sentCount: number; failedCount: number }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Get all push subscriptions for this user
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching push subscriptions:', error);
      return { success: false, sentCount: 0, failedCount: 0 };
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log(`No push subscriptions found for user ${userId}`);
      return { success: true, sentCount: 0, failedCount: 0 };
    }

    let sentCount = 0;
    let failedCount = 0;

    // Send to all devices
    const sendPromises = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      try {
        await webpush.sendNotification(
          pushSubscription,
          JSON.stringify(payload),
          {
            TTL: 86400, // 24 hours
          }
        );

        // Update last_used_at
        await supabase
          .from('push_subscriptions')
          .update({ last_used_at: new Date().toISOString() })
          .eq('id', sub.id);

        sentCount++;
        console.log(`Push sent to device ${sub.id}`);
      } catch (error: any) {
        console.error(`Error sending push to device ${sub.id}:`, error);

        // If subscription is expired or invalid (410 Gone), delete it
        if (error.statusCode === 410 || error.statusCode === 404) {
          console.log(`Deleting expired subscription ${sub.id}`);
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('id', sub.id);
        }

        failedCount++;
      }
    });

    await Promise.all(sendPromises);

    console.log(
      `Push notification sent to user ${userId}: ${sentCount} succeeded, ${failedCount} failed`
    );

    return {
      success: sentCount > 0,
      sentCount,
      failedCount,
    };
  } catch (error) {
    console.error('Error in sendPushNotification:', error);
    return { success: false, sentCount: 0, failedCount: 0 };
  }
}

/**
 * Send push notification to multiple users
 */
export async function sendPushNotificationToUsers(
  userIds: string[],
  payload: PushNotificationPayload
): Promise<{
  totalSent: number;
  totalFailed: number;
  userResults: Record<string, { sentCount: number; failedCount: number }>;
}> {
  const results = await Promise.all(
    userIds.map(async (userId) => ({
      userId,
      result: await sendPushNotification(userId, payload),
    }))
  );

  const totalSent = results.reduce((sum, r) => sum + r.result.sentCount, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.result.failedCount, 0);

  const userResults = results.reduce(
    (acc, { userId, result }) => {
      acc[userId] = {
        sentCount: result.sentCount,
        failedCount: result.failedCount,
      };
      return acc;
    },
    {} as Record<string, { sentCount: number; failedCount: number }>
  );

  return { totalSent, totalFailed, userResults };
}
