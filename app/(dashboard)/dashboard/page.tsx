'use client';

/**
 * Main dashboard page
 * Shows welcome message, quick stats, and quick action buttons
 */

import { useEffect, useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { getClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function DashboardPage() {
  const { profile } = useUser();
  const [pendingFormsCount, setPendingFormsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = getClient();

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
          // Filter forms that match user's gender and team level
          const formsData = allFormsData.filter(form => {
            const genderMatch = !form.gender || form.gender === profile.gender;
            const teamLevelMatch = !form.team_level || form.team_level === profile.team_level;
            return genderMatch && teamLevelMatch;
          });

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
      <div className="grid gap-4 md:grid-cols-2">
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
      </div>

    </div>
  );
}
