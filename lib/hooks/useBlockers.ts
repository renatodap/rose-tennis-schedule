'use client';

/**
 * Hook for managing time blockers (recurring and one-time)
 * Provides CRUD operations for user's time blockers
 */

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RecurringBlocker, OneTimeBlocker } from '@/lib/types/database.types';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface RecurringBlockerInput {
  day_of_week: number;
  start_time: string;
  end_time: string;
  title: string;
  description?: string;
  quarter: string;
}

export interface OneTimeBlockerInput {
  start_datetime: string;
  end_datetime: string;
  title: string;
  description?: string;
}

export function useBlockers() {
  const [recurringBlockers, setRecurringBlockers] = useState<RecurringBlocker[]>([]);
  const [oneTimeBlockers, setOneTimeBlockers] = useState<OneTimeBlocker[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  // Fetch all blockers
  const fetchBlockers = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch recurring blockers
      const { data: recurring, error: recurringError } = await supabase
        .from('recurring_blockers')
        .select('*')
        .eq('user_id', user.id)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (recurringError) throw recurringError;

      // Fetch one-time blockers (only future ones)
      const now = new Date().toISOString();
      const { data: oneTime, error: oneTimeError } = await supabase
        .from('one_time_blockers')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_datetime', now)
        .order('start_datetime', { ascending: true });

      if (oneTimeError) throw oneTimeError;

      setRecurringBlockers(recurring || []);
      setOneTimeBlockers(oneTime || []);
    } catch (error) {
      console.error('Error fetching blockers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load blockers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Add recurring blocker
  const addRecurringBlocker = async (input: RecurringBlockerInput) => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('recurring_blockers')
        .insert({
          user_id: user.id,
          day_of_week: input.day_of_week,
          start_time: input.start_time,
          end_time: input.end_time,
          title: input.title,
          description: input.description || null,
          quarter: input.quarter,
        })
        .select()
        .single();

      if (error) throw error;

      // Optimistic update
      setRecurringBlockers((prev) =>
        [...prev, data].sort((a, b) => {
          if (a.day_of_week !== b.day_of_week) {
            return a.day_of_week - b.day_of_week;
          }
          return a.start_time.localeCompare(b.start_time);
        })
      );

      toast({
        title: 'Success',
        description: 'Recurring blocker added successfully',
      });

      return data;
    } catch (error) {
      console.error('Error adding recurring blocker:', error);
      toast({
        title: 'Error',
        description: 'Failed to add recurring blocker',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Add one-time blocker
  const addOneTimeBlocker = async (input: OneTimeBlockerInput) => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('one_time_blockers')
        .insert({
          user_id: user.id,
          start_datetime: input.start_datetime,
          end_datetime: input.end_datetime,
          title: input.title,
          description: input.description || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Optimistic update
      setOneTimeBlockers((prev) =>
        [...prev, data].sort((a, b) => a.start_datetime.localeCompare(b.start_datetime))
      );

      toast({
        title: 'Success',
        description: 'One-time blocker added successfully',
      });

      return data;
    } catch (error) {
      console.error('Error adding one-time blocker:', error);
      toast({
        title: 'Error',
        description: 'Failed to add one-time blocker',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Update recurring blocker
  const updateRecurringBlocker = async (id: string, updates: Partial<RecurringBlocker>) => {
    try {
      const { data, error } = await supabase
        .from('recurring_blockers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Optimistic update
      setRecurringBlockers((prev) =>
        prev.map((item) => (item.id === id ? data : item))
      );

      toast({
        title: 'Success',
        description: 'Recurring blocker updated successfully',
      });

      return data;
    } catch (error) {
      console.error('Error updating recurring blocker:', error);
      toast({
        title: 'Error',
        description: 'Failed to update recurring blocker',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Update one-time blocker
  const updateOneTimeBlocker = async (id: string, updates: Partial<OneTimeBlocker>) => {
    try {
      const { data, error } = await supabase
        .from('one_time_blockers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Optimistic update
      setOneTimeBlockers((prev) =>
        prev.map((item) => (item.id === id ? data : item))
      );

      toast({
        title: 'Success',
        description: 'One-time blocker updated successfully',
      });

      return data;
    } catch (error) {
      console.error('Error updating one-time blocker:', error);
      toast({
        title: 'Error',
        description: 'Failed to update one-time blocker',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Delete recurring blocker
  const deleteRecurringBlocker = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recurring_blockers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Optimistic update
      setRecurringBlockers((prev) => prev.filter((item) => item.id !== id));

      toast({
        title: 'Success',
        description: 'Recurring blocker deleted successfully',
      });

      return true;
    } catch (error) {
      console.error('Error deleting recurring blocker:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete recurring blocker',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Delete one-time blocker
  const deleteOneTimeBlocker = async (id: string) => {
    try {
      const { error } = await supabase
        .from('one_time_blockers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Optimistic update
      setOneTimeBlockers((prev) => prev.filter((item) => item.id !== id));

      toast({
        title: 'Success',
        description: 'One-time blocker deleted successfully',
      });

      return true;
    } catch (error) {
      console.error('Error deleting one-time blocker:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete one-time blocker',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Load blockers on mount and user change
  useEffect(() => {
    fetchBlockers();
  }, [user?.id]);

  // Subscribe to real-time changes
  useEffect(() => {
    if (!user?.id) return;

    const recurringChannel = supabase
      .channel('recurring_blockers_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recurring_blockers',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchBlockers();
        }
      )
      .subscribe();

    const oneTimeChannel = supabase
      .channel('one_time_blockers_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'one_time_blockers',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchBlockers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(recurringChannel);
      supabase.removeChannel(oneTimeChannel);
    };
  }, [user?.id]);

  return {
    recurringBlockers,
    oneTimeBlockers,
    loading,
    addRecurringBlocker,
    addOneTimeBlocker,
    updateRecurringBlocker,
    updateOneTimeBlocker,
    deleteRecurringBlocker,
    deleteOneTimeBlocker,
    refetch: fetchBlockers,
  };
}
