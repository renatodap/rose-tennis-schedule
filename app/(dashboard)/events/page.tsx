'use client';

/**
 * Team Events Page
 * Displays upcoming and past team events with RSVP functionality
 * Includes tabs for Upcoming, Past, and My RSVPs
 */

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompactEventList } from '@/components/events/CompactEventList';
import { useEvents } from '@/lib/hooks/useEvents';
import { CalendarDays, Loader2 } from 'lucide-react';
import { BRAND_COLORS, EventType } from '@/lib/constants';

export default function EventsPage() {
  const { loading, error, refresh, getUpcomingEvents } = useEvents();
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');

  // Exclude matches from team events view - matches have their own dedicated page
  const upcomingEvents = getUpcomingEvents().filter(event => event.event_type !== EventType.MATCH);

  // Apply event type filter
  const filteredUpcoming = eventTypeFilter === 'all'
    ? upcomingEvents
    : upcomingEvents.filter(event => event.event_type === eventTypeFilter);

  if (loading) {
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
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: BRAND_COLORS.PRIMARY }} />
        </div>
      </div>
    );
  }

  if (error) {
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
        <div className="text-center py-12">
          <p className="text-red-600">Error loading events. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Team Events
          </h1>
          <p className="mt-2 text-gray-600">
            View and respond to upcoming team events
          </p>
        </div>

        <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="mandatory">Mandatory</SelectItem>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="optional">Optional</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredUpcoming.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${BRAND_COLORS.PRIMARY}10` }}>
            <CalendarDays className="h-8 w-8" style={{ color: BRAND_COLORS.PRIMARY }} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Upcoming Events
          </h3>
          <p className="text-gray-600">
            {eventTypeFilter !== 'all'
              ? 'No upcoming events match your filter.'
              : 'There are no upcoming events scheduled at this time.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Mandatory events first */}
          {filteredUpcoming.filter(e => e.event_type === 'mandatory').length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-red-700 flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-red-600 rounded-full"></span>
                Mandatory Events
              </h2>
              <CompactEventList
                events={filteredUpcoming.filter(e => e.event_type === 'mandatory')}
                onRsvpChange={refresh}
              />
            </div>
          )}

          {/* Recommended events */}
          {filteredUpcoming.filter(e => e.event_type === 'recommended').length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-orange-700 flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-orange-600 rounded-full"></span>
                Recommended Events
              </h2>
              <CompactEventList
                events={filteredUpcoming.filter(e => e.event_type === 'recommended')}
                onRsvpChange={refresh}
              />
            </div>
          )}

          {/* Optional events */}
          {filteredUpcoming.filter(e => e.event_type === 'optional').length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-green-600 rounded-full"></span>
                Optional Events
              </h2>
              <CompactEventList
                events={filteredUpcoming.filter(e => e.event_type === 'optional')}
                onRsvpChange={refresh}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
