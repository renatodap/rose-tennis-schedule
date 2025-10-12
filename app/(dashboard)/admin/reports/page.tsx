/**
 * Admin reports page (placeholder)
 * Future implementation will show team analytics and reports
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

export default function AdminReportsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.PRIMARY}20` }}
          >
            <BarChart3 className="h-6 w-6" style={{ color: BRAND_COLORS.PRIMARY }} aria-hidden="true" />
          </div>
          <div>
            <CardTitle>Reports & Analytics</CardTitle>
            <CardDescription>Coming Soon</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p className="text-gray-600">
            Reports and analytics features are under development.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
