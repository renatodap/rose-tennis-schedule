'use client';

/**
 * User profile hook for accessing current user's profile data
 * Fetches and caches user profile information including role
 */

import { useEffect, useState } from 'react';
import { User } from '../types/database.types';
import { getClient } from '../supabase/client';
import { useAuth } from './useAuth';

/**
 * Hook for accessing current user's profile data
 *
 * @returns User profile state
 */
export function useUser() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = getClient();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!authUser) {
      setProfile(null);
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser!.id)
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        // Profile exists
        if (data) {
          setProfile(data);
        } else {
          // Profile doesn't exist - user needs to complete setup
          setProfile(null);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [authUser, authLoading, supabase]);

  /**
   * Refresh user profile data
   */
  const refresh = async () => {
    if (!authUser) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      setProfile(data);
    } catch (err) {
      console.error('Error refreshing user profile:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading: authLoading || loading,
    error,
    refresh,
  };
}
