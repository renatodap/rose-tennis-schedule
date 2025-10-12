/**
 * Resend Email Service
 * Handles sending email notifications via Resend API
 */

import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const FROM_EMAIL = 'Rose-Hulman Tennis <noreply@yourdomain.com>'; // Update with your verified domain
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Rose-Hulman Tennis';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: SendEmailOptions) {
  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your-resend-api-key') {
      console.warn('Resend API key not configured. Email not sent.');
      return { success: false, error: 'API key not configured' };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

/**
 * Send bulk emails (to multiple recipients)
 */
export async function sendBulkEmails(emails: SendEmailOptions[]) {
  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your-resend-api-key') {
      console.warn('Resend API key not configured. Emails not sent.');
      return { success: false, error: 'API key not configured' };
    }

    const results = await Promise.allSettled(
      emails.map(email => sendEmail(email))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return {
      success: true,
      successful,
      failed,
      total: emails.length,
    };
  } catch (error) {
    console.error('Error sending bulk emails:', error);
    return { success: false, error };
  }
}

export { APP_NAME, APP_URL };
