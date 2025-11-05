/**
 * UI-related constants for consistent styling across the application
 *
 * Includes colors, sizing, animations, and visual design tokens.
 */

import type { EventType, RsvpResponse, HomeAwayType, UserRole } from './enums';

/**
 * Brand colors for Rose-Hulman Institute of Technology
 *
 * Primary color is the official Rose-Hulman maroon (#8A2432)
 */
export const BRAND_COLORS = {
  /** Rose-Hulman maroon (primary brand color) */
  PRIMARY: '#8A2432',
  /** Lighter shade of maroon for hover states */
  PRIMARY_LIGHT: '#a31f34',
  /** Darker shade of maroon for active states */
  PRIMARY_DARK: '#5c0000',
  /** Neutral gray for secondary elements */
  SECONDARY: '#1f2937',
  /** Amber accent color for highlights and CTAs */
  ACCENT: '#f59e0b',
  /** White for light backgrounds */
  WHITE: '#ffffff',
  /** Near-black for text */
  BLACK: '#0f172a'
} as const;

/**
 * Event type color mapping for consistent visual identification
 *
 * Used for badges, borders, and backgrounds to quickly identify event types
 *
 * @example
 * ```tsx
 * <Badge className={EVENT_TYPE_COLORS[event.event_type].badge}>
 *   {event.event_type}
 * </Badge>
 * ```
 */
export const EVENT_TYPE_COLORS: Record<
  EventType,
  {
    badge: string;
    border: string;
    background: string;
    text: string;
  }
> = {
  optional: {
    badge: 'bg-blue-100 text-blue-800 border-blue-300',
    border: 'border-blue-500',
    background: 'bg-blue-50',
    text: 'text-blue-700'
  },
  recommended: {
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    border: 'border-yellow-500',
    background: 'bg-yellow-50',
    text: 'text-yellow-700'
  },
  mandatory: {
    badge: 'bg-red-100 text-red-800 border-red-300',
    border: 'border-red-500',
    background: 'bg-red-50',
    text: 'text-red-700'
  },
  match: {
    badge: 'bg-purple-100 text-purple-800 border-purple-300',
    border: 'border-purple-500',
    background: 'bg-purple-50',
    text: 'text-purple-700'
  }
} as const;

/**
 * RSVP response color mapping for visual feedback
 *
 * @example
 * ```tsx
 * <div className={RSVP_RESPONSE_COLORS[response].background}>
 *   {response}
 * </div>
 * ```
 */
export const RSVP_RESPONSE_COLORS: Record<
  RsvpResponse,
  {
    badge: string;
    icon: string;
    background: string;
    text: string;
  }
> = {
  going: {
    badge: 'bg-green-100 text-green-800 border-green-300',
    icon: 'text-green-600',
    background: 'bg-green-50',
    text: 'text-green-700'
  },
  maybe: {
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: 'text-yellow-600',
    background: 'bg-yellow-50',
    text: 'text-yellow-700'
  },
  not_going: {
    badge: 'bg-red-100 text-red-800 border-red-300',
    icon: 'text-red-600',
    background: 'bg-red-50',
    text: 'text-red-700'
  },
  no_response: {
    badge: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: 'text-gray-600',
    background: 'bg-gray-50',
    text: 'text-gray-700'
  }
} as const;

/**
 * Home/away match color coding
 */
export const HOME_AWAY_COLORS: Record<
  HomeAwayType,
  {
    badge: string;
    icon: string;
    text: string;
  }
> = {
  home: {
    badge: 'bg-green-100 text-green-800',
    icon: 'text-green-600',
    text: 'text-green-700'
  },
  away: {
    badge: 'bg-blue-100 text-blue-800',
    icon: 'text-blue-600',
    text: 'text-blue-700'
  },
  neutral: {
    badge: 'bg-gray-100 text-gray-800',
    icon: 'text-gray-600',
    text: 'text-gray-700'
  }
} as const;

/**
 * User role badge colors
 */
export const ROLE_COLORS: Record<
  UserRole,
  {
    badge: string;
    text: string;
  }
> = {
  player: {
    badge: 'bg-blue-100 text-blue-800',
    text: 'text-blue-700'
  },
  captain: {
    badge: 'bg-purple-100 text-purple-800',
    text: 'text-purple-700'
  },
  coach: {
    badge: 'bg-red-100 text-red-800',
    text: 'text-red-700'
  }
} as const;

/**
 * Touch target sizes for mobile optimization
 *
 * Based on iOS Human Interface Guidelines (44x44pt) and
 * Material Design guidelines (48x48dp)
 */
export const TOUCH_TARGETS = {
  /** Minimum touch target size (iOS standard) */
  MIN_SIZE: 44,
  /** Recommended touch target size (Material Design) */
  RECOMMENDED_SIZE: 48,
  /** Small interactive elements (with adequate spacing) */
  SMALL: 36,
  /** Medium buttons and controls */
  MEDIUM: 44,
  /** Large primary action buttons */
  LARGE: 56
} as const;

/**
 * Responsive breakpoints (matches Tailwind CSS defaults)
 *
 * Mobile-first approach: base styles for mobile, then add larger breakpoints
 */
export const BREAKPOINTS = {
  xs: 320,   // Small phones (iPhone SE)
  sm: 640,   // Large phones (iPhone 14)
  md: 768,   // Tablets (iPad Mini)
  lg: 1024,  // Desktop/Laptop
  xl: 1280,  // Large Desktop
  '2xl': 1536 // Ultra-wide
} as const;

