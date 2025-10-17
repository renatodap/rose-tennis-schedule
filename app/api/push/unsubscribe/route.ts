/**
 * API Route: Unsubscribe from Push Notifications
 * Removes user's push subscription from database
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, endpoint } = await request.json();

    if (!userId || !endpoint) {
      return NextResponse.json(
        { error: 'Missing userId or endpoint' },
        { status: 400 }
      );
    }

    // Delete subscription
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', userId)
      .eq('endpoint', endpoint);

    if (error) {
      console.error('Error deleting push subscription:', error);
      return NextResponse.json(
        { error: 'Failed to delete subscription', details: error },
        { status: 500 }
      );
    }

    console.log(`Push subscription removed for user ${userId}`);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error in push unsubscribe endpoint:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
