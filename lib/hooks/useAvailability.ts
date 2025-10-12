'use client';

/**
 * Hook for managing practice availability
 * Provides CRUD operations for user's practice availability entries
 */

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PracticeAvailability } from '@/lib/types/database.types';
import { AvailabilityStatus } from '@/lib/constants';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface AvailabilityInput {
  date: string;
  start_time: string;
  end_time: string;
  notes?: string;
}

export interface AvailabilityRange {
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  notes?: string;
}

export function useAvailability() {
  const [availability, setAvailability] = useState<PracticeAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  // Fetch availability entries
  const fetchAvailability = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('practice_availability')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', new Date().toISOString().split('T')[0]) // Only future/today
        .order('date', { ascending: true });

      if (error) throw error;

      setAvailability(data || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to load availability entries',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Add single availability entry
  const addAvailability = async (input: AvailabilityInput) => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in',
        variant: 'destructive',
      });
      return null;
    }

    try {
      // Check for conflicts
      const hasConflict = await checkConflicts(input.date, input.start_time, input.end_time);

      const { data, error } = await supabase
        .from('practice_availability')
        .insert({
          user_id: user.id,
          date: input.date,
          status: AvailabilityStatus.AVAILABLE,
          notes: input.notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Optimistic update
      setAvailability((prev) => [...prev, data].sort((a, b) => a.date.localeCompare(b.date)));

      toast({
        title: 'Success',
        description: hasConflict
          ? 'Availability added (note: conflicts with existing schedule)'
          : 'Availability added successfully',
      });

      return data;
    } catch (error) {
      console.error('Error adding availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to add availability',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Add availability range (multiple dates)
  const addAvailabilityRange = async (range: AvailabilityRange) => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in',
        variant: 'destructive',
      });
      return [];
    }

    try {
      // Generate all dates in range
      const dates: string[] = [];
      const start = new Date(range.start_date);
      const end = new Date(range.end_date);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(d.toISOString().split('T')[0]);
      }

      // Create availability entries for all dates
      const entries = dates.map(date => ({
        user_id: user.id!,
        date,
        status: AvailabilityStatus.AVAILABLE,
        notes: range.notes || null,
      }));

      const { data, error } = await supabase
        .from('practice_availability')
        .insert(entries)
        .select();

      if (error) throw error;

      // Optimistic update
      setAvailability((prev) => [...prev, ...data].sort((a, b) => a.date.localeCompare(b.date)));

      toast({
        title: 'Success',
        description: `Added availability for ${dates.length} day${dates.length > 1 ? 's' : ''}`,
      });

      return data;
    } catch (error) {
      console.error('Error adding availability range:', error);
      toast({
        title: 'Error',
        description: 'Failed to add availability range',
        variant: 'destructive',
      });
      return [];
    }
  };

  // Update availability entry
  const updateAvailability = async (id: string, updates: Partial<PracticeAvailability>) => {
    try {
      const { data, error } = await supabase
        .from('practice_availability')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Optimistic update
      setAvailability((prev) =>
        prev.map((item) => (item.id === id ? data : item))
      );

      toast({
        title: 'Success',
        description: 'Availability updated successfully',
      });

      return data;
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to update availability',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Delete availability entry
  const deleteAvailability = async (id: string) => {
    try {
      const { error } = await supabase
        .from('practice_availability')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Optimistic update
      setAvailability((prev) => prev.filter((item) => item.id !== id));

      toast({
        title: 'Success',
        description: 'Availability deleted successfully',
      });

      return true;
    } catch (error) {
      console.error('Error deleting availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete availability',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Check for conflicts with classes and blockers
  const checkConflicts = async (date: string, startTime: string, endTime: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const dayOfWeek = new Date(date).getDay();

      // Check class schedules
      const { data: classes } = await supabase
        .from('class_schedules')
        .select('*')
        .eq('user_id', user.id)
        .eq('day_of_week', dayOfWeek);

      if (classes && classes.length > 0) {
        const hasClassConflict = classes.some(cls =>
          timeRangesOverlap(cls.start_time, cls.end_time, startTime, endTime)
        );
        if (hasClassConflict) return true;
      }

      // Check recurring blockers
      const { data: recurring } = await supabase
        .from('recurring_blockers')
        .select('*')
        .eq('user_id', user.id)
        .eq('day_of_week', dayOfWeek);

      if (recurring && recurring.length > 0) {
        const hasRecurringConflict = recurring.some(blocker =>
          timeRangesOverlap(blocker.start_time, blocker.end_time, startTime, endTime)
        );
        if (hasRecurringConflict) return true;
      }

      // Check one-time blockers
      const { data: oneTime } = await supabase
        .from('one_time_blockers')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_datetime', `${date}T00:00:00`)
        .lt('start_datetime', `${date}T23:59:59`);

      if (oneTime && oneTime.length > 0) {
        const hasOneTimeConflict = oneTime.some(blocker => {
          const blockerStart = blocker.start_datetime.split('T')[1].substring(0, 5);
          const blockerEnd = blocker.end_datetime.split('T')[1].substring(0, 5);
          return timeRangesOverlap(blockerStart, blockerEnd, startTime, endTime);
        });
        if (hasOneTimeConflict) return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking conflicts:', error);
      return false;
    }
  };

  // Helper function to check if time ranges overlap
  const timeRangesOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
    return start1 < end2 && start2 < end1;
  };

  // Load availability on mount and user change
  useEffect(() => {
    fetchAvailability();
  }, [user?.id]);

  // Subscribe to real-time changes
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('practice_availability_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'practice_availability',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchAvailability();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    availability,
    loading,
    addAvailability,
    addAvailabilityRange,
    updateAvailability,
    deleteAvailability,
    checkConflicts,
    refetch: fetchAvailability,
  };
}
