/**
 * Admin events page (placeholder)
 * Future implementation will allow managing team events
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

export default function AdminEventsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.PRIMARY}20` }}
          >
            <CalendarDays className="h-6 w-6" style={{ color: BRAND_COLORS.PRIMARY }} aria-hidden="true" />
          </div>
          <div>
            <CardTitle>Event Management</CardTitle>
            <CardDescription>Coming Soon</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p className="text-gray-600">
            Event management features are under development.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
