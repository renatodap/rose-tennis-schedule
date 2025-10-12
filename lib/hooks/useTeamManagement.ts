'use client';

/**
 * Hook for managing team members (coaches only)
 * Handles fetching users, updating team levels, and bulk operations
 */

import { useEffect, useState, useCallback } from 'react';
import { getClient } from '../supabase/client';
import { User } from '../types/database.types';
import { Gender, TeamLevel, UserRole } from '../constants';
import { useToast } from './use-toast';

export interface TeamManagementFilters {
  gender?: Gender;
  teamLevel?: TeamLevel;
  role?: UserRole;
  search?: string;
}

export function useTeamManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TeamManagementFilters>({});
  const { toast } = useToast();
  const supabase = getClient();

  /**
   * Fetch all users with optional filters
   */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('users')
        .select('*')
        .order('last_name', { ascending: true });

      // Apply filters
      if (filters.gender) {
        query = query.eq('gender', filters.gender);
      }

      if (filters.teamLevel) {
        query = query.eq('team_level', filters.teamLevel);
      }

      if (filters.role) {
        query = query.eq('role', filters.role);
      }

      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        query = query.or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},email.ilike.${searchTerm}`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [filters, supabase, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /**
   * Update a user's team level
   */
  const updateTeamLevel = async (userId: string, teamLevel: TeamLevel | null) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ team_level: teamLevel })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Team level updated successfully.',
      });

      await fetchUsers();
    } catch (error) {
      console.error('Error updating team level:', error);
      toast({
        title: 'Error',
        description: 'Failed to update team level. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  /**
   * Bulk assign team level to multiple users
   */
  const bulkAssignTeamLevel = async (userIds: string[], teamLevel: TeamLevel) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ team_level: teamLevel })
        .in('id', userIds);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `${userIds.length} user(s) assigned to ${teamLevel}.`,
      });

      await fetchUsers();
    } catch (error) {
      console.error('Error bulk assigning team level:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign team levels. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  /**
   * Get user details with related data
   */
  const getUserDetails = async (userId: string) => {
    try {
      // Fetch user
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Fetch user's class schedules
      const { data: schedules, error: schedulesError } = await supabase
        .from('class_schedules')
        .select('*')
        .eq('user_id', userId);

      if (schedulesError) throw schedulesError;

      // Fetch user's availability
      const { data: availability, error: availabilityError } = await supabase
        .from('practice_availability')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(30);

      if (availabilityError) throw availabilityError;

      // Fetch user's event responses
      const { data: responses, error: responsesError } = await supabase
        .from('event_responses')
        .select(`
          *,
          event:events (
            id,
            title,
            event_type,
            start_datetime,
            end_datetime
          )
        `)
        .eq('user_id', userId)
        .order('responded_at', { ascending: false })
        .limit(10);

      if (responsesError) throw responsesError;

      return {
        user,
        schedules: schedules || [],
        availability: availability || [],
        responses: responses || [],
      };
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user details. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  /**
   * Update user profile
   */
  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User updated successfully.',
      });

      await fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  /**
   * Apply filters
   */
  const applyFilters = (newFilters: TeamManagementFilters) => {
    setFilters(newFilters);
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setFilters({});
  };

  return {
    users,
    loading,
    filters,
    updateTeamLevel,
    bulkAssignTeamLevel,
    getUserDetails,
    updateUser,
    applyFilters,
    clearFilters,
    refresh: fetchUsers,
  };
}
