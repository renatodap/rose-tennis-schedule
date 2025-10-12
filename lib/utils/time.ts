/**
 * Time and date utility functions
 * Handles timezone conversions and formatting using date-fns
 */

import { format, parseISO, parse, isValid } from 'date-fns';
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { APP_TIMEZONE, TIME_FORMATS } from '../constants';

/**
 * Formats a date/time string in the application timezone
 *
 * @param date - ISO date string or Date object
 * @param formatStr - Format string (uses date-fns format)
 * @returns Formatted date string
 *
 * @example
 * formatInAppTimezone('2025-08-18T15:30:00Z', TIME_FORMATS.DISPLAY_DATETIME)
 * // returns "Aug 18, 2025 11:30 AM" (adjusted for Indiana timezone)
 */
export function formatInAppTimezone(
  date: string | Date,
  formatStr: string = TIME_FORMATS.DISPLAY_DATETIME
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatInTimeZone(dateObj, APP_TIMEZONE, formatStr);
}

/**
 * Converts a date/time to the application timezone
 *
 * @param date - ISO date string or Date object
 * @returns Date object in application timezone
 */
export function toAppTimezone(date: string | Date): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return utcToZonedTime(dateObj, APP_TIMEZONE);
}

/**
 * Converts a date/time from the application timezone to UTC
 *
 * @param date - Date in application timezone
 * @returns Date object in UTC
 */
export function fromAppTimezone(date: Date): Date {
  return zonedTimeToUtc(date, APP_TIMEZONE);
}

/**
 * Formats a time string (HH:MM) to display format
 *
 * @param time - Time string in HH:MM format (e.g., "09:00", "15:30")
 * @returns Formatted time string (e.g., "9:00 AM", "3:30 PM")
 *
 * @example
 * formatTime("09:00") // returns "9:00 AM"
 * formatTime("15:30") // returns "3:30 PM"
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return format(date, TIME_FORMATS.DISPLAY_TIME);
}

/**
 * Formats a date string to display format
 *
 * @param date - ISO date string (YYYY-MM-DD)
 * @returns Formatted date string
 *
 * @example
 * formatDate("2025-08-18") // returns "Aug 18, 2025"
 */
export function formatDate(date: string): string {
  const dateObj = parseISO(date);
  return format(dateObj, TIME_FORMATS.DISPLAY_DATE);
}

/**
 * Parses a time string (HH:MM) to a Date object for the given date
 *
 * @param date - ISO date string (YYYY-MM-DD)
 * @param time - Time string in HH:MM format
 * @returns Date object
 */
export function parseTimeOnDate(date: string, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const dateObj = parseISO(date);
  dateObj.setHours(hours, minutes, 0, 0);
  return dateObj;
}

/**
 * Extracts time (HH:MM) from an ISO datetime string
 *
 * @param datetime - ISO datetime string
 * @returns Time string in HH:MM format
 *
 * @example
 * extractTime("2025-08-18T15:30:00") // returns "15:30"
 */
export function extractTime(datetime: string): string {
  const date = parseISO(datetime);
  return format(date, 'HH:mm');
}

/**
 * Extracts date (YYYY-MM-DD) from an ISO datetime string
 *
 * @param datetime - ISO datetime string
 * @returns Date string in YYYY-MM-DD format
 *
 * @example
 * extractDate("2025-08-18T15:30:00") // returns "2025-08-18"
 */
export function extractDate(datetime: string): string {
  const date = parseISO(datetime);
  return format(date, TIME_FORMATS.ISO_DATE);
}

/**
 * Combines a date and time string into an ISO datetime string
 *
 * @param date - ISO date string (YYYY-MM-DD)
 * @param time - Time string in HH:MM format
 * @returns ISO datetime string
 *
 * @example
 * combineDateAndTime("2025-08-18", "15:30") // returns "2025-08-18T15:30:00"
 */
export function combineDateAndTime(date: string, time: string): string {
  return `${date}T${time}:00`;
}

/**
 * Gets the current date in ISO format (YYYY-MM-DD) in app timezone
 *
 * @returns Current date string
 */
export function getCurrentDate(): string {
  const now = new Date();
  const zonedNow = toAppTimezone(now);
  return format(zonedNow, TIME_FORMATS.ISO_DATE);
}

/**
 * Gets the current datetime in ISO format in app timezone
 *
 * @returns Current datetime string
 */
export function getCurrentDateTime(): string {
  const now = new Date();
  const zonedNow = toAppTimezone(now);
  return format(zonedNow, TIME_FORMATS.ISO_DATETIME);
}

/**
 * Checks if a time string is valid (HH:MM format)
 *
 * @param time - Time string to validate
 * @returns True if valid, false otherwise
 */
