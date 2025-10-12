'use client';

/**
 * Unified Schedule Hook
 * Combines classes, availability, and blockers into one data source
 * Provides unified add/edit/delete operations
 */

import { useState, useCallback, useEffect } from 'react';
import { useClassSchedule } from './useClassSchedule';
import { useAvailability } from './useAvailability';
import { useBlockers } from './useBlockers';
import { CalendarEvent } from '@/components/calendar/WeekView';
import { format, addDays, parseISO } from 'date-fns';

export interface UnifiedScheduleItem {
  id: string;
  type: 'class' | 'availability' | 'blocker';
  title: string;
  dayOfWeek?: number;
  date?: string;
  startTime: string;
  endTime: string;
  quarter?: string;
  courseName?: string;
  location?: string;
  reason?: string;
  notes?: string;
  isRecurring?: boolean;
}

interface UseUnifiedScheduleProps {
  quarter: 'fall' | 'winter' | 'spring' | 'summer';
  year: number;
}

export function useUnifiedSchedule({ quarter, year }: UseUnifiedScheduleProps) {
  const [filter, setFilter] = useState<'all' | 'class' | 'availability' | 'blocker'>('all');

  // Fetch data from individual hooks
  const {
    schedules: classes,
    loading: classesLoading,
    addSchedule,
    updateSchedule,
    deleteSchedule,
  } = useClassSchedule({ quarter, year });

  const {
    availability: availabilityList,
    loading: availabilityLoading,
    addAvailability,
    addAvailabilityRange,
    deleteAvailability,
  } = useAvailability();

  const {
    recurringBlockers,
    oneTimeBlockers,
    loading: blockersLoading,
    addRecurringBlocker,
    addOneTimeBlocker,
    deleteRecurringBlocker,
    deleteOneTimeBlocker,
  } = useBlockers();

  const loading = classesLoading || availabilityLoading || blockersLoading;

  /**
   * Add multi-day class
   */
  const addMultiDayClass = useCallback(async (data: {
    days: number[];
    startTime: string;
    endTime: string;
    courseName?: string;
    location?: string;
  }) => {
    // Add a class for each selected day
    const promises = data.days.map(day =>
      addSchedule({
        day_of_week: day,
        start_time: data.startTime,
        end_time: data.endTime,
        course_name: data.courseName,
        location: data.location,
      })
    );

    await Promise.all(promises);
  }, [addSchedule]);

  /**
   * Add availability (date range or single day)
   */
  const addAvailabilityItem = useCallback(async (data: {
    date?: string;
    dateRange?: { start: string; end: string };
    startTime: string;
    endTime: string;
    notes?: string;
  }) => {
    if (data.dateRange) {
      await addAvailabilityRange({
        start_date: data.dateRange.start,
        end_date: data.dateRange.end,
        start_time: data.startTime,
        end_time: data.endTime,
        notes: data.notes,
      });
    } else if (data.date) {
      await addAvailability({
        date: data.date,
        start_time: data.startTime,
        end_time: data.endTime,
        notes: data.notes,
      });
    }
  }, [addAvailability, addAvailabilityRange]);

  /**
   * Add blocker (recurring or one-time)
   */
  const addBlockerItem = useCallback(async (data: {
    isRecurring: boolean;
    days?: number[];
    date?: string;
    dateRange?: { start: string; end: string };
    startTime: string;
    endTime: string;
    reason?: string;
  }) => {
    if (data.isRecurring && data.days) {
      // Add recurring blocker for each day
      const promises = data.days.map(day =>
        addRecurringBlocker({
          day_of_week: day,
          start_time: data.startTime,
          end_time: data.endTime,
          title: data.reason || 'Busy',
          description: undefined,
          quarter: `${quarter}_${year}`,
        })
      );
      await Promise.all(promises);
    } else if (data.dateRange) {
      // Add one-time blocker for each day in range
      const start = parseISO(data.dateRange.start);
      const end = parseISO(data.dateRange.end);
      const promises: Promise<any>[] = [];

      let currentDate = start;
      while (currentDate <= end) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        promises.push(
          addOneTimeBlocker({
            start_datetime: `${dateStr}T${data.startTime}:00`,
            end_datetime: `${dateStr}T${data.endTime}:00`,
            title: data.reason || 'Busy',
            description: undefined,
          })
        );
        currentDate = addDays(currentDate, 1);
      }

      await Promise.all(promises);
    } else if (data.date) {
      await addOneTimeBlocker({
        start_datetime: `${data.date}T${data.startTime}:00`,
        end_datetime: `${data.date}T${data.endTime}:00`,
        title: data.reason || 'Busy',
        description: undefined,
      });
    }
  }, [addRecurringBlocker, addOneTimeBlocker]);

  /**
   * Convert all items to unified calendar events
   */
  const getCalendarEvents = useCallback((): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    // Filter and add classes
    if (filter === 'all' || filter === 'class') {
      classes.forEach(cls => {
        events.push({
          id: `class-${cls.id}`,
          title: cls.course_name || 'Class',
          dayOfWeek: cls.day_of_week,
          startTime: cls.start_time,
          endTime: cls.end_time,
          type: 'class',
          location: cls.location,
        });
      });
    }

    // Filter and add recurring blockers
    if (filter === 'all' || filter === 'blocker') {
      recurringBlockers.forEach(blocker => {
        events.push({
          id: `blocker-recurring-${blocker.id}`,
          title: blocker.title || 'Busy',
          dayOfWeek: blocker.day_of_week,
          startTime: blocker.start_time,
          endTime: blocker.end_time,
          type: 'blocker',
        });
      });
    }

    // Note: One-time items (availability, one-time blockers) are date-based
    // They'll be added in a different view or converted based on current week

    return events;
  }, [classes, recurringBlockers, filter]);

  /**
   * Delete any item by type and id
   */
  const deleteItem = useCallback(async (type: 'class' | 'availability' | 'blocker', id: string) => {
    switch (type) {
      case 'class':
        await deleteSchedule(id);
        break;
      case 'availability':
        await deleteAvailability(id);
        break;
      case 'blocker':
        // Determine if recurring or one-time based on ID prefix
        if (id.startsWith('recurring-')) {
          await deleteRecurringBlocker(id.replace('recurring-', ''));
        } else {
          await deleteOneTimeBlocker(id);
        }
        break;
    }
  }, [deleteSchedule, deleteAvailability, deleteRecurringBlocker, deleteOneTimeBlocker]);

  return {
    // Data
    classes,
    availabilityList,
    recurringBlockers,
    oneTimeBlockers,
    calendarEvents: getCalendarEvents(),

    // State
    loading,
    filter,
    setFilter,

    // Operations
    addMultiDayClass,
    addAvailabilityItem,
    addBlockerItem,
    deleteItem,

    // Individual operations (for advanced use)
    addSchedule,
    updateSchedule,
    addAvailability,
    addRecurringBlocker,
    addOneTimeBlocker,
  };
}
