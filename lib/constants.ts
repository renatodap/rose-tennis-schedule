/**
 * Application-wide constants for Rose-Hulman Tennis team availability management
 */

/**
 * Quarter date ranges for the academic year
 * All dates are in America/Indiana/Indianapolis timezone
 */
export const QUARTERS = {
  FALL_2025: {
    name: 'Fall 2025',
    start: '2025-08-18',
    end: '2025-11-21',
    breaks: [
      { name: 'Thanksgiving Break', start: '2025-11-22', end: '2025-11-30' }
    ]
  },
  WINTER_2025_26: {
    name: 'Winter 2025-26',
    start: '2025-12-01',
    end: '2026-03-13',
    breaks: [
      { name: 'Winter Break', start: '2025-12-20', end: '2026-01-04' },
      { name: 'Spring Break', start: '2026-03-14', end: '2026-03-22' }
    ]
  },
  SPRING_2026: {
    name: 'Spring 2026',
    start: '2026-03-23',
    end: '2026-06-05',
    breaks: []
  },
  SUMMER_2026: {
    name: 'Summer 2026',
    start: '2026-06-06',
    end: '2026-08-17',
    breaks: []
  }
} as const;

/**
 * User roles within the application
 */
export enum UserRole {
  PLAYER = 'player',
  CAPTAIN = 'captain',
  COACH = 'coach'
}

/**
 * Gender categories for team organization
 */
export enum Gender {
  MEN = 'men',
  WOMEN = 'women'
}

/**
 * Team level classifications
 */
export enum TeamLevel {
  JV = 'jv',
  VARSITY = 'varsity'
}

/**
 * Event type categories indicating attendance requirements
 */
export enum EventType {
  OPTIONAL = 'optional',
  RECOMMENDED = 'recommended',
  MANDATORY = 'mandatory',
  MATCH = 'match'
}

/**
 * Match location types
 */
export enum HomeAwayType {
  HOME = 'home',
  AWAY = 'away',
  NEUTRAL = 'neutral'
}

/**
 * Days of the week for scheduling
 */
export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6
}

/**
 * Application timezone
 */
export const APP_TIMEZONE = 'America/Indiana/Indianapolis';

/**
 * Brand colors
 */
export const BRAND_COLORS = {
  PRIMARY: '#800000', // Rose-Hulman maroon
  PRIMARY_LIGHT: '#a31f34',
  PRIMARY_DARK: '#5c0000',
  SECONDARY: '#1f2937', // Neutral gray
  ACCENT: '#f59e0b' // Amber for highlights
} as const;

/**
 * Time formats used throughout the application
 */
export const TIME_FORMATS = {
  DISPLAY_TIME: 'h:mm a', // 3:30 PM
  DISPLAY_DATE: 'MMM d, yyyy', // Jan 1, 2025
  DISPLAY_DATETIME: 'MMM d, yyyy h:mm a', // Jan 1, 2025 3:30 PM
  ISO_DATE: 'yyyy-MM-dd', // 2025-01-01
  ISO_DATETIME: "yyyy-MM-dd'T'HH:mm:ss", // 2025-01-01T15:30:00
  DAY_OF_WEEK: 'EEEE' // Monday
} as const;

/**
 * Response status options for event attendance
 */
export enum ResponseStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  MAYBE = 'maybe',
  NO_RESPONSE = 'no_response'
}

/**
 * Practice availability status
 */
export enum AvailabilityStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable'
}
