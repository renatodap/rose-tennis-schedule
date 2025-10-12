/**
 * Form Notification Email Template
 * Generates HTML email for new form notifications
 */

import { Form } from '@/lib/types/database.types';
import { APP_NAME, APP_URL } from '../resend';
import { format } from 'date-fns';

interface FormEmailData {
  form: Form;
  recipientName: string;
}

export function generateFormNotificationEmail({ form, recipientName }: FormEmailData) {
  const hasDueDate = form.due_date;
  const formattedDueDate = hasDueDate ? format(new Date(form.due_date!), 'EEEE, MMMM d, yyyy') : null;

  const subject = `New Form to Complete: ${form.title}`;

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
        A new form has been created and requires your response. Please take a moment to complete it.
      </p>

      <!-- Form Details Card -->
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px; background-color: #f9fafb;">
        <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px; font-weight: bold;">${form.title}</h2>

        ${form.description ? `
        <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px; line-height: 1.5;">
          ${form.description}
        </p>
        ` : ''}

        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          ${hasDueDate ? `
          <div style="margin-bottom: 12px;">
            <strong style="color: #374151; font-size: 14px;">📅 Due Date:</strong>
            <span style="color: #dc2626; font-size: 14px; margin-left: 8px; font-weight: 600;">${formattedDueDate}</span>
          </div>
          ` : ''}

          <div style="margin-bottom: 12px;">
            <strong style="color: #374151; font-size: 14px;">📋 Questions:</strong>
            <span style="color: #6b7280; font-size: 14px; margin-left: 8px;">${form.questions.length} question${form.questions.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      ${hasDueDate ? `
      <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
        <p style="margin: 0; color: #991b1b; font-size: 14px;">
          ⚠️ <strong>Reminder:</strong> Please complete this form by ${formattedDueDate}
        </p>
      </div>
      ` : ''}

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${APP_URL}/forms" style="display: inline-block; padding: 12px 32px; background-color: #7c2d12; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
          Complete Form
        </a>
      </div>

      <p style="margin: 24px 0 0; color: #6b7280; font-size: 14px;">
        Your response helps us better organize and manage the team. Thank you for taking the time to complete this form.
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
${APP_NAME} - New Form Notification

Hi ${recipientName},

A new form has been created and requires your response:

${form.title}

${form.description || ''}

${hasDueDate ? `Due Date: ${formattedDueDate}` : ''}
Questions: ${form.questions.length}

Please visit ${APP_URL}/forms to complete this form.

${hasDueDate ? `Reminder: Please complete this form by ${formattedDueDate}` : ''}

---
${APP_NAME}
  `.trim();

  return { subject, html, text };
}
