'use client';

/**
 * TimeBlock - Individual calendar event block
 * Color-coded by type, shows time, title, and location
 */

import { GraduationCap, Clock, Ban, Trophy, Calendar, AlertCircle } from 'lucide-react';
import { colors, radius, shadows } from '@/lib/design-tokens';
import { BRAND_COLORS } from '@/lib/constants';

export type BlockType = 'class' | 'blocker' | 'availability' | 'event' | 'match';

interface TimeBlockProps {
  type: BlockType;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  rsvpStatus?: 'going' | 'not_going' | 'maybe' | 'no_response';
  homeAway?: 'home' | 'away' | 'neutral';
  opponent?: string;
  hasConflict?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

function getBlockColors(
  type: BlockType,
  rsvpStatus?: string,
  homeAway?: string
): { bg: string; border: string; text: string } {
  switch (type) {
    case 'class':
      return {
        bg: BRAND_COLORS.PRIMARY,
        border: BRAND_COLORS.PRIMARY_DARK,
        text: '#ffffff'
      };
    case 'blocker':
      return {
        bg: '#f59e0b', // warning-500
        border: '#b45309', // warning-700
        text: '#ffffff'
      };
    case 'availability':
      return {
        bg: '#22c55e', // success-500
        border: '#15803d', // success-700
        text: '#ffffff'
      };
    case 'match':
      if (homeAway === 'home') {
        return { bg: '#16a34a', border: '#15803d', text: '#ffffff' }; // success-600, 700
      } else if (homeAway === 'away') {
        return { bg: '#3b82f6', border: '#1d4ed8', text: '#ffffff' }; // info-500, 700
      }
      return { bg: '#525252', border: '#404040', text: '#ffffff' }; // neutral-600, 700
    case 'event':
      if (rsvpStatus === 'going') {
        return { bg: '#22c55e', border: '#15803d', text: '#ffffff' }; // success-500, 700
      } else if (rsvpStatus === 'maybe') {
        return { bg: '#f59e0b', border: '#b45309', text: '#ffffff' }; // warning-500, 700
      } else if (rsvpStatus === 'not_going') {
        return { bg: '#ef4444', border: '#b91c1c', text: '#ffffff' }; // error-500, 700
      }
      return { bg: '#3b82f6', border: '#1d4ed8', text: '#ffffff' }; // info-500, 700
    default:
      return { bg: '#737373', border: '#404040', text: '#ffffff' }; // neutral-500, 700
  }
}

function getBlockIcon(type: BlockType) {
  switch (type) {
    case 'class':
      return <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />;
    case 'blocker':
      return <Ban className="h-3 w-3 sm:h-4 sm:w-4" />;
    case 'availability':
      return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
    case 'match':
      return <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />;
    case 'event':
      return <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />;
    default:
      return null;
  }
}

export function TimeBlock({
  type,
  title,
  startTime,
  endTime,
  location,
  rsvpStatus,
  homeAway,
  opponent,
  hasConflict = false,
  onClick,
  compact = false,
}: TimeBlockProps) {
  const blockColors = getBlockColors(type, rsvpStatus, homeAway);

  return (
    <div
      onClick={onClick}
      className={`
        h-full rounded-md overflow-hidden cursor-pointer transition-all group
        ${hasConflict ? 'ring-2 ring-yellow-400 ring-offset-1' : ''}
        hover:brightness-110
      `}
      style={{
        backgroundColor: blockColors.bg,
        borderLeft: `4px solid ${blockColors.border}`,
        color: blockColors.text,
        boxShadow: shadows.sm,
      }}
    >
      <div className={`h-full ${compact ? 'p-1' : 'p-2'}`}>
        {/* Header with icon and title */}
        <div className="flex items-start gap-1 mb-0.5">
          <div className="flex-shrink-0 mt-0.5">
            {getBlockIcon(type)}
          </div>
          <div className={`font-semibold truncate leading-tight flex-1 ${compact ? 'text-[10px]' : 'text-xs'}`}>
            {title}
          </div>
          {hasConflict && (
            <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-300 flex-shrink-0" />
          )}
        </div>

        {/* Time range */}
        {!compact && (
          <div className="text-[10px] sm:text-xs opacity-90 leading-tight">
            {startTime} - {endTime}
          </div>
        )}

        {/* Location or opponent */}
        {!compact && (location || opponent) && (
          <div className="text-[9px] sm:text-xs opacity-80 leading-tight truncate mt-0.5">
            {opponent ? `vs ${opponent}` : location}
          </div>
        )}
      </div>
    </div>
  );
}
