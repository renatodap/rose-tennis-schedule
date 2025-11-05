/**
 * Quarter Context - Global quarter selection management
 *
 * Manages the currently selected academic quarter throughout the app.
 * Persists selection to localStorage and provides utility functions.
 *
 * @example
 * ```tsx
 * // In your app root
 * <QuarterProvider>
 *   <App />
 * </QuarterProvider>
 *
 * // In any component
 * const { currentQuarter, quarterId, setQuarterId, quarters } = useQuarter();
 *
 * console.log(currentQuarter.name); // "Fall 2025"
 * setQuarterId(QuarterId.WINTER_2025_26);
 * ```
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  QUARTERS,
  QUARTER_ORDER,
  DEFAULT_QUARTER_ID,
  QuarterId,
  STORAGE_KEYS
} from '@/lib/constants';
import type { Quarter } from '@/lib/constants';
import { parseISO, isWithinInterval } from 'date-fns';

/**
 * Quarter context value
 */
interface QuarterContextValue {
  /** Currently selected quarter ID */
  quarterId: QuarterId;

  /** Currently selected quarter data */
  currentQuarter: Quarter;

  /** All available quarters */
  quarters: typeof QUARTERS;

  /** All quarter IDs in order */
  quarterOrder: QuarterId[];

  /** Set the active quarter */
  setQuarterId: (id: QuarterId) => void;

  /** Get quarter by ID */
  getQuarter: (id: QuarterId) => Quarter;

  /** Check if a date is in the current quarter */
  isInCurrentQuarter: (date: Date) => boolean;

  /** Get the current quarter based on today's date */
  getCurrentQuarterByDate: () => QuarterId;
}

const QuarterContext = createContext<QuarterContextValue | null>(null);

/**
 * Gets the quarter ID for a given date
 */
function getQuarterIdByDate(date: Date): QuarterId {
  for (const [id, quarter] of Object.entries(QUARTERS) as [QuarterId, Quarter][]) {
    const start = parseISO(quarter.start);
    const end = parseISO(quarter.end);
    if (isWithinInterval(date, { start, end })) {
      return id;
    }
  }
  // Default to first quarter if date is outside all ranges
  return DEFAULT_QUARTER_ID;
}

/**
 * Quarter Provider Component
 */
export function QuarterProvider({ children }: { children: React.ReactNode }) {
  // Initialize from localStorage or current date
  const [quarterId, setQuarterIdState] = useState<QuarterId>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_QUARTER_ID;
    }

    // Try to load from localStorage
    const stored = localStorage.getItem(STORAGE_KEYS.QUARTER);
    if (stored && stored in QUARTERS) {
      return stored as QuarterId;
    }

    // Otherwise, detect current quarter by date
    return getQuarterIdByDate(new Date());
  });

  // Persist to localStorage when quarter changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.QUARTER, quarterId);
    }
  }, [quarterId]);

  /**
   * Sets the active quarter ID
   */
  const setQuarterId = useCallback((id: QuarterId) => {
    if (!(id in QUARTERS)) {
      console.error(`Invalid quarter ID: ${id}`);
      return;
    }
    setQuarterIdState(id);
  }, []);

  /**
   * Gets quarter data by ID
   */
  const getQuarter = useCallback((id: QuarterId): Quarter => {
    return QUARTERS[id];
  }, []);

  /**
   * Checks if a date is within the current quarter
   */
  const isInCurrentQuarter = useCallback(
    (date: Date): boolean => {
      const quarter = QUARTERS[quarterId];
      const start = parseISO(quarter.start);
      const end = parseISO(quarter.end);
      return isWithinInterval(date, { start, end });
    },
    [quarterId]
  );

  /**
   * Gets current quarter based on today's date
   */
  const getCurrentQuarterByDate = useCallback((): QuarterId => {
    return getQuarterIdByDate(new Date());
  }, []);

  const value: QuarterContextValue = {
    quarterId,
    currentQuarter: QUARTERS[quarterId],
    quarters: QUARTERS,
    quarterOrder: QUARTER_ORDER,
    setQuarterId,
    getQuarter,
    isInCurrentQuarter,
    getCurrentQuarterByDate
  };

  return (
    <QuarterContext.Provider value={value}>
      {children}
    </QuarterContext.Provider>
  );
}

/**
 * Hook to use quarter context
 */
export function useQuarter() {
  const context = useContext(QuarterContext);
  if (!context) {
    throw new Error('useQuarter must be used within QuarterProvider');
  }
  return context;
}
