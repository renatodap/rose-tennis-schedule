/**
 * Application configuration constants
 *
 * Time formats, timezone settings, validation rules, and feature flags.
 */

/**
 * Application timezone
 *
 * All dates/times in the application are converted to this timezone
 * Rose-Hulman is located in Terre Haute, Indiana
 */
export const APP_TIMEZONE = 'America/Indiana/Indianapolis';

/**
 * Time and date format strings (date-fns)
 *
 * @example
 * ```ts
 * import { format } from 'date-fns';
 * format(new Date(), TIME_FORMATS.DISPLAY_TIME); // "3:30 PM"
 * format(new Date(), TIME_FORMATS.DISPLAY_DATE); // "Jan 1, 2025"
 * ```
 */
export const TIME_FORMATS = {
  /** 12-hour time format (3:30 PM) */
  DISPLAY_TIME: 'h:mm a',
  /** Short time format (3:30 PM) */
  SHORT_TIME: 'h:mm a',
  /** Long time format (3:30:00 PM) */
  LONG_TIME: 'h:mm:ss a',
  /** Date format (Jan 1, 2025) */
  DISPLAY_DATE: 'MMM d, yyyy',
  /** Short date format (1/1/25) */
  SHORT_DATE: 'M/d/yy',
  /** Long date format (January 1, 2025) */
  LONG_DATE: 'MMMM d, yyyy',
  /** Date and time (Jan 1, 2025 3:30 PM) */
  DISPLAY_DATETIME: 'MMM d, yyyy h:mm a',
  /** ISO date format (2025-01-01) */
  ISO_DATE: 'yyyy-MM-dd',
  /** ISO datetime format (2025-01-01T15:30:00) */
  ISO_DATETIME: "yyyy-MM-dd'T'HH:mm:ss",
  /** Day of week (Monday) */
  DAY_OF_WEEK: 'EEEE',
  /** Short day of week (Mon) */
  SHORT_DAY: 'EEE',
  /** Month and year (January 2025) */
  MONTH_YEAR: 'MMMM yyyy',
  /** Relative time format (used with formatDistanceToNow) */
  RELATIVE: 'relative'
} as const;

/**
 * Validation rules for user input
 */
export const VALIDATION_RULES = {
  /** Password minimum length */
  PASSWORD_MIN_LENGTH: 8,
  /** Password maximum length */
  PASSWORD_MAX_LENGTH: 128,
  /** Username minimum length */
  USERNAME_MIN_LENGTH: 3,
  /** Username maximum length */
  USERNAME_MAX_LENGTH: 50,
  /** Email maximum length */
  EMAIL_MAX_LENGTH: 255,
  /** Phone number regex (US format) */
  PHONE_REGEX: /^(\+1)?[\s.-]?\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}$/,
  /** Event title max length */
  EVENT_TITLE_MAX_LENGTH: 100,
  /** Event description max length */
  EVENT_DESCRIPTION_MAX_LENGTH: 2000,
  /** Form question max length */
  FORM_QUESTION_MAX_LENGTH: 500,
  /** Form response max length */
  FORM_RESPONSE_MAX_LENGTH: 5000,
  /** Profile bio max length */
  PROFILE_BIO_MAX_LENGTH: 500,
  /** Max file upload size (5MB) */
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  /** Allowed image types */
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  /** Default page size for lists */
  DEFAULT_PAGE_SIZE: 20,
  /** Page size options for user selection */
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  /** Maximum page size (prevent performance issues) */
  MAX_PAGE_SIZE: 100
} as const;

/**
 * Time slot configuration for scheduling
 */
export const TIME_SLOTS = {
  /** Start of day (6:00 AM) */
  DAY_START_HOUR: 6,
  /** End of day (10:00 PM) */
  DAY_END_HOUR: 22,
  /** Time slot duration in minutes */
  SLOT_DURATION_MINUTES: 30,
  /** Minimum event duration in minutes */
  MIN_EVENT_DURATION: 15,
  /** Maximum event duration in hours */
  MAX_EVENT_DURATION_HOURS: 8
} as const;

/**
 * Cache and data fetching configuration
 */
export const CACHE_CONFIG = {
  /** Stale time for query cache (5 minutes) */
  STALE_TIME: 5 * 60 * 1000,
  /** Cache time for query cache (10 minutes) */
  CACHE_TIME: 10 * 60 * 1000,
  /** Refetch interval for real-time data (30 seconds) */
  REFETCH_INTERVAL: 30 * 1000,
  /** Request timeout (10 seconds) */
  REQUEST_TIMEOUT: 10 * 1000
} as const;

/**
 * Notification configuration
 */
export const NOTIFICATION_CONFIG = {
  /** Toast notification duration (milliseconds) */
  TOAST_DURATION: 5000,
  /** Error notification duration (milliseconds) */
  ERROR_DURATION: 7000,
  /** Success notification duration (milliseconds) */
  SUCCESS_DURATION: 3000,
  /** Max concurrent toasts */
  MAX_TOASTS: 3,
  /** Event reminder time (minutes before event) */
  EVENT_REMINDER_MINUTES: 30,
  /** Match reminder time (hours before match) */
  MATCH_REMINDER_HOURS: 24
} as const;

/**
 * Challenge system configuration
 */
export const CHALLENGE_CONFIG = {
  /** Days to accept challenge */
  ACCEPTANCE_DEADLINE_DAYS: 3,
  /** Days to complete challenge after acceptance */
  COMPLETION_DEADLINE_DAYS: 7,
  /** Maximum ladder positions user can challenge up */
  MAX_CHALLENGE_POSITIONS: 3,
  /** Minimum time between challenges (days) */
  MIN_CHALLENGE_INTERVAL_DAYS: 1
} as const;

/**
 * RSVP configuration
 */
