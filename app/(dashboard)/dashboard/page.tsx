'use client';

/**
 * Main dashboard page
 * Shows welcome message, quick stats, and quick action buttons
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/lib/hooks/useUser';
import { getClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BRAND_COLORS, UserRole } from '@/lib/constants';
import {
  Calendar,
  Clock,
  CalendarDays,
  FileText,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Event, Form, PracticeAvailability } from '@/lib/types/database.types';

export default function DashboardPage() {
  const { profile } = useUser();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pendingFormsCount, setPendingFormsCount] = useState(0);
  const [weekAvailabilityCount, setWeekAvailabilityCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = getClient();

  useEffect(() => {
    if (!profile) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get upcoming events (next 3)
        const now = new Date().toISOString();
        const { data: eventsData } = await supabase
          .from('events')
          .select('*')
          .gte('start_datetime', now)
          .or(`gender.is.null,gender.eq.${profile.gender}`)
          .or(`team_level.is.null,team_level.eq.${profile.team_level}`)
          .order('start_datetime', { ascending: true })
          .limit(3);

        if (eventsData) {
          setUpcomingEvents(eventsData);
        }

        // Get pending forms count
        const { data: formsData } = await supabase
          .from('forms')
          .select('id')
          .eq('is_active', true)
          .or(`gender.is.null,gender.eq.${profile.gender}`)
          .or(`team_level.is.null,team_level.eq.${profile.team_level}`);

        if (formsData) {
          // Check which forms user hasn't responded to
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

        // Get this week's availability count
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday

        const { data: availabilityData } = await supabase
          .from('practice_availability')
          .select('*')
          .eq('user_id', profile.id)
          .gte('date', startOfWeek.toISOString().split('T')[0])
          .lte('date', endOfWeek.toISOString().split('T')[0]);

        if (availabilityData) {
          setWeekAvailabilityCount(availabilityData.length);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [profile, supabase]);

  if (!profile) {
    return null;
  }

  const isAdmin = profile.role === UserRole.COACH || profile.role === UserRole.CAPTAIN;

  const formatEventDate = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome back, {profile.first_name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here&apos;s what&apos;s happening with your team today.
        </p>
      </div>

      {/* Quick stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-gray-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              In the next 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Forms
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingFormsCount}</div>
            <p className="text-xs text-gray-500 mt-1">
              Awaiting your response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Week&apos;s Availability
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weekAvailabilityCount}/7</div>
            <p className="text-xs text-gray-500 mt-1">
              Days marked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to help you get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Button
              asChild
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:shadow-md transition-shadow"
            >
              <Link href="/availability">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5" style={{ color: BRAND_COLORS.PRIMARY }} aria-hidden="true" />
                  <span className="font-semibold">Add Availability</span>
                </div>
                <span className="text-xs text-gray-600 text-left">
                  Update your practice availability
                </span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:shadow-md transition-shadow"
            >
              <Link href="/schedule">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5" style={{ color: BRAND_COLORS.PRIMARY }} aria-hidden="true" />
                  <span className="font-semibold">View Schedule</span>
                </div>
                <span className="text-xs text-gray-600 text-left">
                  Check your class schedule
                </span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:shadow-md transition-shadow"
            >
              <Link href="/events">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="h-5 w-5" style={{ color: BRAND_COLORS.PRIMARY }} aria-hidden="true" />
                  <span className="font-semibold">View Events</span>
                </div>
                <span className="text-xs text-gray-600 text-left">
                  See upcoming team events
                </span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming events section */}
      {upcomingEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Your next scheduled team events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatEventDate(event.start_datetime)}
                      {event.location && ` • ${event.location}`}
                    </p>
                    <div className="mt-2">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor:
                            event.event_type === 'mandatory'
                              ? `${BRAND_COLORS.PRIMARY}20`
                              : event.event_type === 'recommended'
                              ? `${BRAND_COLORS.ACCENT}20`
                              : '#e5e7eb',
                          color:
                            event.event_type === 'mandatory'
                              ? BRAND_COLORS.PRIMARY
                              : event.event_type === 'recommended'
                              ? BRAND_COLORS.ACCENT
                              : '#6b7280',
                        }}
                      >
                        {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              ))}
              <Button asChild variant="outline" className="w-full">
                <Link href="/events">View All Events</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin quick actions */}
      {isAdmin && (
        <Card style={{ borderColor: BRAND_COLORS.PRIMARY }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: BRAND_COLORS.PRIMARY }} aria-hidden="true" />
              <CardTitle>Admin Actions</CardTitle>
            </div>
            <CardDescription>
              Team management and administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <Button
                asChild
                variant="outline"
                className="h-auto flex-col items-start p-4 hover:shadow-md transition-shadow"
                style={{ borderColor: BRAND_COLORS.PRIMARY }}
              >
                <Link href="/admin">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold" style={{ color: BRAND_COLORS.PRIMARY }}>
                      Admin Dashboard
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 text-left">
                    View team overview and manage settings
                  </span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto flex-col items-start p-4 hover:shadow-md transition-shadow"
                style={{ borderColor: BRAND_COLORS.PRIMARY }}
              >
                <Link href="/admin/events">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold" style={{ color: BRAND_COLORS.PRIMARY }}>
                      Create Event
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 text-left">
                    Schedule a new team event
                  </span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
