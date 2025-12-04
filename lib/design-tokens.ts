/**
 * $100M DESIGN SYSTEM - DESIGN TOKENS
 *
 * TypeScript design token exports for use in JavaScript/TypeScript
 * Provides type-safe access to design system values
 * Synchronized with Tailwind config and CSS custom properties
 */

/**
 * COLOR PALETTE
 * Modern evolution of Rose-Hulman maroon with athletic energy
 */
export const colors = {
  // Modern Maroon Scale
  maroon: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#dc2626',  // Base athletic red
    600: '#b91c1c',
    700: '#991b1b',  // Rich maroon (primary)
    800: '#7f1d1d',  // Deep maroon (traditional)
    900: '#5c0a0a',
    950: '#3d0505',
  },

  // Accent Colors
  accent: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',  // Tennis ball green
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    700: '#15803d',
  },

  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    700: '#b45309',
  },

  error: {
    50: '#fef2f2',
    500: '#ef4444',
    700: '#b91c1c',
  },

  info: {
    50: '#eff6ff',
    500: '#3b82f6',
    700: '#1d4ed8',
  },

  // Neutrals
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
} as const;

/**
 * TYPOGRAPHY SCALE
 * Fluid, harmonious type system
 */
export const typography = {
  // Display sizes for hero sections
  display: {
    '2xl': {
      fontSize: '4.5rem',      // 72px
      lineHeight: '1.1',
      letterSpacing: '-0.02em',
      fontWeight: '700',
    },
    'xl': {
      fontSize: '3.75rem',     // 60px
      lineHeight: '1.1',
      letterSpacing: '-0.02em',
      fontWeight: '700',
    },
    'lg': {
      fontSize: '3rem',        // 48px
      lineHeight: '1.2',
      letterSpacing: '-0.01em',
      fontWeight: '700',
    },
  },

  // Heading sizes
  heading: {
    h1: {
      fontSize: '2.25rem',     // 36px
      lineHeight: '1.2',
      letterSpacing: '-0.01em',
      fontWeight: '600',
    },
    h2: {
      fontSize: '1.875rem',    // 30px
      lineHeight: '1.3',
      letterSpacing: '-0.005em',
      fontWeight: '600',
    },
    h3: {
      fontSize: '1.5rem',      // 24px
      lineHeight: '1.3',
      letterSpacing: '0',
      fontWeight: '600',
    },
    h4: {
      fontSize: '1.25rem',     // 20px
      lineHeight: '1.4',
      letterSpacing: '0',
      fontWeight: '600',
    },
    h5: {
      fontSize: '1.125rem',    // 18px
      lineHeight: '1.4',
      letterSpacing: '0',
      fontWeight: '600',
    },
    h6: {
      fontSize: '1rem',        // 16px
      lineHeight: '1.5',
      letterSpacing: '0',
      fontWeight: '600',
    },
  },

  // Body text
  body: {
    xl: {
      fontSize: '1.25rem',     // 20px
      lineHeight: '1.6',
      letterSpacing: '0',
    },
    lg: {
      fontSize: '1.125rem',    // 18px
      lineHeight: '1.6',
      letterSpacing: '0',
    },
    base: {
      fontSize: '1rem',        // 16px
      lineHeight: '1.6',
      letterSpacing: '0',
    },
    sm: {
      fontSize: '0.875rem',    // 14px
      lineHeight: '1.5',
      letterSpacing: '0',
    },
  },

  // Utility text
  utility: {
    caption: {
      fontSize: '0.75rem',     // 12px
      lineHeight: '1.4',
      letterSpacing: '0.01em',
    },
    overline: {
      fontSize: '0.75rem',     // 12px
      lineHeight: '1.4',
      letterSpacing: '0.08em',
      fontWeight: '600',
      textTransform: 'uppercase',
    },
  },

  // Font weights
  weight: {
    book: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

/**
 * SPACING SYSTEM
 * 4px base unit system
 */
export const spacing = {
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px

  // Semantic spacing
  section: {
    xs: '2rem',    // 32px
    sm: '3rem',    // 48px
    md: '4rem',    // 64px
    lg: '6rem',    // 96px
    xl: '8rem',    // 128px
  },
} as const;

/**
 * BORDER RADIUS SYSTEM
 * Smooth, athletic corners
 */
export const radius = {
  none: '0',
  sm: '0.25rem',      // 4px - Subtle
  base: '0.375rem',   // 6px - Standard
  md: '0.5rem',       // 8px - Cards
  lg: '0.75rem',      // 12px - Large cards
  xl: '1rem',         // 16px - Modals
  '2xl': '1.5rem',    // 24px - Hero cards
  '3xl': '2rem',      // 32px - Featured elements
  full: '9999px',     // Pills, avatars
} as const;

/**
 * SHADOW SYSTEM
 * Premium, layered elevation
 */
export const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '2xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',

  // Interactive states
  hover: '0 12px 24px -6px rgba(0, 0, 0, 0.15), 0 6px 12px -6px rgba(0, 0, 0, 0.1)',
  press: '0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',

  // Colored shadows
  maroon: '0 10px 25px -5px rgba(128, 0, 0, 0.2), 0 4px 6px -4px rgba(128, 0, 0, 0.1)',
  maroonLg: '0 20px 40px -8px rgba(128, 0, 0, 0.25), 0 8px 16px -8px rgba(128, 0, 0, 0.15)',
  accent: '0 10px 25px -5px rgba(34, 197, 94, 0.2), 0 4px 6px -4px rgba(34, 197, 94, 0.1)',

  none: 'none',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
} as const;

/**
 * TRANSITION SYSTEM
 * Athletic, snappy motion
 */
export const transitions = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    emphasis: '500ms',
  },

  easing: {
    athletic: 'cubic-bezier(0.4, 0, 0.2, 1)',     // Fast out, slow in
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',  // Bouncy
    smooth: 'cubic-bezier(0.45, 0, 0.55, 1)',     // Smooth both ways
  },
} as const;

