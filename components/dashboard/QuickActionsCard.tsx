'use client';

/**
 * QuickActionsCard component
 * Provides quick access to common actions from the dashboard
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

interface QuickActionsCardProps {
  onAddClassClick: () => void;
}

export function QuickActionsCard({ onAddClassClick }: QuickActionsCardProps) {

  return (
    <Card className="border-2 border-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          {/* Primary Action - Add Classes */}
          <Button
            onClick={onAddClassClick}
            style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
            className="h-auto py-6 px-8 flex flex-col items-center gap-2 text-white hover:opacity-90 shadow-md transition-all hover:shadow-lg"
            size="lg"
          >
            <GraduationCap className="h-10 w-10" />
            <div className="text-center">
              <div className="font-semibold text-lg">Add Classes</div>
              <div className="text-sm opacity-90 mt-0.5">Set up your schedule</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