export function isValidTime(time: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

/**
 * Checks if a date string is valid ISO format
 *
 * @param date - Date string to validate
 * @returns True if valid, false otherwise
 */
export function isValidDate(date: string): boolean {
  try {
    const parsed = parseISO(date);
    return isValid(parsed);
  } catch {
    return false;
  }
}

/**
 * Gets the day of week name from a date
 *
 * @param date - ISO date string or Date object
 * @returns Day of week name (e.g., "Monday")
 */
export function getDayOfWeekName(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, TIME_FORMATS.DAY_OF_WEEK);
}

/**
 * Gets the day of week number (0-6, Sunday-Saturday) from a date
 *
 * @param date - ISO date string or Date object
 * @returns Day of week number
 */
export function getDayOfWeekNumber(date: string | Date): number {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj.getDay();
}

/**
 * Compares two time strings
 *
 * @param time1 - First time string (HH:MM)
 * @param time2 - Second time string (HH:MM)
 * @returns Negative if time1 < time2, 0 if equal, positive if time1 > time2
 */
export function compareTime(time1: string, time2: string): number {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);
  const minutes1 = h1 * 60 + m1;
  const minutes2 = h2 * 60 + m2;
  return minutes1 - minutes2;
}

/**
 * Checks if a time range overlaps with another time range
 *
 * @param start1 - Start time of first range (HH:MM)
 * @param end1 - End time of first range (HH:MM)
 * @param start2 - Start time of second range (HH:MM)
 * @param end2 - End time of second range (HH:MM)
 * @returns True if ranges overlap, false otherwise
 */
export function timeRangesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  return compareTime(start1, end2) < 0 && compareTime(start2, end1) < 0;
}

/**
 * Converts a datetime-local input value to ISO datetime string in app timezone
 * HTML datetime-local inputs are always in the user's local timezone,
 * so we need to treat the value as if it's already in the app timezone
 *
 * @param datetimeLocal - Value from datetime-local input (YYYY-MM-DDTHH:MM format)
 * @returns ISO datetime string that will be stored in database
 *
 * @example
 * // User enters "2025-08-18T15:30" in datetime-local input
 * dateTimeLocalToISO("2025-08-18T15:30") // returns "2025-08-18T15:30:00"
 */
export function dateTimeLocalToISO(datetimeLocal: string): string {
  // datetime-local format is "YYYY-MM-DDTHH:MM"
  // We treat this as a time in the app timezone and convert to UTC for storage
  if (!datetimeLocal) return '';

  // Add seconds if not present
  const withSeconds = datetimeLocal.includes(':') && datetimeLocal.split(':').length === 2
    ? `${datetimeLocal}:00`
    : datetimeLocal;

  // Parse as if it's in app timezone
  const dateInAppTz = parseISO(withSeconds);
  // Convert to UTC for database storage
  const utcDate = fromAppTimezone(dateInAppTz);

  return format(utcDate, TIME_FORMATS.ISO_DATETIME);
}

/**
 * Converts an ISO datetime string from database to datetime-local format for input
 * Database stores in UTC, we need to show in app timezone
 *
 * @param isoDatetime - ISO datetime string from database
 * @returns Datetime string in format for datetime-local input (YYYY-MM-DDTHH:MM)
 *
 * @example
 * // Database has "2025-08-18T19:30:00Z" (UTC)
 * isoToDateTimeLocal("2025-08-18T19:30:00Z") // returns "2025-08-18T15:30" (Indiana time)
 */
export function isoToDateTimeLocal(isoDatetime: string): string {
  if (!isoDatetime) return '';

  const dateObj = typeof isoDatetime === 'string' ? parseISO(isoDatetime) : isoDatetime;
  const zonedDate = toAppTimezone(dateObj);

  // datetime-local format requires "YYYY-MM-DDTHH:MM" (no seconds, no timezone)
  return format(zonedDate, "yyyy-MM-dd'T'HH:mm");
}

/**
 * Creates an ISO datetime string for the current moment in app timezone
 * Use this instead of new Date().toISOString() to ensure consistent timezone handling
 *
 * @returns Current datetime in ISO format in app timezone
 */
export function getCurrentDateTimeISO(): string {
  const now = new Date();
  const zonedNow = toAppTimezone(now);
  return format(zonedNow, TIME_FORMATS.ISO_DATETIME);
}

/**
 * Creates an ISO date string (YYYY-MM-DD) for today in app timezone
 * Use this instead of new Date().toISOString().split('T')[0]
 *
 * @returns Today's date in YYYY-MM-DD format in app timezone
 */
export function getTodayDateISO(): string {
  return getCurrentDate();
}

/**
 * Combines a date string and time string into ISO datetime for database storage
 * Treats the input as if it's in the app timezone and converts to UTC
 *
 * @param date - ISO date string (YYYY-MM-DD)
 * @param time - Time string in HH:MM format
 * @returns ISO datetime string ready for database storage
 *
 * @example
 * combineDateTimeForStorage("2025-08-18", "15:30") // returns ISO datetime in UTC
 */
export function combineDateTimeForStorage(date: string, time: string): string {
  const datetimeLocal = `${date}T${time}`;
  return dateTimeLocalToISO(datetimeLocal);
}
