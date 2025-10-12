/**
 * API Route: Send Form Notification Emails
 * Sends notification emails to eligible users when a new form is created
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend';
import { generateFormNotificationEmail } from '@/lib/email/templates/form-notification';

export async function POST(request: NextRequest) {
  try {
    const { formId } = await request.json();

    if (!formId) {
      return NextResponse.json(
        { error: 'Form ID is required' },
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
        { error: 'Only coaches and captains can send form notifications' },
        { status: 403 }
      );
    }

    // Get form details
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .single();

    if (formError || !form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    // Get eligible users by joining form_teams with user_teams and users
    const { data: formTeamsData, error: formTeamsError } = await supabase
      .from('form_teams')
      .select(`
        team_id,
        user_teams!inner(
          user_id,
          users!inner(
            id,
            first_name,
            last_name,
            email,
            role
          )
        )
      `)
      .eq('form_id', formId);

    if (formTeamsError) {
      throw formTeamsError;
    }

    // Extract unique users (a user might be on multiple teams for this form)
    // Only include players and captains
    const userMap = new Map();
    formTeamsData?.forEach((ft: any) => {
      ft.user_teams.forEach((ut: any) => {
        const user = ut.users;
        if ((user.role === 'player' || user.role === 'captain') && !userMap.has(user.id)) {
          userMap.set(user.id, {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
          });
        }
      });
    });

    const eligibleUsers = Array.from(userMap.values());

    if (!eligibleUsers || eligibleUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No eligible users to notify',
        emailsSent: 0,
      });
    }

    // Send emails to all eligible users
    const emailPromises = eligibleUsers.map(async (user) => {
      const emailContent = generateFormNotificationEmail({
        form,
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
    console.error('Error sending form notifications:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
