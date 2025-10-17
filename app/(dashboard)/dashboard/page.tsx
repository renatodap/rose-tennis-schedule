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
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard';
import { UnifiedAddItemDialog } from '@/components/schedule/UnifiedAddItemDialog';
import { useUnifiedSchedule } from '@/lib/hooks/useUnifiedSchedule';
import { useToast } from '@/lib/hooks/use-toast';
import { getCurrentQuarter } from '@/lib/utils/quarters';
import { QUARTERS } from '@/lib/constants';

export default function DashboardPage() {
  const { profile } = useUser();
  const { toast } = useToast();
  const [pendingFormsCount, setPendingFormsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAddClassDialogOpen, setIsAddClassDialogOpen] = useState(false);
  const supabase = getClient();

  // Get current quarter for class schedules
  const currentQuarter = getCurrentQuarter();
  const currentYear = new Date().getFullYear();

  // Determine quarter/year for schedule operations
  // Default to Fall 2025 if no current quarter
  const scheduleQuarter: 'fall' | 'winter' | 'spring' | 'summer' =
    currentQuarter ? (currentQuarter.name.split(' ')[0].toLowerCase() as 'fall' | 'winter' | 'spring' | 'summer') : 'fall';
  const scheduleYear = currentQuarter ? parseInt(currentQuarter.name.match(/\d{4}/)?.[0] || String(currentYear)) : 2025;

  const { addMultiDayClass } = useUnifiedSchedule({
    quarter: scheduleQuarter,
    year: scheduleYear
  });

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

      {/* Quick Actions */}
      <QuickActionsCard onAddClassClick={() => setIsAddClassDialogOpen(true)} />

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
