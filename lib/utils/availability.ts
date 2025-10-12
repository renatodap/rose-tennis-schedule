/**
 * Availability calculation and conflict detection utilities
 * Handles overlapping schedules, blockers, and availability windows
 */

import { parseISO, isWithinInterval, isSameDay } from 'date-fns';
import {
  ClassSchedule,
  RecurringBlocker,
  OneTimeBlocker,
  PracticeAvailability,
} from '../types/database.types';
import { AvailabilityStatus } from '../constants';
import { timeRangesOverlap, getDayOfWeekNumber } from './time';

/**
 * Time slot representation
 */
export interface TimeSlot {
  start: string; // HH:MM format
  end: string; // HH:MM format
}

/**
 * Date-time slot representation
 */
export interface DateTimeSlot {
  start: string; // ISO datetime
  end: string; // ISO datetime
}

/**
 * Availability window for a user
 */
export interface AvailabilityWindow {
  userId: string;
  date: string;
  availableSlots: TimeSlot[];
  conflicts: Conflict[];
}

/**
 * Conflict representation
 */
export interface Conflict {
  type: 'class' | 'recurring_blocker' | 'one_time_blocker' | 'practice_unavailable';
  title: string;
  start: string;
  end: string;
  details?: string;
}

/**
 * Checks if a time slot conflicts with class schedules
 *
 * @param date - Date to check (ISO format)
 * @param timeSlot - Time slot to check
 * @param classSchedules - User's class schedules
 * @returns Array of conflicting class schedules
 */
export function findClassConflicts(
  date: string,
  timeSlot: TimeSlot,
  classSchedules: ClassSchedule[]
): Conflict[] {
  const dayOfWeek = getDayOfWeekNumber(date);
  const conflicts: Conflict[] = [];

  for (const schedule of classSchedules) {
    if (schedule.day_of_week === dayOfWeek) {
      if (
        timeRangesOverlap(
          timeSlot.start,
          timeSlot.end,
          schedule.start_time,
          schedule.end_time
        )
      ) {
        conflicts.push({
          type: 'class',
          title: schedule.class_name || 'Class',
          start: schedule.start_time,
          end: schedule.end_time,
          details: schedule.location,
        });
      }
    }
  }

  return conflicts;
}

/**
 * Checks if a time slot conflicts with recurring blockers
 *
 * @param date - Date to check (ISO format)
 * @param timeSlot - Time slot to check
 * @param recurringBlockers - User's recurring blockers
 * @returns Array of conflicting recurring blockers
 */
export function findRecurringBlockerConflicts(
  date: string,
  timeSlot: TimeSlot,
  recurringBlockers: RecurringBlocker[]
): Conflict[] {
  const dayOfWeek = getDayOfWeekNumber(date);
  const conflicts: Conflict[] = [];

  for (const blocker of recurringBlockers) {
    if (blocker.day_of_week === dayOfWeek) {
      if (
        timeRangesOverlap(
          timeSlot.start,
          timeSlot.end,
          blocker.start_time,
          blocker.end_time
        )
      ) {
        conflicts.push({
          type: 'recurring_blocker',
          title: blocker.title,
          start: blocker.start_time,
          end: blocker.end_time,
          details: blocker.description,
        });
      }
    }
  }

  return conflicts;
}

/**
 * Checks if a datetime range conflicts with one-time blockers
 *
 * @param dateTimeSlot - DateTime slot to check
 * @param oneTimeBlockers - User's one-time blockers
 * @returns Array of conflicting one-time blockers
 */
export function findOneTimeBlockerConflicts(
  dateTimeSlot: DateTimeSlot,
  oneTimeBlockers: OneTimeBlocker[]
): Conflict[] {
  const conflicts: Conflict[] = [];
  const slotStart = parseISO(dateTimeSlot.start);
  const slotEnd = parseISO(dateTimeSlot.end);

  for (const blocker of oneTimeBlockers) {
    const blockerStart = parseISO(blocker.start_datetime);
    const blockerEnd = parseISO(blocker.end_datetime);

    // Check if the ranges overlap
    if (slotStart < blockerEnd && blockerStart < slotEnd) {
      conflicts.push({
        type: 'one_time_blocker',
        title: blocker.title,
        start: blocker.start_datetime,
        end: blocker.end_datetime,
        details: blocker.description,
      });
    }
  }

  return conflicts;
}

/**
 * Gets all conflicts for a specific date and time slot
 *
 * @param date - Date to check (ISO format)
 * @param timeSlot - Time slot to check
 * @param classSchedules - User's class schedules
 * @param recurringBlockers - User's recurring blockers
 * @param oneTimeBlockers - User's one-time blockers
 * @returns Array of all conflicts
 */
export function getAllConflicts(
  date: string,
  timeSlot: TimeSlot,
  classSchedules: ClassSchedule[],
  recurringBlockers: RecurringBlocker[],
  oneTimeBlockers: OneTimeBlocker[]
): Conflict[] {
  const conflicts: Conflict[] = [];

  // Check class conflicts
  conflicts.push(...findClassConflicts(date, timeSlot, classSchedules));

  // Check recurring blocker conflicts
  conflicts.push(...findRecurringBlockerConflicts(date, timeSlot, recurringBlockers));

  // Check one-time blocker conflicts
  const dateTimeSlot: DateTimeSlot = {
    start: `${date}T${timeSlot.start}:00`,
    end: `${date}T${timeSlot.end}:00`,
  };
  conflicts.push(...findOneTimeBlockerConflicts(dateTimeSlot, oneTimeBlockers));

  return conflicts;
}

