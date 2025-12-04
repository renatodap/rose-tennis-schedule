'use client';

import { useEffect, useState, useCallback } from 'react';
import { getClient } from '../supabase/client';
import { useAuth } from './useAuth';
import { BubbleAttendance } from '../types/database.types';
import { PRACTICE_DATES } from '../constants';

interface AttendanceWithUser extends BubbleAttendance {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    gender: string;
  };
}

export function useAttendance() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceWithUser[]>([]);
  const [myAttendance, setMyAttendance] = useState<Map<string, BubbleAttendance>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = getClient();

  // Fetch all attendance records with user info
  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('bubble_attendance')
        .select(`
          *,
          user:users(id, first_name, last_name, gender)
        `)
        .in('practice_date', PRACTICE_DATES as unknown as string[]);

      // If table doesn't exist or other error, just show empty attendance
      // The dates will still display, just without attendance data
      if (fetchError) {
        console.warn('Attendance fetch error (table may not exist):', fetchError.message);
        setAttendance([]);
        setMyAttendance(new Map());
        setLoading(false);
        return;
      }

      setAttendance((data || []) as AttendanceWithUser[]);

      // Build my attendance map
      if (user) {
        const myMap = new Map<string, BubbleAttendance>();
        (data || []).forEach(record => {
          if (record.user_id === user.id) {
            myMap.set(record.practice_date, record as BubbleAttendance);
          }
        });
        setMyAttendance(myMap);
      }
    } catch (err) {
      console.error('Attendance fetch exception:', err);
      // Still allow page to render with empty data
      setAttendance([]);
      setMyAttendance(new Map());
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // Toggle attendance for a date
  const toggleAttendance = async (date: string, status: 'confirmed' | 'declined', location: 'bubble' | 'src') => {
    if (!user) {
      throw new Error('You must be logged in to update attendance');
    }

    const existing = myAttendance.get(date);

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('bubble_attendance')
        .update({ status, location, updated_at: new Date().toISOString() })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Update error:', updateError);
        throw new Error(updateError.message || 'Failed to update attendance');
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('bubble_attendance')
        .insert({
          user_id: user.id,
          practice_date: date,
          status,
          location
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error(insertError.message || 'Failed to save attendance');
      }
    }

    // Refresh data
    await fetchAttendance();
  };

  // Get attendance for a specific date
  const getDateAttendance = (date: string) => {
    return attendance.filter(a => a.practice_date === date);
  };

  // Get my status for a date
  const getMyStatus = (date: string) => {
    return myAttendance.get(date)?.status || null;
  };

  // Get counts for a date
  const getDateCounts = (date: string) => {
    const dateAttendance = getDateAttendance(date);
    return {
      confirmed: dateAttendance.filter(a => a.status === 'confirmed').length,
      declined: dateAttendance.filter(a => a.status === 'declined').length,
      total: dateAttendance.length
    };
  };

  return {
    attendance,
    myAttendance,
    loading,
    error,
    toggleAttendance,
    getDateAttendance,
    getMyStatus,
    getDateCounts,
    refresh: fetchAttendance
  };
}
