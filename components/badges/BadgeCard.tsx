'use client';

/**
 * BadgeCard Component
 * Displays a single badge with its details
 */

import { motion } from 'framer-motion';
import { UserBadgeWithDefinition } from '@/lib/hooks/useBadges';
import { formatDistanceToNow } from 'date-fns';

interface BadgeCardProps {
  userBadge: UserBadgeWithDefinition;
  size?: 'sm' | 'md' | 'lg';
}

export function BadgeCard({ userBadge, size = 'md' }: BadgeCardProps) {
  const { badge, awarded_at } = userBadge;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      case 'rare':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'legendary':
        return 'bg-amber-100 border-amber-400 text-amber-900';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'serious':
        return 'bg-rose-50 text-rose-700';
      case 'funny':
        return 'bg-purple-50 text-purple-700';
      case 'milestone':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const iconSizes = {
    sm: 'text-3xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`bg-white rounded-lg border-2 ${getRarityColor(badge.rarity)} ${
        sizeClasses[size]
      } text-center relative overflow-hidden`}
    >
      {/* Rarity badge */}
      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(badge.category)}`}>
        {badge.category}
      </div>

      {/* Icon */}
      <div className={`${iconSizes[size]} mb-2`}>{badge.icon}</div>

      {/* Name */}
      <h3 className="font-bold text-sm mb-1">{badge.name}</h3>

      {/* Description */}
      <p className="text-xs text-gray-600 mb-2">{badge.description}</p>

      {/* Awarded date */}
      <p className="text-xs text-gray-400">
        Earned {formatDistanceToNow(new Date(awarded_at), { addSuffix: true })}
      </p>

      {/* Legendary glow effect */}
      {badge.rarity === 'legendary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-amber-200/20 via-yellow-200/20 to-amber-200/20 animate-pulse pointer-events-none" />
      )}
    </motion.div>
  );
}
