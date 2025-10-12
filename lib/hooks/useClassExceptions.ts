'use client';

/**
 * Hook for managing class schedule exceptions
 * Allows users to mark specific dates when recurring classes don't apply
 */

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ClassScheduleException } from '@/lib/types/database.types';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export function useClassExceptions() {
  const [exceptions, setExceptions] = useState<ClassScheduleException[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const supabase = createClient();

  /**
   * Fetch all exceptions for the current user
   */
  const fetchExceptions = useCallback(async () => {
    if (!user?.id) {
      setExceptions([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('class_schedule_exceptions')
        .select('*')
        .eq('user_id', user.id)
        .order('exception_date', { ascending: true });

      if (error) throw error;

      setExceptions(data || []);
    } catch (error) {
      console.error('Error fetching class exceptions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load class exceptions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, supabase]);

  /**
   * Add a new class schedule exception
   */
  const addException = async (
    classScheduleId: string,
    exceptionDate: string,
    reason?: string
  ) => {
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
        .from('class_schedule_exceptions')
        .insert({
          user_id: user.id,
          class_schedule_id: classScheduleId,
          exception_date: exceptionDate,
          reason: reason || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Optimistic update
      setExceptions((prev) =>
        [...prev, data].sort((a, b) => a.exception_date.localeCompare(b.exception_date))
      );

      toast({
        title: 'Success',
        description: 'Class exception added successfully',
      });

      return data;
    } catch (error) {
      console.error('Error adding class exception:', error);
      toast({
        title: 'Error',
        description: 'Failed to add class exception',
        variant: 'destructive',
      });
      return null;
    }
  };

  /**
   * Delete a class schedule exception
   */
  const deleteException = async (exceptionId: string) => {
    try {
      const { error } = await supabase
        .from('class_schedule_exceptions')
        .delete()
        .eq('id', exceptionId);

      if (error) throw error;

      // Optimistic update
      setExceptions((prev) => prev.filter((e) => e.id !== exceptionId));

      toast({
        title: 'Success',
        description: 'Class exception removed successfully',
      });

      return true;
    } catch (error) {
      console.error('Error deleting class exception:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove class exception',
        variant: 'destructive',
      });
      return false;
    }
  };

  /**
   * Check if a specific class instance has an exception on a given date
   */
  const hasException = (classScheduleId: string, date: string): boolean => {
    return exceptions.some(
      (e) => e.class_schedule_id === classScheduleId && e.exception_date === date
    );
  };

  /**
   * Get exception for a specific class on a specific date
   */
  const getException = (classScheduleId: string, date: string): ClassScheduleException | null => {
    return exceptions.find(
      (e) => e.class_schedule_id === classScheduleId && e.exception_date === date
    ) || null;
  };

  /**
   * Get all exceptions for a specific class schedule
   */
  const getExceptionsForClass = (classScheduleId: string): ClassScheduleException[] => {
    return exceptions.filter((e) => e.class_schedule_id === classScheduleId);
  };

  // Load exceptions on mount and when user changes
  useEffect(() => {
    fetchExceptions();
  }, [fetchExceptions]);

  // Subscribe to real-time changes
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('class_exceptions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'class_schedule_exceptions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchExceptions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchExceptions, supabase]);

  return {
    exceptions,
    loading,
    addException,
    deleteException,
    hasException,
    getException,
    getExceptionsForClass,
    refetch: fetchExceptions,
  };
}
