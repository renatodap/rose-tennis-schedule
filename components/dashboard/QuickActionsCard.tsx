'use client';

/**
 * QuickActionsCard component
 * Provides quick access to common actions from the dashboard
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Calendar, Clock } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';
import { useRouter } from 'next/navigation';

interface QuickActionsCardProps {
  onAddClassClick: () => void;
}

export function QuickActionsCard({ onAddClassClick }: QuickActionsCardProps) {
  const router = useRouter();

  return (
    <Card className="border-2 border-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          {/* Primary Action - Add Classes */}
          <Button
            onClick={onAddClassClick}
            style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
            className="h-auto py-4 px-4 flex flex-col items-center gap-2 text-white hover:opacity-90 shadow-md transition-all hover:shadow-lg"
            size="lg"
          >
            <GraduationCap className="h-8 w-8" />
            <div className="text-center">
              <div className="font-semibold">Add Classes</div>
              <div className="text-xs opacity-90 mt-0.5">Set up your schedule</div>
            </div>
          </Button>

          {/* View Schedule */}
          <Button
            onClick={() => router.push('/schedule')}
            variant="outline"
            className="h-auto py-4 px-4 flex flex-col items-center gap-2 border-2 hover:bg-gray-50 transition-all"
            size="lg"
          >
            <Calendar className="h-8 w-8 text-gray-700" />
            <div className="text-center">
              <div className="font-semibold text-gray-900">View Schedule</div>
              <div className="text-xs text-gray-600 mt-0.5">See your week</div>
            </div>
          </Button>

          {/* Mark Availability */}
          <Button
            onClick={() => router.push('/schedule')}
            variant="outline"
            className="h-auto py-4 px-4 flex flex-col items-center gap-2 border-2 hover:bg-gray-50 transition-all"
            size="lg"
          >
            <Clock className="h-8 w-8 text-gray-700" />
            <div className="text-center">
              <div className="font-semibold text-gray-900">Availability</div>
              <div className="text-xs text-gray-600 mt-0.5">Mark when you're free</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
