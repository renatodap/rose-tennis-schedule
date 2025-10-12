/**
 * Availability page (placeholder)
 * Future implementation will allow users to manage practice availability
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

export default function AvailabilityPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Practice Availability
        </h1>
        <p className="mt-2 text-gray-600">
          Mark your availability for daily practice sessions
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${BRAND_COLORS.PRIMARY}20` }}
            >
              <Clock className="h-6 w-6" style={{ color: BRAND_COLORS.PRIMARY }} aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Availability Management</CardTitle>
              <CardDescription>
                Coming Soon
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${BRAND_COLORS.PRIMARY}10` }}>
              <Clock className="h-12 w-12" style={{ color: BRAND_COLORS.PRIMARY }} aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Practice Availability Tracking
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              This feature will allow you to mark your daily availability for practice.
              Coaches will use this information to determine the best practice times
              and track attendance.
            </p>
            <div className="text-sm text-gray-500">
              <p className="font-medium mb-2">Upcoming features:</p>
              <ul className="space-y-1">
                <li>• Daily availability marking</li>
                <li>• Week-at-a-glance view</li>
                <li>• Bulk updates</li>
                <li>• Automated conflict detection</li>
                <li>• Notes and explanations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
