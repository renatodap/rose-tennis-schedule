'use client';

/**
 * ClassScheduleBlock component - visual representation of a class on the calendar
 * Displays course name, time range, and location
 */

import { BRAND_COLORS } from '@/lib/constants';

interface ClassScheduleBlockProps {
  courseName?: string;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  location?: string;
  onClick?: () => void;
}

export function ClassScheduleBlock({
  courseName,
  startTime,
  endTime,
  location,
  onClick,
}: ClassScheduleBlockProps) {
  return (
    <div
      className="rounded-md p-2 text-white shadow-sm cursor-pointer hover:opacity-90 transition-opacity h-full"
      style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
      onClick={onClick}
    >
      <div className="text-xs font-semibold truncate">
        {courseName || 'Class'}
      </div>
      <div className="text-xs opacity-90">
        {startTime} - {endTime}
      </div>
      {location && (
        <div className="text-xs opacity-75 truncate">{location}</div>
      )}
    </div>
  );
}
