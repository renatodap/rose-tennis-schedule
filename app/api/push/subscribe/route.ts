/**
 * API Route: Subscribe to Push Notifications
 * Saves user's push subscription to database
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, subscription } = await request.json();

    if (!userId || !subscription) {
      return NextResponse.json(
        { error: 'Missing userId or subscription' },
        { status: 400 }
      );
    }

    const { endpoint, keys } = subscription;

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return NextResponse.json(
        { error: 'Invalid subscription format' },
        { status: 400 }
      );
    }

    // Upsert subscription (update if exists, insert if new)
    const { data, error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          user_id: userId,
          endpoint,
          p256dh: keys.p256dh,
          auth: keys.auth,
          user_agent: request.headers.get('user-agent') || undefined,
          last_used_at: new Date().toISOString(),
        },
        {
          onConflict: 'endpoint',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Error saving push subscription:', error);
      return NextResponse.json(
        { error: 'Failed to save subscription', details: error },
        { status: 500 }
      );
    }

    console.log(`Push subscription saved for user ${userId}`);

    return NextResponse.json({
      success: true,
      subscription: data,
    });
  } catch (error) {
    console.error('Error in push subscribe endpoint:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
