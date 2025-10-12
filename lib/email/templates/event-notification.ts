/**
 * Event Notification Email Template
 * Generates HTML email for new event notifications
 */

import { Event } from '@/lib/types/database.types';
import { APP_NAME, APP_URL } from '../resend';
import { format } from 'date-fns';

interface EventEmailData {
  event: Event;
  recipientName: string;
}

export function generateEventNotificationEmail({ event, recipientName }: EventEmailData) {
  const startDate = new Date(event.start_datetime);
  const endDate = new Date(event.end_datetime);

  const formattedDate = format(startDate, 'EEEE, MMMM d, yyyy');
  const formattedStartTime = format(startDate, 'h:mm a');
  const formattedEndTime = format(endDate, 'h:mm a');

  const eventTypeColor =
    event.event_type === 'mandatory' ? '#dc2626' :
    event.event_type === 'recommended' ? '#f59e0b' : '#6b7280';

  const eventTypeLabel = event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1);

  const subject = `New ${eventTypeLabel} Event: ${event.title}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background-color: #7c2d12; padding: 32px 24px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">${APP_NAME}</h1>
    </div>

    <!-- Content -->
    <div style="padding: 32px 24px;">
      <p style="margin: 0 0 16px; color: #374151; font-size: 16px;">Hi ${recipientName},</p>

      <p style="margin: 0 0 24px; color: #374151; font-size: 16px;">
        A new team event has been scheduled. Here are the details:
      </p>

      <!-- Event Type Badge -->
      <div style="margin-bottom: 24px;">
        <span style="display: inline-block; padding: 6px 12px; background-color: ${eventTypeColor}; color: #ffffff; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
          ${eventTypeLabel}
        </span>
      </div>

      <!-- Event Details Card -->
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px; background-color: #f9fafb;">
        <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px; font-weight: bold;">${event.title}</h2>

        ${event.description ? `
        <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px; line-height: 1.5;">
          ${event.description}
        </p>
        ` : ''}

        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <div style="margin-bottom: 12px;">
            <strong style="color: #374151; font-size: 14px;">📅 Date:</strong>
            <span style="color: #6b7280; font-size: 14px; margin-left: 8px;">${formattedDate}</span>
          </div>

          <div style="margin-bottom: 12px;">
            <strong style="color: #374151; font-size: 14px;">🕒 Time:</strong>
            <span style="color: #6b7280; font-size: 14px; margin-left: 8px;">${formattedStartTime} - ${formattedEndTime}</span>
          </div>

          ${event.location ? `
          <div style="margin-bottom: 12px;">
            <strong style="color: #374151; font-size: 14px;">📍 Location:</strong>
            <span style="color: #6b7280; font-size: 14px; margin-left: 8px;">${event.location}</span>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${APP_URL}/events" style="display: inline-block; padding: 12px 32px; background-color: #7c2d12; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
          View Event & RSVP
        </a>
      </div>

      <p style="margin: 24px 0 0; color: #6b7280; font-size: 14px;">
        ${event.event_type === 'mandatory'
          ? 'Your attendance is required for this event. Please RSVP as soon as possible.'
          : event.event_type === 'recommended'
          ? 'Your attendance is strongly encouraged for this event. Please let us know if you can make it.'
          : 'This is an optional event. Please RSVP to let us know if you plan to attend.'}
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px;">
        This is an automated notification from ${APP_NAME}
      </p>
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        <a href="${APP_URL}" style="color: #7c2d12; text-decoration: none;">Visit Dashboard</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
${APP_NAME} - New Event Notification

Hi ${recipientName},

A new team event has been scheduled:

${event.title}
Type: ${eventTypeLabel}

Date: ${formattedDate}
Time: ${formattedStartTime} - ${formattedEndTime}
${event.location ? `Location: ${event.location}` : ''}

${event.description || ''}

${event.event_type === 'mandatory'
  ? 'Your attendance is required for this event.'
  : event.event_type === 'recommended'
  ? 'Your attendance is strongly encouraged for this event.'
  : 'This is an optional event.'}

Please visit ${APP_URL}/events to view details and RSVP.

---
${APP_NAME}
  `.trim();

  return { subject, html, text };
}
