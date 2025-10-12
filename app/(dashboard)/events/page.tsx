/**
 * Events page (placeholder)
 * Future implementation will show team events and allow RSVPs
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

export default function EventsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Team Events
        </h1>
        <p className="mt-2 text-gray-600">
          View and respond to upcoming team events
        </p>
      </div>

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
              <CardDescription>
                Coming Soon
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${BRAND_COLORS.PRIMARY}10` }}>
              <CalendarDays className="h-12 w-12" style={{ color: BRAND_COLORS.PRIMARY }} aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Team Event Coordination
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              This feature will allow you to view all team events including practices,
              matches, meetings, and social gatherings. You&apos;ll be able to RSVP and
              communicate with your team.
            </p>
            <div className="text-sm text-gray-500">
              <p className="font-medium mb-2">Upcoming features:</p>
              <ul className="space-y-1">
                <li>• View all team events</li>
                <li>• RSVP to events</li>
                <li>• Event type filtering (practice, match, meeting)</li>
                <li>• Calendar integration</li>
                <li>• Event reminders</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