/**
 * Z-index layers for consistent stacking context
 *
 * Use these instead of arbitrary z-index values
 */
export const Z_INDEX = {
  /** Base layer (default) */
  BASE: 0,
  /** Dropdown menus */
  DROPDOWN: 10,
  /** Sticky headers */
  STICKY: 20,
  /** Fixed navigation */
  FIXED: 30,
  /** Modals and overlays */
  MODAL: 40,
  /** Tooltips */
  TOOLTIP: 50,
  /** Toast notifications */
  TOAST: 60,
  /** Maximum z-index (loading overlays) */
  MAX: 999
} as const;

/**
 * Animation duration values (in milliseconds)
 *
 * Based on Material Design motion guidelines
 */
export const ANIMATION_DURATION = {
  /** Very fast (micro-interactions) */
  FASTEST: 100,
  /** Fast (tooltips, simple transitions) */
  FAST: 150,
  /** Normal (default for most transitions) */
  NORMAL: 200,
  /** Moderate (complex transitions) */
  MODERATE: 300,
  /** Slow (page transitions, complex animations) */
  SLOW: 500
} as const;

/**
 * Animation easing functions
 *
 * CSS cubic-bezier values for smooth animations
 */
export const ANIMATION_EASING = {
  /** Standard easing (most common) */
  STANDARD: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  /** Decelerate (incoming elements) */
  DECELERATE: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  /** Accelerate (outgoing elements) */
  ACCELERATE: 'cubic-bezier(0.4, 0.0, 1, 1)',
  /** Sharp (instant attention) */
  SHARP: 'cubic-bezier(0.4, 0.0, 0.6, 1)'
} as const;

/**
 * Spacing scale (in pixels)
 *
 * Use for consistent spacing throughout the app
 * Matches Tailwind's spacing scale
 */
export const SPACING = {
  0: 0,
  1: 4,    // 0.25rem
  2: 8,    // 0.5rem
  3: 12,   // 0.75rem
  4: 16,   // 1rem
  5: 20,   // 1.25rem
  6: 24,   // 1.5rem
  8: 32,   // 2rem
  10: 40,  // 2.5rem
  12: 48,  // 3rem
  16: 64,  // 4rem
  20: 80,  // 5rem
  24: 96   // 6rem
} as const;

/**
 * Border radius values
 *
 * Consistent rounding for cards, buttons, and containers
 */
export const BORDER_RADIUS = {
  /** No rounding */
  NONE: 0,
  /** Small radius (badges, tags) */
  SM: 4,
  /** Default radius (buttons, inputs) */
  DEFAULT: 8,
  /** Medium radius (cards) */
  MD: 12,
  /** Large radius (modals, large cards) */
  LG: 16,
  /** Extra large radius (bottom sheets) */
  XL: 24,
  /** Full circle/pill shape */
  FULL: 9999
} as const;

/**
 * Shadow levels for depth perception
 *
 * Tailwind CSS shadow classes
 */
export const SHADOWS = {
  NONE: 'shadow-none',
  SM: 'shadow-sm',
  DEFAULT: 'shadow',
  MD: 'shadow-md',
  LG: 'shadow-lg',
  XL: 'shadow-xl',
  INNER: 'shadow-inner'
} as const;

/**
 * Typography scale
 *
 * Responsive font size classes
 */
export const TYPOGRAPHY = {
  h1: 'text-2xl sm:text-3xl lg:text-4xl font-bold',
  h2: 'text-xl sm:text-2xl lg:text-3xl font-bold',
  h3: 'text-lg sm:text-xl lg:text-2xl font-semibold',
  h4: 'text-base sm:text-lg font-semibold',
  body: 'text-sm sm:text-base',
  small: 'text-xs sm:text-sm',
  tiny: 'text-xs'
} as const;

/**
 * Icon sizes (Lucide React)
 *
 * Standard sizes for consistent icon usage
 */
export const ICON_SIZES = {
  XS: 12,
  SM: 16,
  MD: 20,
  LG: 24,
  XL: 32,
  XXL: 48
} as const;

/**
 * Maximum content widths for readable layouts
 */
export const MAX_WIDTH = {
  SM: 640,   // Small content (forms, cards)
  MD: 768,   // Medium content (articles)
  LG: 1024,  // Large content (dashboards)
  XL: 1280,  // Extra large (full-width dashboards)
  FULL: '100%' // No max width
} as const;

/**
 * Common CSS class combinations for reusability
 */
export const COMMON_CLASSES = {
  /** Centered flex container */
  flexCenter: 'flex items-center justify-center',
  /** Flex row with gap */
  flexRow: 'flex flex-row items-center gap-2',
  /** Flex column with gap */
  flexCol: 'flex flex-col gap-2',
  /** Absolute center positioning */
  absoluteCenter: 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
  /** Card base styles */
  card: 'rounded-lg border bg-card p-4 shadow-sm',
  /** Button base styles */
  button: 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2',
  /** Input base styles */
  input: 'flex h-11 w-full rounded-lg border bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2',
  /** Screen reader only */
  srOnly: 'absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0',
  /** Truncate text with ellipsis */
  truncate: 'overflow-hidden text-ellipsis whitespace-nowrap',
  /** Smooth transition */
  transition: 'transition-all duration-200 ease-in-out'
} as const;
