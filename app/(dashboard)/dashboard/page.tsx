'use client';

/**
 * Main dashboard page - $100M REDESIGN
 * Premium, mobile-first dashboard that impresses and provides immediate value
 * Shows personalized greeting, key stats, today's schedule, upcoming events, and quick actions
 */

import { useEffect, useState, useMemo } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { useEvents } from '@/lib/hooks/useEvents';
import { getClient } from '@/lib/supabase/client';
import { FileText, Calendar, Users, TrendingUp } from 'lucide-react';
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard';
import { StatCard } from '@/components/dashboard/StatCard';
import { TodayTimeline } from '@/components/dashboard/TodayTimeline';
import { UpcomingEventsList } from '@/components/dashboard/UpcomingEventsList';
import { AlertBanner } from '@/components/dashboard/AlertBanner';
import { UnifiedAddItemDialog } from '@/components/schedule/UnifiedAddItemDialog';
import { useUnifiedSchedule } from '@/lib/hooks/useUnifiedSchedule';
import { useToast } from '@/lib/hooks/use-toast';
import { getCurrentQuarter } from '@/lib/utils/quarters';
import { format, isToday, startOfDay, endOfDay, isAfter, isBefore, addDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { profile } = useUser();
  const { events, loading: eventsLoading, getUpcomingEvents } = useEvents();
  const { toast } = useToast();
  const [pendingFormsCount, setPendingFormsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAddClassDialogOpen, setIsAddClassDialogOpen] = useState(false);
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const supabase = getClient();

  // Get current quarter for class schedules
  const currentQuarter = getCurrentQuarter();
  const currentYear = new Date().getFullYear();

  // Determine quarter/year for schedule operations
  const scheduleQuarter: 'fall' | 'winter' | 'spring' | 'summer' =
    currentQuarter ? (currentQuarter.name.split(' ')[0].toLowerCase() as 'fall' | 'winter' | 'spring' | 'summer') : 'fall';
  const scheduleYear = currentQuarter ? parseInt(currentQuarter.name.match(/\d{4}/)?.[0] || String(currentYear)) : 2025;

  const { addMultiDayClass } = useUnifiedSchedule({
    quarter: scheduleQuarter,
    year: scheduleYear
  });

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get today's events
  const todayEvents = useMemo(() => {
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    return events.filter(event => {
      const eventDate = new Date(event.start_datetime);
      return isAfter(eventDate, todayStart) && isBefore(eventDate, todayEnd);
    });
  }, [events]);

  // Get upcoming events (next 7 days)
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const weekFromNow = addDays(now, 7);

    return events
      .filter(event => {
        const eventDate = new Date(event.start_datetime);
        return isAfter(eventDate, now) && isBefore(eventDate, weekFromNow);
      })
      .sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime());
  }, [events]);

  // Get events needing RSVP
  const eventsNeedingRsvp = useMemo(() => {
    return upcomingEvents.filter(event =>
      !event.user_rsvp || event.user_rsvp.response === 'no_response'
    );
  }, [upcomingEvents]);

  // Get mandatory events without RSVP
  const mandatoryEventsWithoutRsvp = useMemo(() => {
    return eventsNeedingRsvp.filter(event => event.event_type === 'mandatory');
  }, [eventsNeedingRsvp]);

  // Get this week's event count
  const thisWeekEventCount = upcomingEvents.length;

  // Get user's response rate
  const responseRate = useMemo(() => {
    if (upcomingEvents.length === 0) return 100;
    const responded = upcomingEvents.filter(event =>
      event.user_rsvp && event.user_rsvp.response !== 'no_response'
    ).length;
    return Math.round((responded / upcomingEvents.length) * 100);
  }, [upcomingEvents]);

  // Fetch dashboard data
  useEffect(() => {
    if (!profile) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get pending forms count
        const { data: allFormsData } = await supabase
          .from('forms')
          .select('id, gender, team_level')
          .eq('is_active', true);

        if (allFormsData) {
          const formsData = allFormsData.filter(form => {
            const genderMatch = !form.gender || form.gender === profile.gender;
            const teamLevelMatch = !form.team_level || form.team_level === profile.team_level;
            return genderMatch && teamLevelMatch;
          });

          const { data: responsesData } = await supabase
            .from('form_responses')
            .select('form_id')
            .eq('user_id', profile.id);

          const respondedFormIds = new Set(
            responsesData?.map((r) => r.form_id) || []
          );

          const pendingCount = formsData.filter(
            (form) => !respondedFormIds.has(form.id)
          ).length;

          setPendingFormsCount(pendingCount);
        }

        // Get today's classes
        const today = new Date();
        const dayOfWeek = today.getDay();

        const { data: classesData } = await supabase
          .from('class_schedules')
          .select('*')
          .eq('user_id', profile.id)
          .eq('day_of_week', dayOfWeek)
          .order('start_time', { ascending: true });

        setTodayClasses(classesData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [profile, supabase]);

  // Combine today's events and classes for timeline
  const todayTimeline = useMemo(() => {
    const timeline: any[] = [];

    // Add events
    todayEvents.forEach(event => {
      timeline.push({
        id: event.id,
        title: event.title,
        type: 'event' as const,
        startTime: format(new Date(event.start_datetime), 'h:mm a'),
        endTime: format(new Date(event.end_datetime), 'h:mm a'),
        location: event.location,
        eventType: event.event_type,
      });
    });

    // Add classes
    todayClasses.forEach(cls => {
      timeline.push({
        id: cls.id,
        title: cls.class_name || 'Class',
        type: 'class' as const,
        startTime: format(new Date(`2000-01-01T${cls.start_time}`), 'h:mm a'),
        endTime: format(new Date(`2000-01-01T${cls.end_time}`), 'h:mm a'),
        location: cls.location,
      });
    });

    return timeline.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [todayEvents, todayClasses]);

  const handleSaveClass = async (data: {
    type: 'class' | 'availability' | 'blocker';
    days?: number[];
    startTime: string;
    endTime: string;
    courseName?: string;
    location?: string;
    quarter?: string;
  }) => {
    try {
      if (data.type === 'class' && data.days) {
        await addMultiDayClass({
          days: data.days,
          startTime: data.startTime,
          endTime: data.endTime,
          courseName: data.courseName,
          location: data.location,
        });

        toast({
          title: 'Classes added!',
          description: `Successfully added ${data.days.length} class${data.days.length > 1 ? 'es' : ''} to your schedule`,
        });
      }
    } catch (error) {
      console.error('Failed to save class:', error);
      toast({
        title: 'Failed to add class',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
      throw error;
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-7xl pb-8">
      {/* Hero Section - Personalized Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
          {getGreeting()}, {profile.first_name}!
        </h1>
        <p className="text-lg text-neutral-600">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </motion.div>

      {/* Alert Banners */}
      {mandatoryEventsWithoutRsvp.length > 0 && (
        <AlertBanner variant="danger">
          <div className="space-y-2">
            <p className="font-semibold">Action Required: Mandatory Event RSVP</p>
            <p className="text-sm">
              You have {mandatoryEventsWithoutRsvp.length} mandatory{' '}
              {mandatoryEventsWithoutRsvp.length === 1 ? 'event' : 'events'} that need your response.
            </p>
            <Link href="/events">
              <Button size="sm" variant="default" className="mt-2">
                RSVP Now
              </Button>
            </Link>
          </div>
        </AlertBanner>
      )}

      {pendingFormsCount > 0 && (
        <AlertBanner variant="warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">You have {pendingFormsCount} pending form{pendingFormsCount > 1 ? 's' : ''}</p>
              <p className="text-sm">Please complete them when you have a moment.</p>
            </div>
            <Link href="/forms">
              <Button size="sm" variant="outline">
                View Forms
              </Button>
            </Link>
          </div>
        </AlertBanner>
      )}

      {/* Quick Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <StatCard
          icon={Calendar}
          value={thisWeekEventCount}
          label="Events this week"
          color="maroon"
          loading={eventsLoading}
          onClick={() => window.location.href = '/events'}
        />
        <StatCard
          icon={FileText}
          value={pendingFormsCount}
          label="Pending forms"
          color={pendingFormsCount > 0 ? 'orange' : 'green'}
          loading={loading}
          onClick={() => window.location.href = '/forms'}
        />
        <StatCard
          icon={TrendingUp}
          value={`${responseRate}%`}
          label="Response rate"
          color={responseRate >= 80 ? 'green' : responseRate >= 50 ? 'orange' : 'neutral'}
          loading={eventsLoading}
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Today's Timeline */}
          <TodayTimeline events={todayTimeline} />

          {/* Quick Actions */}
          <QuickActionsCard
            onAddClassClick={() => setIsAddClassDialogOpen(true)}
            pendingFormsCount={pendingFormsCount}
          />
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {/* Upcoming Events */}
          <UpcomingEventsList
            events={upcomingEvents.map(e => ({
              id: e.id,
              title: e.title,
              startDatetime: e.start_datetime,
              endDatetime: e.end_datetime,
              location: e.location || undefined,
              eventType: e.event_type,
              userRsvp: e.user_rsvp?.response,
              attendeeCount: e.attendee_count,
            }))}
            maxEvents={5}
          />
        </motion.div>
      </div>

      {/* Add Class Dialog */}
      <UnifiedAddItemDialog
        open={isAddClassDialogOpen}
        onOpenChange={setIsAddClassDialogOpen}
        onSave={handleSaveClass}
        initialType="class"
      />
    </div>
  );
}
