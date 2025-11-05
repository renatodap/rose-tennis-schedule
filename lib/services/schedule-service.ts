/**
 * Schedule Service
 *
 * Pure business logic for schedule management and conflict detection.
 * This service contains no React or database-specific code.
 */

import { format, parse, parseISO, addDays, isWithinInterval, isBefore, isAfter, startOfDay, endOfDay } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { APP_TIMEZONE, TIME_FORMATS, DayOfWeek } from '@/lib/constants';

/**
 * Time range with start and end times
 */
export interface TimeRange {
  start: Date;
  end: Date;
}

/**
 * Class schedule item (weekly recurring)
 */
export interface ClassScheduleItem {
  id?: string;
  day_of_week: DayOfWeek;
  start_time: string; // HH:mm format
  end_time: string;   // HH:mm format
  course_name?: string;
}

/**
 * Event or blocker item (specific date/time)
 */
export interface ScheduleItem {
  id?: string;
  start_time: Date;
  end_time: Date;
  title?: string;
}

/**
 * Conflict detection result
 */
export interface ConflictResult {
  hasConflict: boolean;
  conflicts: Array<{
    id?: string;
    title?: string;
    start: Date;
    end: Date;
    type: 'class' | 'event' | 'blocker';
  }>;
}

/**
 * Converts a time string (HH:mm) to a Date object on a specific date
 *
 * @param date - Base date
 * @param timeString - Time in HH:mm format (e.g., "14:30")
 * @returns Date object with the specified time
 *
 * @example
 * ```ts
 * const date = new Date('2025-03-20');
 * const datetime = timeStringToDate(date, '14:30');
 * // Returns: 2025-03-20T14:30:00
 * ```
 */
