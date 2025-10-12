'use client';

/**
 * Admin dashboard page
 * Shows team overview statistics and quick admin actions
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/lib/hooks/useUser';
import { getClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BRAND_COLORS, Gender } from '@/lib/constants';
import {
  Users,
  CalendarDays,
  FileText,
  TrendingUp,
  UserPlus,
  Calendar,
  ClipboardList,
  BarChart3,
} from 'lucide-react';

interface TeamStats {
  totalPlayers: number;
  menCount: number;
  womenCount: number;
  upcomingEventsCount: number;
  activeFormsCount: number;
  thisWeekAvailability: number;
}

interface EventInsight {
  id: string;
  title: string;
  start_datetime: string;
  response_rate: number;
  going_count: number;
  total_eligible: number;
}

interface FormInsight {
  id: string;
  title: string;
  completion_rate: number;
  responses_count: number;
  total_eligible: number;
  due_date?: string;
}

export default function AdminDashboardPage() {
  const { profile } = useUser();
  const [stats, setStats] = useState<TeamStats>({
    totalPlayers: 0,
    menCount: 0,
    womenCount: 0,
    upcomingEventsCount: 0,
    activeFormsCount: 0,
    thisWeekAvailability: 0,
  });
  const [eventInsights, setEventInsights] = useState<EventInsight[]>([]);
  const [formInsights, setFormInsights] = useState<FormInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getClient();

  useEffect(() => {
    if (!profile) return;

    const fetchStats = async () => {
      try {
        setLoading(true);

        // Get total players by gender
        const { data: usersData } = await supabase
          .from('users')
          .select('gender')
          .eq('role', 'player');

        if (usersData) {
          const menCount = usersData.filter(u => u.gender === Gender.MEN).length;
          const womenCount = usersData.filter(u => u.gender === Gender.WOMEN).length;
          setStats(prev => ({
            ...prev,
            totalPlayers: usersData.length,
            menCount,
            womenCount,
          }));
        }

        // Get upcoming events count
        const now = new Date().toISOString();
        const { data: eventsData } = await supabase
          .from('events')
          .select('id')
          .gte('start_datetime', now);

        if (eventsData) {
          setStats(prev => ({
            ...prev,
            upcomingEventsCount: eventsData.length,
          }));
        }

        // Get active forms count
        const { data: formsData } = await supabase
          .from('forms')
          .select('id')
          .eq('is_active', true);

        if (formsData) {
          setStats(prev => ({
            ...prev,
            activeFormsCount: formsData.length,
          }));
        }

        // Get this week's availability submissions
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const { data: availabilityData } = await supabase
          .from('practice_availability')
          .select('id')
          .gte('date', startOfWeek.toISOString().split('T')[0])
          .lte('date', endOfWeek.toISOString().split('T')[0]);

        if (availabilityData) {
          setStats(prev => ({
            ...prev,
            thisWeekAvailability: availabilityData.length,
          }));
        }

        // Fetch event insights - upcoming events with low response rates
        const { data: upcomingEvents } = await supabase
          .from('events')
          .select('*')
          .gte('start_datetime', now)
          .order('start_datetime', { ascending: true })
          .limit(5);

        if (upcomingEvents && usersData) {
          const insights: EventInsight[] = [];

          for (const event of upcomingEvents) {
            // Calculate eligible users for this event
            const eligibleUsers = usersData.filter(user => {
              const genderMatch = event.applies_to_men && user.gender === 'men' ||
                                 event.applies_to_women && user.gender === 'women';
              return genderMatch;
            });

            // Get response count
            const { data: responses } = await supabase
              .from('event_responses')
              .select('response')
              .eq('event_id', event.id);

            const goingCount = responses?.filter(r => r.response === 'going').length || 0;
            const responseRate = eligibleUsers.length > 0
              ? (responses?.length || 0) / eligibleUsers.length
              : 0;

            insights.push({
              id: event.id,
              title: event.title,
              start_datetime: event.start_datetime,
              response_rate: responseRate * 100,
              going_count: goingCount,
              total_eligible: eligibleUsers.length,
            });
          }

          // Sort by response rate (lowest first) to highlight events needing attention
          setEventInsights(insights.sort((a, b) => a.response_rate - b.response_rate));
        }

        // Fetch form insights - active forms with completion rates
        const { data: activeForms } = await supabase
          .from('forms')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(5);

        if (activeForms && usersData) {
          const formInsightData: FormInsight[] = [];

          for (const form of activeForms) {
            // Calculate eligible users for this form
            const eligibleUsers = usersData.filter(user => {
              if (form.gender && user.gender !== form.gender) return false;
              if (form.team_level && user.team_level !== form.team_level) return false;
              return true;
            });

            // Get response count
            const { count: responseCount } = await supabase
              .from('form_responses')
              .select('*', { count: 'exact', head: true })
              .eq('form_id', form.id);

            const completionRate = eligibleUsers.length > 0
              ? (responseCount || 0) / eligibleUsers.length
              : 0;

            formInsightData.push({
              id: form.id,
              title: form.title,
              completion_rate: completionRate * 100,
              responses_count: responseCount || 0,
              total_eligible: eligibleUsers.length,
              due_date: form.due_date || undefined,
            });
          }

          // Sort by completion rate (lowest first) to highlight forms needing attention
          setFormInsights(formInsightData.sort((a, b) => a.completion_rate - b.completion_rate));
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [profile, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div
          className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: `${BRAND_COLORS.PRIMARY} transparent ${BRAND_COLORS.PRIMARY} ${BRAND_COLORS.PRIMARY}` }}
          aria-label="Loading"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Players
            </CardTitle>
            <Users className="h-4 w-4 text-gray-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlayers}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.menCount} men, {stats.womenCount} women
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-gray-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEventsCount}</div>
            <p className="text-xs text-gray-500 mt-1">
              Scheduled events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Forms
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeFormsCount}</div>
            <p className="text-xs text-gray-500 mt-1">
              Awaiting responses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Week Availability
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeekAvailability}</div>
            <p className="text-xs text-gray-500 mt-1">
              Submissions this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights Section */}
      {(eventInsights.length > 0 || formInsights.length > 0) && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Key Insights</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Event Response Insights */}
            {eventInsights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Response Rates</CardTitle>
                  <CardDescription>
                    Upcoming events ordered by response rate (lowest first)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {eventInsights.map((event) => (
                      <div key={event.id} className="border-l-4 pl-3" style={{
                        borderColor: event.response_rate < 30 ? '#dc2626' : event.response_rate < 60 ? '#f59e0b' : '#16a34a'
                      }}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-900">{event.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {new Date(event.start_datetime).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold" style={{
                              color: event.response_rate < 30 ? '#dc2626' : event.response_rate < 60 ? '#f59e0b' : '#16a34a'
                            }}>
                              {event.response_rate.toFixed(0)}%
                            </div>
                            <p className="text-xs text-gray-600">
                              {event.going_count}/{event.total_eligible} going
                            </p>
                          </div>
                        </div>
                        {event.response_rate < 50 && (
                          <p className="text-xs text-yellow-700 mt-2 bg-yellow-50 px-2 py-1 rounded">
                            ⚠️ Low response rate - consider sending a reminder
                          </p>
                        )}
                      </div>
                    ))}
                    <Button asChild variant="outline" className="w-full mt-2">
                      <Link href="/admin/events">View All Events</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form Completion Insights */}
            {formInsights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Form Completion Rates</CardTitle>
                  <CardDescription>
                    Active forms ordered by completion rate (lowest first)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formInsights.map((form) => (
                      <div key={form.id} className="border-l-4 pl-3" style={{
                        borderColor: form.completion_rate < 30 ? '#dc2626' : form.completion_rate < 60 ? '#f59e0b' : '#16a34a'
                      }}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-900">{form.title}</h4>
                            {form.due_date && (
                              <p className="text-xs text-gray-600 mt-1">
                                Due: {new Date(form.due_date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold" style={{
                              color: form.completion_rate < 30 ? '#dc2626' : form.completion_rate < 60 ? '#f59e0b' : '#16a34a'
                            }}>
                              {form.completion_rate.toFixed(0)}%
                            </div>
                            <p className="text-xs text-gray-600">
                              {form.responses_count}/{form.total_eligible} responses
                            </p>
                          </div>
                        </div>
                        {form.completion_rate < 50 && (
                          <p className="text-xs text-yellow-700 mt-2 bg-yellow-50 px-2 py-1 rounded">
                            ⚠️ Low completion rate - consider sending a reminder
                          </p>
                        )}
                      </div>
                    ))}
                    <Button asChild variant="outline" className="w-full mt-2">
                      <Link href="/admin/forms">View All Forms</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Team Management</CardTitle>
            <CardDescription>
              Manage team members and roster
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              asChild
              variant="outline"
              className="w-full justify-start"
            >
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" aria-hidden="true" />
                View All Users
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start"
              disabled
            >
              <div>
                <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />
                Add New User (Coming Soon)
              </div>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Management</CardTitle>
            <CardDescription>
              Schedule and manage team events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              asChild
              variant="outline"
              className="w-full justify-start"
            >
              <Link href="/admin/events">
                <CalendarDays className="mr-2 h-4 w-4" aria-hidden="true" />
                View All Events
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start"
            >
              <Link href="/admin/events">
                <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
                Create New Event
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Forms & Surveys</CardTitle>
            <CardDescription>
              Create and manage team forms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              asChild
              variant="outline"
              className="w-full justify-start"
            >
              <Link href="/admin/forms">
                <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                View All Forms
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start"
            >
              <Link href="/admin/forms">
                <ClipboardList className="mr-2 h-4 w-4" aria-hidden="true" />
                Create New Form
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reports & Analytics</CardTitle>
            <CardDescription>
              View team insights and reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              asChild
              variant="outline"
              className="w-full justify-start"
            >
              <Link href="/admin/reports">
                <BarChart3 className="mr-2 h-4 w-4" aria-hidden="true" />
                View Reports
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start"
              disabled
            >
              <div>
                <TrendingUp className="mr-2 h-4 w-4" aria-hidden="true" />
                Export Data (Coming Soon)
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Information card */}
      <Card style={{ borderColor: BRAND_COLORS.PRIMARY }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" style={{ color: BRAND_COLORS.PRIMARY }} aria-hidden="true" />
            Admin Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            As an administrator, you have access to enhanced features for managing the team.
          </p>
          <div className="text-sm text-gray-500">
            <p className="font-medium mb-2">Available features:</p>
            <ul className="space-y-1 ml-4">
              <li>• View team statistics and overview</li>
              <li>• Create and manage team events with RSVP tracking</li>
              <li>• Design custom forms and surveys</li>
              <li>• View detailed availability reports</li>
              <li>• Navigate to user, event, form, and report management sections</li>
            </ul>
            <p className="font-medium mb-2 mt-4">Coming soon:</p>
            <ul className="space-y-1 ml-4">
              <li>• Manage user roles and permissions</li>
              <li>• Export comprehensive data for analysis</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
