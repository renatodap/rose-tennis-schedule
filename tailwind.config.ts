import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Modern Maroon Evolution - Rich, Deep, Athletic
        'rose-hulman': {
          // Primary Maroon Scale - Deep crimson to rich burgundy
          50: '#fef2f2',   // Lightest tint
          100: '#fee2e2',  // Very light
          200: '#fecaca',  // Light
          300: '#fca5a5',  // Medium light
          400: '#f87171',  // Medium
          500: '#dc2626',  // Base athletic red
          600: '#b91c1c',  // Darker
          700: '#991b1b',  // Rich maroon
          800: '#7f1d1d',  // Deep maroon (close to traditional #800000)
          900: '#5c0a0a',  // Darkest maroon
          950: '#3d0505',  // Nearly black maroon

          // Named variants for intuitive usage
          maroon: 'hsl(var(--maroon))',           // Modern base: rich, saturated
          'maroon-deep': 'hsl(var(--maroon-deep))',     // Deeper, more intense
          'maroon-vivid': 'hsl(var(--maroon-vivid))',   // Vibrant, energetic
          'maroon-muted': 'hsl(var(--maroon-muted))',   // Sophisticated, subdued

          // Gradient endpoints
          'gradient-from': 'hsl(var(--maroon-gradient-from))',
          'gradient-to': 'hsl(var(--maroon-gradient-to))',
        },

        // Accent: Electric Tennis Energy
        accent: {
          50: '#f0fdf4',   // Lightest
          100: '#dcfce7',  // Very light
          200: '#bbf7d0',  // Light
          300: '#86efac',  // Medium light
          400: '#4ade80',  // Medium - Tennis ball green
          500: '#22c55e',  // Base green
          600: '#16a34a',  // Darker
          700: '#15803d',  // Deep green
          800: '#166534',  // Very deep
          900: '#14532d',  // Darkest
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        // Success: Going/Available
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',  // Vibrant green
          600: '#16a34a',
          700: '#15803d',
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },

        // Warning: Maybe/Tentative
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',  // Athletic amber
          600: '#d97706',
          700: '#b45309',
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },

        // Error: Not Going/Unavailable
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',  // Clear, strong red
          600: '#dc2626',
          700: '#b91c1c',
          DEFAULT: 'hsl(var(--error))',
          foreground: 'hsl(var(--error-foreground))',
        },

        // Info: Informational states
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',  // Clear blue
          600: '#2563eb',
          700: '#1d4ed8',
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },

        // Maroon: Primary brand color (same as rose-hulman)
        maroon: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#dc2626',
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#5c0a0a',
          950: '#3d0505',
        },

        // Neutrals: Cool, sophisticated grays
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

        // Surface colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
          active: 'hsl(var(--primary-active))',
        },

        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          hover: 'hsl(var(--secondary-hover))',
        },

        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },

        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          hover: 'hsl(var(--card-hover))',
          elevated: 'hsl(var(--card-elevated))',
        },

        overlay: {
          DEFAULT: 'hsl(var(--overlay))',
          dark: 'hsl(var(--overlay-dark))',
        },
      },

      // Typography Scale - Fluid, Harmonious
      fontSize: {
        // Display - Hero sections
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],

        // Headings
        'h1': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h2': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.005em', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' }],
        'h5': ['1.125rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' }],
        'h6': ['1rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '600' }],

        // Body
        'body-xl': ['1.25rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],

        // Utility
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
        'overline': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '600' }],
      },

      // Font Weights
      fontWeight: {
        book: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },

      // Spacing System - 4px base unit
      spacing: {
        '0': '0',
        '1': '0.25rem',   // 4px
        '2': '0.5rem',    // 8px
        '3': '0.75rem',   // 12px
        '4': '1rem',      // 16px
        '5': '1.25rem',   // 20px
        '6': '1.5rem',    // 24px
        '7': '1.75rem',   // 28px
        '8': '2rem',      // 32px
        '10': '2.5rem',   // 40px
        '12': '3rem',     // 48px
        '14': '3.5rem',   // 56px
        '16': '4rem',     // 64px
        '20': '5rem',     // 80px
        '24': '6rem',     // 96px
        '28': '7rem',     // 112px
        '32': '8rem',     // 128px

        // Component-specific
        'section-xs': '2rem',    // 32px
        'section-sm': '3rem',    // 48px
        'section-md': '4rem',    // 64px
        'section-lg': '6rem',    // 96px
        'section-xl': '8rem',    // 128px
      },

      // Border Radius - Smooth, Athletic
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',    // 4px - Subtle
        'DEFAULT': '0.375rem', // 6px - Standard
        'md': '0.5rem',     // 8px - Cards
        'lg': '0.75rem',    // 12px - Large cards
        'xl': '1rem',       // 16px - Modals
        '2xl': '1.5rem',    // 24px - Hero cards
        '3xl': '2rem',      // 32px - Featured elements
        'full': '9999px',   // Pills, avatars
      },

      // Shadows - Premium, Layered
      boxShadow: {
        // Subtle elevation
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'md': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '2xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',

        // Interactive states
        'hover': '0 12px 24px -6px rgba(0, 0, 0, 0.15), 0 6px 12px -6px rgba(0, 0, 0, 0.1)',
        'press': '0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',

        // Colored shadows for maroon elements
        'maroon': '0 10px 25px -5px rgba(128, 0, 0, 0.2), 0 4px 6px -4px rgba(128, 0, 0, 0.1)',
        'maroon-lg': '0 20px 40px -8px rgba(128, 0, 0, 0.25), 0 8px 16px -8px rgba(128, 0, 0, 0.15)',

        // Accent shadows
        'accent': '0 10px 25px -5px rgba(34, 197, 94, 0.2), 0 4px 6px -4px rgba(34, 197, 94, 0.1)',

        'none': 'none',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },

      // Transitions - Athletic, Snappy
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
        'emphasis': '500ms',
      },

      transitionTimingFunction: {
        'athletic': 'cubic-bezier(0.4, 0, 0.2, 1)',      // Fast out, slow in
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',   // Bouncy
        'smooth': 'cubic-bezier(0.45, 0, 0.55, 1)',      // Smooth both ways
      },

      // Animations - Micro-interactions
      keyframes: {
        // Accordion
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },

        // Fade
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },

        // Slide
        'slide-in-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },

        // Scale
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-out': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },

        // Bounce - Athletic energy
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },

        // Pulse - Attention grabber
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },

        // Shimmer - Loading states
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },

        // Spin - Loading
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },

      animation: {
        // Accordion
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',

        // Fade
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.15s ease-in',

        // Slide
        'slide-in-up': 'slide-in-up 0.3s ease-out',
        'slide-in-down': 'slide-in-down 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',

        // Scale
        'scale-in': 'scale-in 0.2s ease-out',
        'scale-out': 'scale-out 0.15s ease-in',

        // Athletic
        'bounce-subtle': 'bounce-subtle 1s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',

        // Loading
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
      },

      // Font Families
      fontFamily: {
        futura: ['var(--font-futura)', 'system-ui', '-apple-system', 'sans-serif'],
        minion: ['var(--font-minion)', 'Georgia', 'serif'],
        sans: ['var(--font-futura)', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['var(--font-minion)', 'Georgia', 'serif'],
      },

      // Breakpoints
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },

      // Z-index scale
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
