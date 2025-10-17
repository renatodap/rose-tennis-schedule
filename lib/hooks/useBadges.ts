/**
 * Custom Hook: useBadges
 * Manages achievement badges and awarding logic
 */

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { BadgeDefinition, UserBadge, User } from '@/lib/types/database.types';
import { useAuth } from './useAuth';

export interface UserBadgeWithDefinition extends UserBadge {
  badge: BadgeDefinition;
}

export function useBadges(userId?: string) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  const [userBadges, setUserBadges] = useState<UserBadgeWithDefinition[]>([]);
  const [allBadges, setAllBadges] = useState<BadgeDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch user's badges
  const fetchUserBadges = async () => {
    if (!targetUserId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge:badge_definitions(*)
        `)
        .eq('user_id', targetUserId)
        .order('awarded_at', { ascending: false });

      if (error) throw error;
      setUserBadges(data as UserBadgeWithDefinition[]);
    } catch (err) {
      console.error('Error fetching user badges:', err);
      setError(err instanceof Error ? err.message : 'Failed to load badges');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all badge definitions
  const fetchAllBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('badge_definitions')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;
      setAllBadges(data);
    } catch (err) {
      console.error('Error fetching badge definitions:', err);
    }
  };

  useEffect(() => {
    fetchUserBadges();
    fetchAllBadges();
  }, [targetUserId]);

  // Group badges by category
  const badgesByCategory = {
    serious: userBadges.filter((ub) => ub.badge.category === 'serious'),
    funny: userBadges.filter((ub) => ub.badge.category === 'funny'),
    milestone: userBadges.filter((ub) => ub.badge.category === 'milestone'),
  };

  // Get rarest badge
  const rarestBadge = userBadges.reduce<UserBadgeWithDefinition | null>((rarest, badge) => {
    if (!rarest) return badge;
    const rarityOrder = { common: 0, rare: 1, legendary: 2 };
    return rarityOrder[badge.badge.rarity] > rarityOrder[rarest.badge.rarity]
      ? badge
      : rarest;
  }, null);

  return {
    userBadges,
    allBadges,
    badgesByCategory,
    rarestBadge,
    loading,
    error,
    refresh: fetchUserBadges,
  };
}
