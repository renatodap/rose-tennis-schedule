/**
 * Custom Hook: useChallenges
 * Manages challenge data and operations
 */

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Challenge, User } from '@/lib/types/database.types';
import { useAuth } from './useAuth';

export interface ChallengeWithPlayers extends Challenge {
  challenger: User;
  opponent?: User;
  winner?: User;
}

export function useChallenges() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<ChallengeWithPlayers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          challenger:users!challenges_challenger_id_fkey(*),
          opponent:users!challenges_opponent_id_fkey(*),
          winner:users!challenges_winner_id_fkey(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data as ChallengeWithPlayers[]);
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError(err instanceof Error ? err.message : 'Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('challenges-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'challenges',
        },
        () => {
          fetchChallenges();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter challenges
  const openChallenges = challenges.filter(
    (c) => c.status === 'open' && c.challenger_id !== user?.id
  );

  const myChallenges = challenges.filter(
    (c) =>
      (c.status === 'open' || c.status === 'accepted') &&
      (c.challenger_id === user?.id || c.opponent_id === user?.id)
  );

  const pastChallenges = challenges.filter((c) => c.status === 'completed');

  // Create new challenge
  const createChallenge = async (challengeData: {
    challenge_type: 'singles' | 'doubles';
    opponent_id?: string;
    proposed_datetime?: string;
    location?: string;
    notes?: string;
  }) => {
    try {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('challenges')
        .insert({
          challenger_id: user.id,
          ...challengeData,
        })
        .select(`
          *,
          challenger:users!challenges_challenger_id_fkey(*),
          opponent:users!challenges_opponent_id_fkey(*)
        `)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Error creating challenge:', err);
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to create challenge',
      };
    }
  };

  // Accept challenge
  const acceptChallenge = async (challengeId: string) => {
    try {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('challenges')
        .update({
          opponent_id: user.id,
          status: 'accepted',
        })
        .eq('id', challengeId)
        .select(`
          *,
          challenger:users!challenges_challenger_id_fkey(*),
          opponent:users!challenges_opponent_id_fkey(*)
        `)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Error accepting challenge:', err);
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to accept challenge',
      };
    }
  };

  // Record score
  const recordScore = async (
    challengeId: string,
    winnerId: string,
    score: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .update({
          status: 'completed',
          winner_id: winnerId,
          score,
        })
        .eq('id', challengeId)
        .select(`
          *,
          challenger:users!challenges_challenger_id_fkey(*),
          opponent:users!challenges_opponent_id_fkey(*),
          winner:users!challenges_winner_id_fkey(*)
        `)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Error recording score:', err);
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to record score',
      };
    }
  };

  // Cancel challenge
  const cancelChallenge = async (challengeId: string) => {
    try {
      const { error } = await supabase
        .from('challenges')
        .update({ status: 'cancelled' })
        .eq('id', challengeId);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      console.error('Error cancelling challenge:', err);
      return {
        error: err instanceof Error ? err.message : 'Failed to cancel challenge',
      };
    }
  };

  return {
    challenges,
    openChallenges,
    myChallenges,
    pastChallenges,
    loading,
    error,
    createChallenge,
    acceptChallenge,
    recordScore,
    cancelChallenge,
    refresh: fetchChallenges,
  };
}