export function timeStringToDate(date: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

/**
 * Converts a Date object to time string (HH:mm)
 *
 * @param date - Date object
 * @returns Time string in HH:mm format
 *
 * @example
 * ```ts
 * const date = new Date('2025-03-20T14:30:00');
 * const time = dateToTimeString(date);
 * // Returns: "14:30"
 * ```
 */
export function dateToTimeString(date: Date): string {
  return format(date, 'HH:mm');
}

/**
 * Checks if two time ranges overlap
 *
 * @param range1 - First time range
 * @param range2 - Second time range
 * @returns True if ranges overlap
 *
 * @example
 * ```ts
 * const range1 = { start: new Date('2025-03-20T14:00'), end: new Date('2025-03-20T15:00') };
 * const range2 = { start: new Date('2025-03-20T14:30'), end: new Date('2025-03-20T15:30') };
 * const overlaps = timeRangesOverlap(range1, range2);
 * // Returns: true
 * ```
 */
export function timeRangesOverlap(range1: TimeRange, range2: TimeRange): boolean {
  return (
    isBefore(range1.start, range2.end) &&
    isAfter(range1.end, range2.start)
  );
}

/**
 * Checks if a class schedule conflicts with a specific time range
 *
 * @param classItem - Recurring class schedule item
 * @param targetDate - Date to check
 * @param targetRange - Time range to check against
 * @returns True if class conflicts with target range
 *
 * @example
 * ```ts
 * const classItem = {
 *   day_of_week: DayOfWeek.MONDAY,
 *   start_time: '14:00',
 *   end_time: '15:00'
 * };
 * const targetDate = new Date('2025-03-24'); // Monday
 * const targetRange = {
 *   start: new Date('2025-03-24T14:30'),
 *   end: new Date('2025-03-24T15:30')
 * };
 * const conflicts = classScheduleConflicts(classItem, targetDate, targetRange);
 * // Returns: true
 * ```
 */
export function classScheduleConflicts(
  classItem: ClassScheduleItem,
  targetDate: Date,
  targetRange: TimeRange
): boolean {
  // Check if target date is on the same day of week as the class
  if (targetDate.getDay() !== classItem.day_of_week) {
    return false;
  }

  // Convert class times to Date objects on target date
  const classStart = timeStringToDate(targetDate, classItem.start_time);
  const classEnd = timeStringToDate(targetDate, classItem.end_time);

  // Check if time ranges overlap
  return timeRangesOverlap(
    { start: classStart, end: classEnd },
    targetRange
  );
}

/**
 * Detects conflicts for a proposed schedule item
 *
 * @param proposedRange - Time range of proposed item
 * @param existingClasses - User's class schedule
 * @param existingEvents - Existing events in the time range
 * @param existingBlockers - Existing blockers in the time range
 * @returns Conflict detection result
 *
 * @example
 * ```ts
 * const proposedRange = {
 *   start: new Date('2025-03-24T14:00'),
 *   end: new Date('2025-03-24T16:00')
 * };
 * const conflicts = detectScheduleConflicts(
 *   proposedRange,
 *   userClasses,
 *   existingEvents,
 *   existingBlockers
 * );
 * if (conflicts.hasConflict) {
 *   console.log('Conflicts found:', conflicts.conflicts);
 * }
 * ```
 */
export function detectScheduleConflicts(
  proposedRange: TimeRange,
  existingClasses: ClassScheduleItem[],
  existingEvents: ScheduleItem[],
  existingBlockers: ScheduleItem[]
): ConflictResult {
  const conflicts: ConflictResult['conflicts'] = [];

  // Check class conflicts
  for (const classItem of existingClasses) {
    if (classScheduleConflicts(classItem, proposedRange.start, proposedRange)) {
      conflicts.push({
        id: classItem.id,
        title: classItem.course_name || 'Class',
        start: timeStringToDate(proposedRange.start, classItem.start_time),
        end: timeStringToDate(proposedRange.start, classItem.end_time),
        type: 'class'
      });
    }
  }

  // Check event conflicts
  for (const event of existingEvents) {
    if (timeRangesOverlap(proposedRange, { start: event.start_time, end: event.end_time })) {
      conflicts.push({
        id: event.id,
        title: event.title || 'Event',
        start: event.start_time,
        end: event.end_time,
        type: 'event'
      });
    }
  }

  // Check blocker conflicts
  for (const blocker of existingBlockers) {
    if (timeRangesOverlap(proposedRange, { start: blocker.start_time, end: blocker.end_time })) {
      conflicts.push({
        id: blocker.id,
        title: blocker.title || 'Blocker',
        start: blocker.start_time,
        end: blocker.end_time,
        type: 'blocker'
      });
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts
  };
}

/**
 * Gets available time slots on a given day
 *
 * @param date - Date to check
 * @param slotDuration - Duration of each slot in minutes
 * @param dayStartHour - Start hour (24-hour format)
 * @param dayEndHour - End hour (24-hour format)
 * @param occupiedSlots - Already occupied time ranges
 * @returns Array of available time ranges
 *
 * @example
 * ```ts
 * const availableSlots = getAvailableTimeSlots(
 *   new Date('2025-03-24'),
 *   30, // 30-minute slots
 *   8,  // 8 AM start
 *   18, // 6 PM end
 *   occupiedTimes
 * );
 * ```
 */
export function getAvailableTimeSlots(
  date: Date,
  slotDuration: number,
  dayStartHour: number,
  dayEndHour: number,
  occupiedSlots: TimeRange[]
): TimeRange[] {
  const availableSlots: TimeRange[] = [];
  const dayStart = new Date(date);
  dayStart.setHours(dayStartHour, 0, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(dayEndHour, 0, 0, 0);

  let currentSlotStart = new Date(dayStart);

  while (currentSlotStart < dayEnd) {
    const currentSlotEnd = new Date(currentSlotStart.getTime() + slotDuration * 60 * 1000);

    const proposedSlot: TimeRange = {
      start: new Date(currentSlotStart),
      end: new Date(currentSlotEnd)
    };

    // Check if this slot overlaps with any occupied slots
    const isOccupied = occupiedSlots.some(occupied =>
      timeRangesOverlap(proposedSlot, occupied)
    );

    if (!isOccupied) {
      availableSlots.push(proposedSlot);
    }

    currentSlotStart = currentSlotEnd;
  }

  return availableSlots;
}

/**
 * Generates recurring dates for a weekly recurring item
 *
 * @param dayOfWeek - Day of week (0-6)
 * @param startDate - Start of date range
 * @param endDate - End of date range
 * @returns Array of dates matching the day of week
 *
 * @example
 * ```ts
 * const mondays = generateRecurringDates(
 *   DayOfWeek.MONDAY,
 *   new Date('2025-03-01'),
 *   new Date('2025-03-31')
 * );
 * // Returns all Mondays in March 2025
 * ```
 */
export function generateRecurringDates(
  dayOfWeek: DayOfWeek,
  startDate: Date,
  endDate: Date
): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);

  // Find first occurrence of the day of week
  while (currentDate.getDay() !== dayOfWeek && currentDate <= endDate) {
    currentDate = addDays(currentDate, 1);
  }

  // Generate all occurrences
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 7); // Add 1 week
  }

  return dates;
}

