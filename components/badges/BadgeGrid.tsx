'use client';

/**
 * BadgeGrid Component
 * Displays badges in a responsive grid
 */

import { BadgeCard } from './BadgeCard';
import { UserBadgeWithDefinition } from '@/lib/hooks/useBadges';
import { Trophy } from 'lucide-react';

interface BadgeGridProps {
  badges: UserBadgeWithDefinition[];
  title?: string;
  emptyMessage?: string;
}

export function BadgeGrid({
  badges,
  title,
  emptyMessage = 'No badges earned yet',
}: BadgeGridProps) {
  if (badges.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <Trophy className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          {title}
        </h3>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {badges.map((userBadge) => (
          <BadgeCard key={userBadge.id} userBadge={userBadge} />
        ))}
      </div>
    </div>
  );
}
