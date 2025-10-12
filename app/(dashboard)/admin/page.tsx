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
              disabled
            >
              <div>
                <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
                Create New Event (Coming Soon)
              </div>
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
              disabled
            >
              <div>
                <ClipboardList className="mr-2 h-4 w-4" aria-hidden="true" />
                Create New Form (Coming Soon)
              </div>
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
            Most admin features are currently in development and will be available soon.
          </p>
          <div className="text-sm text-gray-500">
            <p className="font-medium mb-2">Available features:</p>
            <ul className="space-y-1 ml-4">
              <li>• View team statistics and overview</li>
              <li>• Navigate to user, event, form, and report management sections</li>
            </ul>
            <p className="font-medium mb-2 mt-4">Coming soon:</p>
            <ul className="space-y-1 ml-4">
              <li>• Create and manage team events</li>
              <li>• Design custom forms and surveys</li>
              <li>• Generate detailed availability reports</li>
              <li>• Manage user roles and permissions</li>
              <li>• Export data for analysis</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
