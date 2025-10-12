'use client';

/**
 * useClassSchedule hook - manages class schedule data operations
 * Provides CRUD operations and quarter-aware scheduling
 */

import { useState, useEffect, useCallback } from 'react';
import { getClient } from '../supabase/client';
import { useAuth } from './useAuth';

export interface ClassSchedule {
  id: string;
  user_id: string;
  quarter: 'fall' | 'winter' | 'spring' | 'summer';
  year: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  course_name?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

interface UseClassScheduleOptions {
  quarter: 'fall' | 'winter' | 'spring' | 'summer';
  year: number;
}

export function useClassSchedule({ quarter, year }: UseClassScheduleOptions) {
  const { user } = useAuth();
  const supabase = getClient();

  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch schedules for the selected quarter and year
  const fetchSchedules = useCallback(async () => {
    if (!user) {
      setSchedules([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('class_schedules')
        .select('*')
        .eq('user_id', user.id)
        .eq('quarter', quarter)
        .eq('year', year)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (fetchError) throw fetchError;

      setSchedules(data || []);
    } catch (err) {
      console.error('Error fetching class schedules:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  }, [user, supabase, quarter, year]);

  // Initial fetch and refetch when dependencies change
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Add a new class schedule
  const addSchedule = useCallback(
    async (data: {
      day_of_week: number;
      start_time: string;
      end_time: string;
      course_name?: string;
      location?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      try {
        // Check for conflicts
        const conflicts = schedules.filter(
          (schedule) =>
            schedule.day_of_week === data.day_of_week &&
            ((data.start_time >= schedule.start_time && data.start_time < schedule.end_time) ||
              (data.end_time > schedule.start_time && data.end_time <= schedule.end_time) ||
              (data.start_time <= schedule.start_time && data.end_time >= schedule.end_time))
        );

        if (conflicts.length > 0) {
          throw new Error('This time slot conflicts with an existing class');
        }

        const { data: newSchedule, error: insertError } = await supabase
          .from('class_schedules')
          .insert({
            user_id: user.id,
            quarter,
            year,
            day_of_week: data.day_of_week,
            start_time: data.start_time,
            end_time: data.end_time,
            course_name: data.course_name,
            location: data.location,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Optimistically update local state
        setSchedules((prev) => [...prev, newSchedule].sort((a, b) => {
          if (a.day_of_week !== b.day_of_week) {
            return a.day_of_week - b.day_of_week;
          }
          return a.start_time.localeCompare(b.start_time);
        }));

        return newSchedule;
      } catch (err) {
        console.error('Error adding class schedule:', err);
        throw err;
      }
    },
    [user, supabase, quarter, year, schedules]
  );

  // Update an existing class schedule
  const updateSchedule = useCallback(
    async (
      id: string,
      data: {
        day_of_week: number;
        start_time: string;
        end_time: string;
        course_name?: string;
        location?: string;
      }
    ) => {
      if (!user) throw new Error('User not authenticated');

      try {
        // Check for conflicts (excluding the current schedule)
        const conflicts = schedules.filter(
          (schedule) =>
            schedule.id !== id &&
            schedule.day_of_week === data.day_of_week &&
            ((data.start_time >= schedule.start_time && data.start_time < schedule.end_time) ||
              (data.end_time > schedule.start_time && data.end_time <= schedule.end_time) ||
              (data.start_time <= schedule.start_time && data.end_time >= schedule.end_time))
        );

        if (conflicts.length > 0) {
          throw new Error('This time slot conflicts with an existing class');
        }

        const { data: updatedSchedule, error: updateError } = await supabase
          .from('class_schedules')
          .update({
            day_of_week: data.day_of_week,
            start_time: data.start_time,
            end_time: data.end_time,
            course_name: data.course_name,
            location: data.location,
          })
          .eq('id', id)
          .select()
          .single();

        if (updateError) throw updateError;

        // Optimistically update local state
        setSchedules((prev) =>
          prev.map((schedule) => (schedule.id === id ? updatedSchedule : schedule)).sort((a, b) => {
            if (a.day_of_week !== b.day_of_week) {
              return a.day_of_week - b.day_of_week;
            }
            return a.start_time.localeCompare(b.start_time);
          })
        );

        return updatedSchedule;
      } catch (err) {
        console.error('Error updating class schedule:', err);
        throw err;
      }
    },
    [user, supabase, schedules]
  );

  // Delete a class schedule
  const deleteSchedule = useCallback(
    async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      try {
        const { error: deleteError } = await supabase
          .from('class_schedules')
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;

        // Optimistically update local state
        setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
      } catch (err) {
        console.error('Error deleting class schedule:', err);
        throw err;
      }
    },
    [user, supabase]
  );

  // Copy schedule from previous quarter
  const copyFromPreviousQuarter = useCallback(
    async (fromQuarter: 'fall' | 'winter' | 'spring' | 'summer', fromYear: number) => {
      if (!user) throw new Error('User not authenticated');

      try {
        setLoading(true);
        setError(null);

        // Fetch schedules from the previous quarter
        const { data: previousSchedules, error: fetchError } = await supabase
          .from('class_schedules')
          .select('*')
          .eq('user_id', user.id)
          .eq('quarter', fromQuarter)
          .eq('year', fromYear);

        if (fetchError) throw fetchError;

        if (!previousSchedules || previousSchedules.length === 0) {
          throw new Error('No schedules found in the selected quarter');
        }

        // Insert new schedules with updated quarter and year
        const newSchedules = previousSchedules.map((schedule) => ({
          user_id: user.id,
          quarter,
          year,
          day_of_week: schedule.day_of_week,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          course_name: schedule.course_name,
          location: schedule.location,
        }));

        const { data: insertedSchedules, error: insertError } = await supabase
          .from('class_schedules')
          .insert(newSchedules)
          .select();

        if (insertError) throw insertError;

        // Update local state
        await fetchSchedules();

        return insertedSchedules;
      } catch (err) {
        console.error('Error copying schedules:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, supabase, quarter, year, fetchSchedules]
  );

  return {
    schedules,
    loading,
    error,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    copyFromPreviousQuarter,
    refetch: fetchSchedules,
  };
}
