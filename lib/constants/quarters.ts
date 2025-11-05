/**
 * Academic quarter definitions for Rose-Hulman Institute of Technology
 *
 * Rose-Hulman operates on a quarter system with three academic quarters
 * (Fall, Winter, Spring) plus an optional Summer term.
 *
 * All dates are in America/Indiana/Indianapolis timezone (EST/EDT).
 */

/**
 * Quarter break period (holiday, spring break, etc.)
 */
export interface QuarterBreak {
  /** Display name of the break */
  name: string;
  /** Start date (ISO 8601 format: YYYY-MM-DD) */
  start: string;
  /** End date (ISO 8601 format: YYYY-MM-DD) */
  end: string;
}

/**
 * Quarter definition with date ranges and breaks
 */
export interface Quarter {
  /** Display name (e.g., "Fall 2025") */
  name: string;
  /** Quarter start date (ISO 8601 format: YYYY-MM-DD) */
  start: string;
  /** Quarter end date (ISO 8601 format: YYYY-MM-DD) */
  end: string;
  /** Academic breaks during this quarter */
  breaks: QuarterBreak[];
}

/**
 * Quarter identifiers
 *
 * Used as keys to access quarter data and for user selection
 */
export enum QuarterId {
  FALL_2025 = 'FALL_2025',
  WINTER_2025_26 = 'WINTER_2025_26',
  SPRING_2026 = 'SPRING_2026',
  SUMMER_2026 = 'SUMMER_2026'
}

/**
 * Academic quarter definitions for 2025-2026
 *
 * @example
 * ```ts
 * const currentQuarter = QUARTERS.FALL_2025;
 * console.log(currentQuarter.name); // "Fall 2025"
 * console.log(currentQuarter.start); // "2025-08-18"
 * ```
 */
export const QUARTERS: Record<QuarterId, Quarter> = {
  [QuarterId.FALL_2025]: {
    name: 'Fall 2025',
    start: '2025-08-18',
    end: '2025-11-21',
    breaks: [
      {
        name: 'Thanksgiving Break',
        start: '2025-11-22',
        end: '2025-11-30'
      }
    ]
  },
  [QuarterId.WINTER_2025_26]: {
    name: 'Winter 2025-26',
    start: '2025-12-01',
    end: '2026-03-13',
    breaks: [
      {
        name: 'Winter Break',
        start: '2025-12-20',
        end: '2026-01-04'
      },
      {
        name: 'Spring Break',
        start: '2026-03-14',
        end: '2026-03-22'
      }
    ]
  },
  [QuarterId.SPRING_2026]: {
    name: 'Spring 2026',
    start: '2026-03-23',
    end: '2026-06-05',
    breaks: []
  },
  [QuarterId.SUMMER_2026]: {
    name: 'Summer 2026',
    start: '2026-06-06',
    end: '2026-08-17',
    breaks: []
  }
} as const;

/**
 * Ordered list of quarter IDs for iteration
 *
 * @example
 * ```ts
 * QUARTER_ORDER.map(id => QUARTERS[id].name)
 * // ["Fall 2025", "Winter 2025-26", "Spring 2026", "Summer 2026"]
 * ```
 */
export const QUARTER_ORDER: QuarterId[] = [
  QuarterId.FALL_2025,
  QuarterId.WINTER_2025_26,
  QuarterId.SPRING_2026,
  QuarterId.SUMMER_2026
];

/**
 * Default quarter to use when user hasn't selected one
 *
 * Should be updated each academic year
 */
export const DEFAULT_QUARTER_ID = QuarterId.FALL_2025;