/**
 * Z-INDEX SCALE
 * Layering system
 */
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

/**
 * BREAKPOINTS
 * Responsive design breakpoints
 */
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * ANIMATION CONFIGURATIONS FOR FRAMER MOTION
 */
export const motionVariants = {
  // Fade animations
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } },
  },

  fadeOut: {
    visible: { opacity: 1 },
    hidden: { opacity: 0, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } },
  },

  // Slide animations
  slideUp: {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  },

  slideDown: {
    hidden: { y: -10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  },

  slideLeft: {
    hidden: { x: 10, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  },

  slideRight: {
    hidden: { x: -10, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  },

  // Scale animations
  scaleIn: {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } },
  },

  scaleOut: {
    visible: { scale: 1, opacity: 1 },
    hidden: { scale: 0.95, opacity: 0, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } },
  },

  // Spring animations (athletic bounce)
  springIn: {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 400, damping: 25 }
    },
  },

  // Stagger children
  stagger: {
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
} as const;

/**
 * SEMANTIC COLOR MAPPINGS
 * Map semantic meanings to color tokens
 */
export const semanticColors = {
  // RSVP States
  rsvp: {
    going: colors.success[500],        // Green
    maybe: colors.warning[500],        // Amber
    notGoing: colors.error[500],       // Red
    noResponse: colors.neutral[400],   // Gray
  },

  // Availability States
  availability: {
    available: colors.success[500],
    unavailable: colors.error[500],
  },

  // Event Types
  eventType: {
    optional: colors.info[500],
    recommended: colors.warning[500],
    mandatory: colors.error[500],
    match: colors.maroon[700],
  },

  // Match Types
  matchType: {
    home: colors.maroon[700],
    away: colors.neutral[600],
    neutral: colors.info[500],
  },
} as const;

/**
 * GRADIENT PRESETS
 */
export const gradients = {
  maroon: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
  maroonRadial: 'radial-gradient(circle at top left, #991b1b 0%, #dc2626 100%)',
  accent: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
  subtle: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.05) 100%)',
} as const;

/**
 * DESIGN TOKEN EXPORT
 * Complete design system object
 */
export const designTokens = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  motionVariants,
  semanticColors,
  gradients,
} as const;

export default designTokens;
