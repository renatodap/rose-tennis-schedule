'use client';

/**
 * Authentication hook for managing user authentication state
 * Provides access to current session and auth methods
 */

import { useEffect, useState } from 'react';
import { Session, User as AuthUser } from '@supabase/supabase-js';
import { getClient } from '../supabase/client';

/**
 * Hook for accessing authentication state and methods
 *
 * @returns Authentication state and methods
 */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = getClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  /**
   * Sign out the current user
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      throw error;
    }
  };

  return {
    session,
    user,
    loading,
    signOut,
    isAuthenticated: !!session,
  };
}
