'use client';

/**
 * Hook for availability dashboard (coaches/captains)
 * Aggregates availability data and calculates best practice times
 */

import { useEffect, useState, useCallback } from 'react';
import { getClient } from '../supabase/client';
import { User, PracticeAvailability, ClassSchedule, RecurringBlocker, OneTimeBlocker } from '../types/database.types';
import { Gender, TeamLevel } from '../constants';
import { useToast } from './use-toast';
import { TimeSlot, isUserAvailable } from '../utils/availability';
import { format, eachDayOfInterval, parseISO } from 'date-fns';

export interface AvailabilityFilters {
  gender?: Gender;
  teamLevel?: TeamLevel;
  playerIds?: string[];
}

export interface TimeSlotAvailability {
  date: string;
  timeSlot: TimeSlot;
  availableUsers: User[];
  totalUsers: number;
  availabilityPercentage: number;
}

export interface HeatmapData {
  date: string;
  timeSlots: {
    timeSlot: TimeSlot;
    availableCount: number;
    totalCount: number;
    availableUsers: User[];
  }[];
}

export function useAvailabilityDashboard(
  startDate: string,
  endDate: string,
  filters: AvailabilityFilters = {}
) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [bestTimes, setBestTimes] = useState<TimeSlotAvailability[]>([]);
  const { toast } = useToast();
  const supabase = getClient();

  // Common practice time slots to check (8 AM - 10 PM in 1-hour blocks)
  const practiceTimeSlots: TimeSlot[] = [
    { start: '08:00', end: '09:00' },
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '12:00', end: '13:00' },
    { start: '13:00', end: '14:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' },
    { start: '17:00', end: '18:00' },
    { start: '18:00', end: '19:00' },
    { start: '19:00', end: '20:00' },
    { start: '20:00', end: '21:00' },
    { start: '21:00', end: '22:00' },
  ];

  /**
   * Fetch availability data
   */
  const fetchAvailabilityData = useCallback(async () => {
    try {
      setLoading(true);

      // Build user query with filters
      let userQuery = supabase
        .from('users')
        .select('*')
        .eq('role', 'player'); // Only fetch players

      if (filters.gender) {
        userQuery = userQuery.eq('gender', filters.gender);
      }

      if (filters.teamLevel) {
        userQuery = userQuery.eq('team_level', filters.teamLevel);
      }

      if (filters.playerIds && filters.playerIds.length > 0) {
        userQuery = userQuery.in('id', filters.playerIds);
      }

      const { data: usersData, error: usersError } = await userQuery;

      if (usersError) throw usersError;

      setUsers(usersData || []);

      if (!usersData || usersData.length === 0) {
        setHeatmapData([]);
        setBestTimes([]);
        setLoading(false);
        return;
      }

      const userIds = usersData.map(u => u.id);

      // Fetch schedules for all users
      const { data: schedules, error: schedulesError } = await supabase
        .from('class_schedules')
        .select('*')
        .in('user_id', userIds);

      if (schedulesError) throw schedulesError;

      // Fetch recurring blockers
      const { data: recurringBlockers, error: rbError } = await supabase
        .from('recurring_blockers')
        .select('*')
        .in('user_id', userIds);

      if (rbError) throw rbError;

      // Fetch one-time blockers
      const { data: oneTimeBlockers, error: otbError } = await supabase
        .from('one_time_blockers')
        .select('*')
        .in('user_id', userIds)
        .gte('start_datetime', `${startDate}T00:00:00`)
        .lte('end_datetime', `${endDate}T23:59:59`);

      if (otbError) throw otbError;

      // Fetch practice availability
      const { data: practiceAvailability, error: paError } = await supabase
        .from('practice_availability')
        .select('*')
        .in('user_id', userIds)
        .gte('start_datetime', `${startDate}T00:00:00`)
        .lte('start_datetime', `${endDate}T23:59:59`);

      if (paError) throw paError;

      // Calculate availability for each date and time slot
      const dates = eachDayOfInterval({
        start: parseISO(startDate),
        end: parseISO(endDate),
      }).map(d => format(d, 'yyyy-MM-dd'));

      const heatmap: HeatmapData[] = [];
      const allTimeSlots: TimeSlotAvailability[] = [];

      for (const date of dates) {
        const dayData: HeatmapData = {
          date,
          timeSlots: [],
        };

        for (const timeSlot of practiceTimeSlots) {
          const availableUsers = usersData.filter(user => {
            const userSchedules = schedules?.filter(s => s.user_id === user.id) || [];
            const userRecurringBlockers = recurringBlockers?.filter(rb => rb.user_id === user.id) || [];
            const userOneTimeBlockers = oneTimeBlockers?.filter(otb => otb.user_id === user.id) || [];
            const userAvailability = practiceAvailability?.find(
              pa => pa.user_id === user.id && pa.start_datetime.split('T')[0] === date
            );

            return isUserAvailable(
              date,
              timeSlot,
              userSchedules,
              userRecurringBlockers,
              userOneTimeBlockers,
              userAvailability
            );
          });

          dayData.timeSlots.push({
            timeSlot,
            availableCount: availableUsers.length,
            totalCount: usersData.length,
            availableUsers,
          });

          allTimeSlots.push({
            date,
            timeSlot,
            availableUsers,
            totalUsers: usersData.length,
            availabilityPercentage: (availableUsers.length / usersData.length) * 100,
          });
        }

        heatmap.push(dayData);
      }

      // Sort time slots by availability percentage (descending) and take top 10
      const bestTimeSlots = allTimeSlots
        .sort((a, b) => b.availabilityPercentage - a.availabilityPercentage)
        .slice(0, 10);

      setHeatmapData(heatmap);
      setBestTimes(bestTimeSlots);
    } catch (error) {
      console.error('Error fetching availability data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load availability data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, filters, supabase, toast]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchAvailabilityData();
    }
  }, [fetchAvailabilityData, startDate, endDate]);

  /**
   * Export availability data to CSV
   */
  const exportToCSV = () => {
    try {
      if (!heatmapData.length) {
        toast({
          title: 'No Data',
          description: 'No availability data to export.',
          variant: 'destructive',
        });
        return;
      }

      // Build CSV header
      const headers = ['Date', ...practiceTimeSlots.map(ts => `${ts.start}-${ts.end}`)];

      // Build CSV rows
      const rows = heatmapData.map(day => {
        const row = [day.date];
        day.timeSlots.forEach(ts => {
          row.push(`${ts.availableCount}/${ts.totalCount}`);
        });
        return row;
      });

      // Convert to CSV string
      const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `availability_${startDate}_to_${endDate}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Availability data exported successfully.',
      });
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast({
        title: 'Error',
        description: 'Failed to export data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return {
    loading,
    users,
    heatmapData,
    bestTimes,
    exportToCSV,
    refresh: fetchAvailabilityData,
  };
}
