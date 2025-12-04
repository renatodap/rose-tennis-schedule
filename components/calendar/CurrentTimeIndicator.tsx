'use client';

/**
 * CurrentTimeIndicator - Red line showing current time in calendar
 * Updates position in real-time
 */

import { useEffect, useState } from 'react';
import { colors } from '@/lib/design-tokens';

interface CurrentTimeIndicatorProps {
  startHour: number;  // e.g., 6 for 6 AM
  endHour: number;    // e.g., 22 for 10 PM
  hourHeight: number; // Height of each hour slot in pixels
}

export function CurrentTimeIndicator({
  startHour,
  endHour,
  hourHeight
}: CurrentTimeIndicatorProps) {
  const [position, setPosition] = useState<number | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();

      // Only show if within calendar hours
      if (currentHour < startHour || currentHour >= endHour) {
        setPosition(null);
        return;
      }

      // Calculate position from top
      const hoursFromStart = currentHour - startHour;
      const minuteFraction = currentMinutes / 60;
      const totalPosition = (hoursFromStart + minuteFraction) * hourHeight;

      setPosition(totalPosition);
    };

    // Update immediately
    updatePosition();

    // Update every minute
    const interval = setInterval(updatePosition, 60000);

    return () => clearInterval(interval);
  }, [startHour, endHour, hourHeight]);

  if (position === null) return null;

  return (
    <div
      className="absolute left-0 right-0 z-10 pointer-events-none"
      style={{ top: `${position}px` }}
    >
      {/* Red circle dot */}
      <div
        className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full"
        style={{ backgroundColor: colors.error[500] }}
      />
      {/* Red line */}
      <div
        className="h-0.5 w-full"
        style={{ backgroundColor: colors.error[500] }}
      />
    </div>
  );
}