export const RSVP_CONFIG = {
  /** Hours before event when RSVP closes */
  RSVP_CLOSE_HOURS: 2,
  /** Days before event to send reminder */
  REMINDER_DAYS: 1,
  /** Allow RSVP changes up to this many hours before event */
  ALLOW_CHANGES_HOURS: 24
} as const;

/**
 * Feature flags for gradual rollout or A/B testing
 *
 * Set to true to enable feature, false to disable
 */
export const FEATURE_FLAGS = {
  /** Enable push notifications */
  PUSH_NOTIFICATIONS: true,
  /** Enable ride-share feature */
  RIDE_SHARE: true,
  /** Enable challenge ladder */
  CHALLENGE_LADDER: true,
  /** Enable form builder */
  FORM_BUILDER: true,
  /** Enable badge system */
  BADGE_SYSTEM: false, // Not yet implemented
  /** Enable dark mode */
  DARK_MODE: false, // Not yet implemented
  /** Enable real-time updates */
  REAL_TIME_UPDATES: true,
  /** Enable offline mode */
  OFFLINE_MODE: false, // Not yet implemented
  /** Enable analytics tracking */
  ANALYTICS: false, // Privacy consideration
  /** Enable email notifications */
  EMAIL_NOTIFICATIONS: true
} as const;

/**
 * API endpoints (relative to base URL)
 */
export const API_ENDPOINTS = {
  /** Health check endpoint */
  HEALTH: '/api/health',
  /** Cron job for sending reminders */
  CRON_REMINDERS: '/api/cron/send-reminders',
  /** Send email notification */
  EMAIL_SEND: '/api/email/send',
  /** Schedule push notification */
  PUSH_SCHEDULE: '/api/push/schedule',
  /** Upload file */
  UPLOAD: '/api/upload',
  /** Import match schedule */
  IMPORT_SCHEDULE: '/api/matches/import'
} as const;

/**
 * External links
 */
export const EXTERNAL_LINKS = {
  /** Rose-Hulman homepage */
  ROSE_HULMAN: 'https://www.rose-hulman.edu',
  /** Rose-Hulman athletics */
  ATHLETICS: 'https://rosehulmanathletics.com',
  /** Rose-Hulman tennis (men) */
  TENNIS_MEN: 'https://rosehulmanathletics.com/sports/mens-tennis',
  /** Rose-Hulman tennis (women) */
  TENNIS_WOMEN: 'https://rosehulmanathletics.com/sports/womens-tennis',
  /** ITA (Intercollegiate Tennis Association) */
  ITA: 'https://www.wearecollegetennis.com',
  /** USTA (United States Tennis Association) */
  USTA: 'https://www.usta.com'
} as const;

/**
 * Storage keys for localStorage/sessionStorage
 */
export const STORAGE_KEYS = {
  /** Selected quarter */
  QUARTER: 'selected_quarter',
  /** User preferences */
  PREFERENCES: 'user_preferences',
  /** Theme (light/dark) */
  THEME: 'theme',
  /** Push notification permission status */
  PUSH_PERMISSION: 'push_permission',
  /** Last sync timestamp */
  LAST_SYNC: 'last_sync',
  /** Offline data cache */
  OFFLINE_CACHE: 'offline_cache',
  /** Onboarding completed flag */
  ONBOARDING_COMPLETE: 'onboarding_complete'
} as const;

/**
 * Error messages for consistent user feedback
 */
export const ERROR_MESSAGES = {
  /** Generic error message */
  GENERIC: 'Something went wrong. Please try again.',
  /** Network error */
  NETWORK: 'Network error. Please check your connection and try again.',
  /** Authentication error */
  AUTH: 'You must be logged in to perform this action.',
  /** Authorization error */
  FORBIDDEN: 'You do not have permission to perform this action.',
  /** Not found error */
  NOT_FOUND: 'The requested resource was not found.',
  /** Validation error */
  VALIDATION: 'Please check your input and try again.',
  /** Timeout error */
  TIMEOUT: 'Request timed out. Please try again.',
  /** File upload error */
  UPLOAD: 'Failed to upload file. Please ensure it meets the requirements.',
  /** Form submission error */
  FORM_SUBMIT: 'Failed to submit form. Please try again.',
  /** Delete confirmation */
  DELETE_CONFIRM: 'Are you sure you want to delete this? This action cannot be undone.'
} as const;

/**
 * Success messages for consistent user feedback
 */
export const SUCCESS_MESSAGES = {
  /** Generic success */
  GENERIC: 'Action completed successfully.',
  /** Item created */
  CREATED: 'Item created successfully.',
  /** Item updated */
  UPDATED: 'Changes saved successfully.',
  /** Item deleted */
  DELETED: 'Item deleted successfully.',
  /** RSVP updated */
  RSVP_UPDATED: 'Your RSVP has been recorded.',
  /** Profile updated */
  PROFILE_UPDATED: 'Profile updated successfully.',
  /** Email sent */
  EMAIL_SENT: 'Email sent successfully.',
  /** Notification scheduled */
  NOTIFICATION_SCHEDULED: 'Notification scheduled successfully.'
} as const;

/**
 * Application metadata
 */
export const APP_METADATA = {
  /** Application name */
  NAME: 'Rose-Hulman Tennis Schedule',
  /** Short name for PWA */
  SHORT_NAME: 'RH Tennis',
  /** Application description */
  DESCRIPTION: 'Tennis team availability and schedule management for Rose-Hulman Institute of Technology',
  /** Application version (should match package.json) */
  VERSION: '1.0.0',
  /** Support email */
  SUPPORT_EMAIL: 'tennis@rose-hulman.edu',
  /** Repository URL */
  REPOSITORY: 'https://github.com/rose-hulman/tennis-schedule'
} as const;
