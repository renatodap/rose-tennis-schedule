/**
 * Quarter management utility functions
 * Handles academic quarter dates, breaks, and validations
 */

import { parseISO, isWithinInterval, isBefore, isAfter } from 'date-fns';
import { QUARTERS } from '../constants';

/**
 * Quarter type definition
 */
export type Quarter = typeof QUARTERS[keyof typeof QUARTERS];
export type QuarterKey = keyof typeof QUARTERS;

/**
 * Break period type definition
 */
export type BreakPeriod = {
  name: string;
  start: string;
  end: string;
};

/**
 * Gets the current quarter based on today's date
 *
 * @param date - Optional date to check (defaults to today)
 * @returns Quarter object or null if not in any quarter
 */
export function getCurrentQuarter(date?: string | Date): Quarter | null {
  const checkDate = date
    ? (typeof date === 'string' ? parseISO(date) : date)
    : new Date();

  for (const quarter of Object.values(QUARTERS)) {
    const start = parseISO(quarter.start);
    const end = parseISO(quarter.end);

    if (isWithinInterval(checkDate, { start, end })) {
      return quarter;
    }
  }

  return null;
}

/**
 * Gets the quarter key for the current date
 *
 * @param date - Optional date to check (defaults to today)
 * @returns Quarter key string or null
 */
export function getCurrentQuarterKey(date?: string | Date): QuarterKey | null {
  const checkDate = date
    ? (typeof date === 'string' ? parseISO(date) : date)
    : new Date();

  for (const [key, quarter] of Object.entries(QUARTERS)) {
    const start = parseISO(quarter.start);
    const end = parseISO(quarter.end);

    if (isWithinInterval(checkDate, { start, end })) {
      return key as QuarterKey;
    }
  }

  return null;
}

/**
 * Gets a quarter by its key
 *
 * @param key - Quarter key
 * @returns Quarter object or null if not found
 */
export function getQuarterByKey(key: string): Quarter | null {
  return QUARTERS[key as QuarterKey] || null;
}

/**
 * Checks if a date is within a specific quarter
 *
 * @param date - Date to check
 * @param quarterKey - Quarter key to check against
 * @returns True if date is in quarter, false otherwise
 */
export function isDateInQuarter(date: string | Date, quarterKey: QuarterKey): boolean {
  const checkDate = typeof date === 'string' ? parseISO(date) : date;
  const quarter = QUARTERS[quarterKey];

  if (!quarter) return false;

  const start = parseISO(quarter.start);
  const end = parseISO(quarter.end);

  return isWithinInterval(checkDate, { start, end });
}

/**
 * Checks if a date falls within a break period
 *
 * @param date - Date to check
 * @returns Break period object if in a break, null otherwise
 */
export function isDateInBreak(date: string | Date): BreakPeriod | null {
  const checkDate = typeof date === 'string' ? parseISO(date) : date;

  for (const quarter of Object.values(QUARTERS)) {
    for (const breakPeriod of quarter.breaks) {
      const start = parseISO(breakPeriod.start);
      const end = parseISO(breakPeriod.end);

      if (isWithinInterval(checkDate, { start, end })) {
        return breakPeriod;
      }
    }
  }

  return null;
}

/**
 * Gets all breaks for a specific quarter
 *
 * @param quarterKey - Quarter key
 * @returns Array of break periods
 */
export function getQuarterBreaks(quarterKey: QuarterKey): BreakPeriod[] {
  const quarter = QUARTERS[quarterKey];
  return quarter ? [...quarter.breaks] : [];
}

/**
 * Gets all available quarters
 *
 * @returns Array of all quarter objects
 */
export function getAllQuarters(): Quarter[] {
  return Object.values(QUARTERS);
}

/**
 * Gets all quarter keys
 *
 * @returns Array of quarter key strings
 */
export function getAllQuarterKeys(): QuarterKey[] {
  return Object.keys(QUARTERS) as QuarterKey[];
}

/**
 * Checks if a date range spans multiple quarters
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns True if range spans multiple quarters
 */
export function spansMultipleQuarters(
  startDate: string | Date,
  endDate: string | Date
): boolean {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

  const startQuarter = getCurrentQuarter(start);
  const endQuarter = getCurrentQuarter(end);

  if (!startQuarter || !endQuarter) return false;

  return startQuarter.name !== endQuarter.name;
}

/**
 * Gets the next quarter after a given date
 *
 * @param date - Reference date
 * @returns Next quarter object or null if no next quarter
 */
export function getNextQuarter(date?: string | Date): Quarter | null {
  const checkDate = date
    ? (typeof date === 'string' ? parseISO(date) : date)
    : new Date();

  const quarters = getAllQuarters();

  for (const quarter of quarters) {
    const start = parseISO(quarter.start);
    if (isAfter(start, checkDate)) {
      return quarter;
    }
  }

  return null;
}

/**
 * Gets the previous quarter before a given date
 *
 * @param date - Reference date
 * @returns Previous quarter object or null if no previous quarter
 */
export function getPreviousQuarter(date?: string | Date): Quarter | null {
  const checkDate = date
    ? (typeof date === 'string' ? parseISO(date) : date)
    : new Date();

  const quarters = getAllQuarters().reverse();

  for (const quarter of quarters) {
    const end = parseISO(quarter.end);
    if (isBefore(end, checkDate)) {
      return quarter;
    }
  }

  return null;
}

/**
 * Formats a quarter name for display
 *
 * @param quarterKey - Quarter key
 * @returns Formatted quarter name
 */
export function formatQuarterName(quarterKey: QuarterKey): string {
  const quarter = QUARTERS[quarterKey];
  return quarter ? quarter.name : quarterKey;
}

/**
 * Checks if the application is currently in an academic year
 *
 * @param date - Optional date to check (defaults to today)
 * @returns True if in an academic year, false if between years
 */
export function isInAcademicYear(date?: string | Date): boolean {
  return getCurrentQuarter(date) !== null;
}
