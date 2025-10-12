/**
 * API Route: Send Event Notification Emails
 * Sends notification emails to eligible users when a new event is created
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend';
import { generateEventNotificationEmail } from '@/lib/email/templates/event-notification';

export async function POST(request: NextRequest) {
  try {
    const { eventId } = await request.json();

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Initialize Supabase client with auth context
    const supabase = createClient();

    // Check if user is authenticated and has admin permissions
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user profile to check permissions
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'coach' && profile.role !== 'captain')) {
      return NextResponse.json(
        { error: 'Only coaches and captains can send event notifications' },
        { status: 403 }
      );
    }

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Get eligible users based on event filters
    let userQuery = supabase
      .from('users')
      .select('id, first_name, last_name, email')
      .eq('role', 'player');

    // Filter by gender
    const genders = [];
    if (event.applies_to_men) genders.push('men');
    if (event.applies_to_women) genders.push('women');
    if (genders.length > 0) {
      userQuery = userQuery.in('gender', genders);
    }

    // Filter by team level
    const levels = [];
    if (event.applies_to_jv) levels.push('jv');
    if (event.applies_to_varsity) levels.push('varsity');
    if (levels.length > 0) {
      userQuery = userQuery.in('team_level', levels);
    }

    const { data: eligibleUsers, error: usersError } = await userQuery;

    if (usersError) {
      throw usersError;
    }

    if (!eligibleUsers || eligibleUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No eligible users to notify',
        emailsSent: 0,
      });
    }

    // Send emails to all eligible users
    const emailPromises = eligibleUsers.map(async (user) => {
      const emailContent = generateEventNotificationEmail({
        event,
        recipientName: user.first_name,
      });

      return sendEmail({
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });
    });

    const results = await Promise.allSettled(emailPromises);

    const successful = results.filter(
      (r) => r.status === 'fulfilled' && r.value.success
    ).length;
    const failed = results.length - successful;

    return NextResponse.json({
      success: true,
      message: `Sent ${successful} notification emails`,
      emailsSent: successful,
      emailsFailed: failed,
      totalUsers: eligibleUsers.length,
    });
  } catch (error) {
    console.error('Error sending event notifications:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