/**
 * Converts UTC time to local timezone (Indianapolis)
 *
 * @param utcDate - Date in UTC
 * @returns Date in Indianapolis timezone
 */
export function utcToLocal(utcDate: Date): Date {
  return toZonedTime(utcDate, APP_TIMEZONE);
}

/**
 * Converts local timezone (Indianapolis) to UTC
 *
 * @param localDate - Date in Indianapolis timezone
 * @returns Date in UTC
 */
export function localToUtc(localDate: Date): Date {
  return fromZonedTime(localDate, APP_TIMEZONE);
}

/**
 * Formats a time range for display
 *
 * @param start - Start time
 * @param end - End time
 * @param includeDate - Whether to include the date
 * @returns Formatted time range string
 *
 * @example
 * ```ts
 * const range = formatTimeRange(
 *   new Date('2025-03-24T14:00'),
 *   new Date('2025-03-24T16:00'),
 *   true
 * );
 * // Returns: "Mar 24, 2025 2:00 PM - 4:00 PM"
 * ```
 */
export function formatTimeRange(start: Date, end: Date, includeDate = true): string {
  if (includeDate) {
    return `${format(start, TIME_FORMATS.DISPLAY_DATETIME)} - ${format(end, TIME_FORMATS.DISPLAY_TIME)}`;
  }
  return `${format(start, TIME_FORMATS.DISPLAY_TIME)} - ${format(end, TIME_FORMATS.DISPLAY_TIME)}`;
}

/**
 * Checks if a date falls within a quarter's date range
 *
 * @param date - Date to check
 * @param quarterStart - Quarter start date (ISO string)
 * @param quarterEnd - Quarter end date (ISO string)
 * @returns True if date is within quarter
 */
export function isDateInQuarter(date: Date, quarterStart: string, quarterEnd: string): boolean {
  const start = parseISO(quarterStart);
  const end = parseISO(quarterEnd);
  return isWithinInterval(date, { start, end });
}

/**
 * Validates that end time is after start time
 *
 * @param start - Start time
 * @param end - End time
 * @returns True if valid, error message if invalid
 */
export function validateTimeRange(start: Date, end: Date): { valid: boolean; error?: string } {
  if (!start || !end) {
    return { valid: false, error: 'Start and end times are required' };
  }

  if (isBefore(end, start) || end.getTime() === start.getTime()) {
    return { valid: false, error: 'End time must be after start time' };
  }

  return { valid: true };
}

/**
 * Gets the duration between two times in minutes
 *
 * @param start - Start time
 * @param end - End time
 * @returns Duration in minutes
 */
export function getDurationMinutes(start: Date, end: Date): number {
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
}
