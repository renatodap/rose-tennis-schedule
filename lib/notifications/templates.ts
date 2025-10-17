/**
 * Notification Email Templates
 * Increasingly desperate reminder messages for events
 */

import { Event, User } from '../types/database.types';
import { format } from 'date-fns';
import { NotificationType } from './scheduler';
import { BRAND_COLORS } from '../constants';

interface ReminderEmailData {
  event: Event;
  user: User;
  notificationType: NotificationType;
  appUrl: string;
}

/**
 * Get subject line based on notification type
 */
export function getReminderSubject(type: NotificationType, eventTitle: string): string {
  const subjects = {
    '24hr': `Practice tomorrow - RSVP please! 🎾 ${eventTitle}`,
    '7hr': `SERIOUSLY, RSVP to practice today 😅 ${eventTitle}`,
    '2hr': `Your coach is crying 😢 ${eventTitle}`,
    '1hr': `Fine. Ghost us. See if we care. (We do.) ${eventTitle}`,
  };

  return subjects[type];
}

/**
 * Get message body based on notification type
 */
export function getReminderMessage(type: NotificationType, eventTitle: string, timeStr: string): { heading: string; message: string } {
  const messages = {
    '24hr': {
      heading: "Hey! Practice tomorrow 👋",
      message: `Practice is tomorrow at ${timeStr}. Takes 2 seconds to RSVP. You got this!`,
    },
    '7hr': {
      heading: "SERIOUSLY, RSVP 🙏",
      message: `Seriously, RSVP. It takes 2 seconds. We're not asking for much here. Practice is today at ${timeStr}.`,
    },
    '2hr': {
      heading: "Your coach is crying 😢",
      message: `Your coach is crying. Don't make them cry. RSVP now or face eternal shame. Practice starts at ${timeStr} (in 2 hours!).`,
    },
    '1hr': {
      heading: "Fine. Ghost us. 👻",
      message: `Fine. Ghost us. See if we care. (We do.) Last chance to RSVP before you're on the Shame Wall. Practice starts at ${timeStr} (in 1 HOUR!).`,
    },
  };

  return messages[type];
}

/**
 * Generate HTML email for event reminder
 */
export function generateReminderEmail({
  event,
  user,
  notificationType,
  appUrl,
}: ReminderEmailData): { subject: string; html: string } {
  const startDate = new Date(event.start_datetime);
  const endDate = new Date(event.end_datetime);

  const dateStr = format(startDate, 'EEEE, MMMM d, yyyy');
  const timeStr = format(startDate, 'h:mm a');
  const endTimeStr = format(endDate, 'h:mm a');

  const subject = getReminderSubject(notificationType, event.title);
  const { heading, message } = getReminderMessage(notificationType, event.title, timeStr);

  // Event type badge color
  const eventTypeColors = {
    mandatory: { bg: '#dc2626', text: 'MANDATORY' },
    recommended: { bg: '#ea580c', text: 'RECOMMENDED' },
    optional: { bg: '#16a34a', text: 'OPTIONAL' },
  };

  const typeColor = eventTypeColors[event.event_type];

  // Urgency color based on notification type
  const urgencyColors = {
    '24hr': '#6b7280', // gray
    '7hr': '#f59e0b', // orange
    '2hr': '#dc2626', // red
    '1hr': '#7f1d1d', // dark red
  };

  const urgencyColor = urgencyColors[notificationType];

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="100%" max-width="600px" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

              <!-- Header with urgency color -->
              <tr>
                <td style="background-color: ${urgencyColor}; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                    ${heading}
                  </h1>
                </td>
              </tr>

              <!-- Event Title -->
              <tr>
                <td style="padding: 30px 30px 20px 30px;">
                  <h2 style="margin: 0 0 10px 0; color: #111827; font-size: 24px; font-weight: 600;">
                    ${event.title}
                  </h2>
                  <div style="display: inline-block; background-color: ${typeColor.bg}; color: #ffffff; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                    ${typeColor.text}
                  </div>
                </td>
              </tr>

              <!-- Message -->
              <tr>
                <td style="padding: 0 30px 20px 30px;">
                  <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.6;">
                    ${message}
                  </p>
                </td>
              </tr>

              <!-- Event Details -->
              <tr>
                <td style="padding: 0 30px 20px 30px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border-radius: 6px; padding: 20px;">
                    <tr>
                      <td>
                        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; font-weight: 600;">📅 DATE</p>
                        <p style="margin: 0 0 16px 0; color: #111827; font-size: 16px;">${dateStr}</p>

                        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; font-weight: 600;">🕐 TIME</p>
                        <p style="margin: 0 0 16px 0; color: #111827; font-size: 16px;">${timeStr} - ${endTimeStr}</p>

                        ${event.location ? `
                          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; font-weight: 600;">📍 LOCATION</p>
                          <p style="margin: 0; color: #111827; font-size: 16px;">${event.location}</p>
                        ` : ''}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Description (if exists) -->
              ${event.description ? `
                <tr>
                  <td style="padding: 0 30px 20px 30px;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      ${event.description}
                    </p>
                  </td>
                </tr>
              ` : ''}

              <!-- CTA Button -->
              <tr>
                <td style="padding: 0 30px 30px 30px;" align="center">
                  <a href="${appUrl}/events" style="display: inline-block; background-color: ${BRAND_COLORS.PRIMARY}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                    RSVP NOW
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 20px 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="margin: 0; color: #6b7280; font-size: 12px;">
                    Rose-Hulman Tennis Team<br/>
                    You're receiving this because you're on the team
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return { subject, html };
}
