/**
 * @deprecated This file is deprecated. Import from '@/lib/constants' instead.
 *
 * This file now re-exports from the modular constants structure for backward compatibility.
 * All new code should import directly from '@/lib/constants'.
 *
 * @example
 * ```ts
 * // Old (still works):
 * import { QUARTERS, EventType } from '@/lib/constants.ts';
 *
 * // New (preferred):
 * import { QUARTERS, EventType } from '@/lib/constants';
 * ```
 */

// Re-export everything from the new modular structure
export * from './constants';

// Type alias for backward compatibility (if needed)
export type { Quarter, QuarterBreak } from './constants/quarters';

/**
 * @deprecated Use RsvpResponse enum instead
 * This enum has been renamed for clarity
 */
export { RsvpResponse as ResponseStatus } from './constants/enums';
