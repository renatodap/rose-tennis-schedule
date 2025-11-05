/**
 * Enumerations used throughout the application
 *
 * These enums define the valid values for various domain concepts
 * and ensure type safety across the codebase.
 */

/**
 * User roles within the application
 *
 * Determines access levels and permissions:
 * - PLAYER: Standard team member (read-only for most features)
 * - CAPTAIN: Team leader (can manage team activities)
 * - COACH: Full admin access (can manage all aspects)
 */
export enum UserRole {
  PLAYER = 'player',
  CAPTAIN = 'captain',
  COACH = 'coach'
}

/**
 * Gender categories for team organization
 *
 * Rose-Hulman has separate men's and women's tennis teams
 */
export enum Gender {
  MEN = 'men',
  WOMEN = 'women'
}

/**
 * Team level classifications
 *
 * Used to distinguish between junior varsity and varsity teams
 */
export enum TeamLevel {
  JV = 'jv',
  VARSITY = 'varsity'
}

/**
 * Event type categories indicating attendance requirements
 *
 * Determines how events are displayed and whether RSVP is mandatory:
 * - OPTIONAL: No attendance required
 * - RECOMMENDED: Encouraged but not required
 * - MANDATORY: Must attend or provide excuse
 * - MATCH: Official tennis match (mandatory for players in lineup)
 */
export enum EventType {
  OPTIONAL = 'optional',
  RECOMMENDED = 'recommended',
  MANDATORY = 'mandatory',
  MATCH = 'match'
}

/**
 * RSVP response options for event attendance
 *
 * Used when users respond to event invitations
 */
export enum RsvpResponse {
  GOING = 'going',
  MAYBE = 'maybe',
  NOT_GOING = 'not_going',
  NO_RESPONSE = 'no_response'
}

/**
 * Match location types
 *
 * Indicates where a tennis match is being played
 */
export enum HomeAwayType {
  HOME = 'home',
  AWAY = 'away',
  NEUTRAL = 'neutral'
}

/**
 * Days of the week for scheduling (ISO 8601 standard)
 *
 * Values align with JavaScript Date.getDay() where Sunday = 0
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
 * Practice availability status
 *
 * Simplified boolean-like status for time slot availability
 */
export enum AvailabilityStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable'
}

/**
 * Blocker recurrence patterns
 *
 * Defines how frequently a blocker (exam, conflict) repeats
 */
export enum RecurrenceType {
  NONE = 'none',           // One-time event
  DAILY = 'daily',         // Repeats every day
  WEEKLY = 'weekly',       // Repeats same day each week
  BIWEEKLY = 'biweekly',   // Every other week
  MONTHLY = 'monthly'      // Same date each month
}

/**
 * Form field types for dynamic form builder
 *
 * Determines the input type when rendering form questions
 */
export enum FormFieldType {
  SHORT_TEXT = 'short_text',
  LONG_TEXT = 'long_text',
  MULTIPLE_CHOICE = 'multiple_choice',
  CHECKBOXES = 'checkboxes',
  DROPDOWN = 'dropdown',
  DATE = 'date',
  TIME = 'time',
  NUMBER = 'number',
  EMAIL = 'email',
  PHONE = 'phone',
  URL = 'url'
}

/**
 * Challenge status for ladder challenges
 *
 * Tracks the lifecycle of a tennis ladder challenge match
 */
export enum ChallengeStatus {
  PENDING = 'pending',           // Awaiting opponent acceptance
  ACCEPTED = 'accepted',         // Both players agreed, needs scheduling
  SCHEDULED = 'scheduled',       // Date/time set
  IN_PROGRESS = 'in_progress',   // Match underway
  COMPLETED = 'completed',       // Match finished, results recorded
  CANCELLED = 'cancelled',       // Challenge withdrawn
  EXPIRED = 'expired'            // Deadline passed without completion
}

/**
 * Notification types for push notifications
 *
 * Categorizes notifications for proper handling and display
 */
export enum NotificationType {
  EVENT_CREATED = 'event_created',
  EVENT_UPDATED = 'event_updated',
  EVENT_REMINDER = 'event_reminder',
  MATCH_REMINDER = 'match_reminder',
  CHALLENGE_RECEIVED = 'challenge_received',
  CHALLENGE_ACCEPTED = 'challenge_accepted',
  FORM_PUBLISHED = 'form_published',
  ANNOUNCEMENT = 'announcement'
}

/**
 * Ride share status for event transportation
 *
 * Indicates whether a user needs or offers a ride to an event
 */
export enum RideShareStatus {
  NEED_RIDE = 'need_ride',
  OFFERING_RIDE = 'offering_ride',
  RIDE_ARRANGED = 'ride_arranged',
  NO_RIDE_NEEDED = 'no_ride_needed'
}

/**
 * Badge types for user achievements
 *
 * Different categories of badges users can earn
 */
export enum BadgeType {
  ATTENDANCE = 'attendance',
  CHALLENGE = 'challenge',
  MILESTONE = 'milestone',
  SPECIAL = 'special'
}