/**
 * Checks if a user is available at a specific time
 *
 * @param date - Date to check (ISO format)
 * @param timeSlot - Time slot to check
 * @param classSchedules - User's class schedules
 * @param recurringBlockers - User's recurring blockers
 * @param oneTimeBlockers - User's one-time blockers
 * @param practiceAvailability - User's practice availability for the date
 * @returns True if available, false if conflicts exist or marked unavailable
 */
export function isUserAvailable(
  date: string,
  timeSlot: TimeSlot,
  classSchedules: ClassSchedule[],
  recurringBlockers: RecurringBlocker[],
  oneTimeBlockers: OneTimeBlocker[],
  practiceAvailability?: PracticeAvailability
): boolean {
  // Check if user has marked themselves unavailable for practice
  if (practiceAvailability?.status === AvailabilityStatus.UNAVAILABLE) {
    return false;
  }

  // Check for any conflicts
  const conflicts = getAllConflicts(
    date,
    timeSlot,
    classSchedules,
    recurringBlockers,
    oneTimeBlockers
  );

  return conflicts.length === 0;
}

/**
 * Calculates overlapping availability for multiple users
 *
 * @param date - Date to check (ISO format)
 * @param timeSlot - Time slot to check
 * @param users - Array of user availability data
 * @returns Array of user IDs who are available
 */
export function calculateOverlappingAvailability(
  date: string,
  timeSlot: TimeSlot,
  users: Array<{
    userId: string;
    classSchedules: ClassSchedule[];
    recurringBlockers: RecurringBlocker[];
    oneTimeBlockers: OneTimeBlocker[];
    practiceAvailability?: PracticeAvailability;
  }>
): string[] {
  const availableUsers: string[] = [];

  for (const user of users) {
    if (
      isUserAvailable(
        date,
        timeSlot,
        user.classSchedules,
        user.recurringBlockers,
        user.oneTimeBlockers,
        user.practiceAvailability
      )
    ) {
      availableUsers.push(user.userId);
    }
  }

  return availableUsers;
}

/**
 * Finds the best time slots with maximum availability
 *
 * @param date - Date to check (ISO format)
 * @param timeSlots - Array of time slots to evaluate
 * @param users - Array of user availability data
 * @returns Array of time slots sorted by number of available users (descending)
 */
export function findBestTimeSlots(
  date: string,
  timeSlots: TimeSlot[],
  users: Array<{
    userId: string;
    classSchedules: ClassSchedule[];
    recurringBlockers: RecurringBlocker[];
    oneTimeBlockers: OneTimeBlocker[];
    practiceAvailability?: PracticeAvailability;
  }>
): Array<{ timeSlot: TimeSlot; availableUsers: string[]; availabilityCount: number }> {
  const results = timeSlots.map((timeSlot) => {
    const availableUsers = calculateOverlappingAvailability(date, timeSlot, users);
    return {
      timeSlot,
      availableUsers,
      availabilityCount: availableUsers.length,
    };
  });

  // Sort by availability count (descending)
  return results.sort((a, b) => b.availabilityCount - a.availabilityCount);
}

/**
 * Generates availability windows for a user across multiple dates
 *
 * @param dates - Array of dates to check (ISO format)
 * @param userId - User ID
 * @param classSchedules - User's class schedules
 * @param recurringBlockers - User's recurring blockers
 * @param oneTimeBlockers - User's one-time blockers
 * @param practiceAvailability - User's practice availability records
 * @returns Array of availability windows
 */
export function generateAvailabilityWindows(
  dates: string[],
  userId: string,
  classSchedules: ClassSchedule[],
  recurringBlockers: RecurringBlocker[],
  oneTimeBlockers: OneTimeBlocker[],
  practiceAvailability: PracticeAvailability[]
): AvailabilityWindow[] {
  return dates.map((date) => {
    const dayAvailability = practiceAvailability.find((pa) => pa.date === date);

    // Get all conflicts for the day
    const dayOfWeek = getDayOfWeekNumber(date);

    const conflicts: Conflict[] = [];

    // Add class conflicts
    classSchedules
      .filter((cs) => cs.day_of_week === dayOfWeek)
      .forEach((cs) => {
        conflicts.push({
          type: 'class',
          title: cs.class_name || 'Class',
          start: cs.start_time,
          end: cs.end_time,
          details: cs.location,
        });
      });

    // Add recurring blocker conflicts
    recurringBlockers
      .filter((rb) => rb.day_of_week === dayOfWeek)
      .forEach((rb) => {
        conflicts.push({
          type: 'recurring_blocker',
          title: rb.title,
          start: rb.start_time,
          end: rb.end_time,
          details: rb.description,
        });
      });

    // Add one-time blocker conflicts
    oneTimeBlockers.forEach((otb) => {
      const blockerDate = otb.start_datetime.split('T')[0];
      if (blockerDate === date) {
        conflicts.push({
          type: 'one_time_blocker',
          title: otb.title,
          start: otb.start_datetime,
          end: otb.end_datetime,
          details: otb.description,
        });
      }
    });

    // Check practice availability status
    if (dayAvailability?.status === AvailabilityStatus.UNAVAILABLE) {
      conflicts.push({
        type: 'practice_unavailable',
        title: 'Marked Unavailable',
        start: '00:00',
        end: '23:59',
        details: dayAvailability.notes,
      });
    }

    // Calculate available slots (this is a simplified version)
    // In a real implementation, you'd calculate gaps between conflicts
    const availableSlots: TimeSlot[] = [];

    return {
      userId,
      date,
      availableSlots,
      conflicts: conflicts.sort((a, b) => a.start.localeCompare(b.start)),
    };
  });
}
