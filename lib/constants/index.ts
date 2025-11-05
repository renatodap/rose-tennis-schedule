/**
 * Centralized constants and configuration
 *
 * This barrel file exports all constants from modular files for easy importing.
 *
 * @example
 * ```ts
 * import { EventType, BRAND_COLORS, TIME_FORMATS } from '@/lib/constants';
 * ```
 */

// Enumerations
export {
  UserRole,
  Gender,
  TeamLevel,
  EventType,
  RsvpResponse,
  HomeAwayType,
  DayOfWeek,
  AvailabilityStatus,
  RecurrenceType,
  FormFieldType,
  ChallengeStatus,
  NotificationType,
  RideShareStatus,
  BadgeType
} from './enums';

// Quarter definitions
export {
  QuarterId,
  QUARTERS,
  QUARTER_ORDER,
  DEFAULT_QUARTER_ID
} from './quarters';
export type { Quarter, QuarterBreak } from './quarters';

// UI constants
export {
  BRAND_COLORS,
  EVENT_TYPE_COLORS,
  RSVP_RESPONSE_COLORS,
  HOME_AWAY_COLORS,
  ROLE_COLORS,
  TOUCH_TARGETS,
  BREAKPOINTS,
  Z_INDEX,
  ANIMATION_DURATION,
  ANIMATION_EASING,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TYPOGRAPHY,
  ICON_SIZES,
  MAX_WIDTH,
  COMMON_CLASSES
} from './ui';

// Configuration
export {
  APP_TIMEZONE,
  TIME_FORMATS,
  VALIDATION_RULES,
  PAGINATION,
  TIME_SLOTS,
  CACHE_CONFIG,
  NOTIFICATION_CONFIG,
  CHALLENGE_CONFIG,
  RSVP_CONFIG,
  FEATURE_FLAGS,
  API_ENDPOINTS,
  EXTERNAL_LINKS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  APP_METADATA
} from './config';
