'use client';

/**
 * Team Events Page
 * Displays upcoming and past team events with RSVP functionality
 * Includes tabs for Upcoming, Past, and My RSVPs
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EventCard } from '@/components/events/EventCard';
import { useEvents } from '@/lib/hooks/useEvents';
import { CalendarDays, Loader2 } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

export default function EventsPage() {
  const { events, loading, error, refresh, getUpcomingEvents, getPastEvents, getMyRsvps, getEventsByResponse } = useEvents();
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');

  const upcomingEvents = getUpcomingEvents();
  const pastEvents = getPastEvents();
  const myRsvps = getMyRsvps();

  // Apply event type filter
  const filterByType = (eventList: typeof events) => {
    if (eventTypeFilter === 'all') return eventList;
    return eventList.filter(event => event.event_type === eventTypeFilter);
  };

  const filteredUpcoming = filterByType(upcomingEvents);
  const filteredPast = filterByType(pastEvents);

  // Group My RSVPs by response type
  const goingEvents = getEventsByResponse('going');
  const maybeEvents = getEventsByResponse('maybe');
  const notGoingEvents = getEventsByResponse('not_going');

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Team Events
        </h1>
        <p className="mt-2 text-gray-600">
          View and respond to upcoming team events
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastEvents.length})
            </TabsTrigger>
            <TabsTrigger value="my-rsvps">
              My RSVPs ({myRsvps.length})
            </TabsTrigger>
          </TabsList>

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

        <TabsContent value="upcoming" className="space-y-4">
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
            <>
              {/* Mandatory events first */}
              {filteredUpcoming.filter(e => e.event_type === 'mandatory').length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-red-700 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-red-600 rounded-full"></span>
                    Mandatory Events
                  </h2>
                  {filteredUpcoming
                    .filter(e => e.event_type === 'mandatory')
                    .map(event => (
                      <EventCard key={event.id} event={event} onRsvpChange={refresh} />
                    ))}
                </div>
              )}

              {/* Recommended events */}
              {filteredUpcoming.filter(e => e.event_type === 'recommended').length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-orange-700 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-orange-600 rounded-full"></span>
                    Recommended Events
                  </h2>
                  {filteredUpcoming
                    .filter(e => e.event_type === 'recommended')
                    .map(event => (
                      <EventCard key={event.id} event={event} onRsvpChange={refresh} />
                    ))}
                </div>
              )}

              {/* Optional events */}
              {filteredUpcoming.filter(e => e.event_type === 'optional').length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-green-600 rounded-full"></span>
                    Optional Events
                  </h2>
                  {filteredUpcoming
                    .filter(e => e.event_type === 'optional')
                    .map(event => (
                      <EventCard key={event.id} event={event} onRsvpChange={refresh} />
                    ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {filteredPast.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${BRAND_COLORS.PRIMARY}10` }}>
                <CalendarDays className="h-8 w-8" style={{ color: BRAND_COLORS.PRIMARY }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Past Events
              </h3>
              <p className="text-gray-600">
                {eventTypeFilter !== 'all'
                  ? 'No past events match your filter.'
                  : 'There are no past events to display.'}
              </p>
            </div>
          ) : (
            filteredPast.map(event => (
              <EventCard key={event.id} event={event} onRsvpChange={refresh} readOnly />
            ))
          )}
        </TabsContent>

        <TabsContent value="my-rsvps" className="space-y-4">
          {myRsvps.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${BRAND_COLORS.PRIMARY}10` }}>
                <CalendarDays className="h-8 w-8" style={{ color: BRAND_COLORS.PRIMARY }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No RSVPs Yet
              </h3>
              <p className="text-gray-600">
                You haven&apos;t responded to any events yet.
              </p>
            </div>
          ) : (
            <>
              {/* Going */}
              {goingEvents.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-green-600 rounded-full"></span>
                    Going ({goingEvents.length})
                  </h2>
                  {goingEvents.map(event => (
                    <EventCard key={event.id} event={event} onRsvpChange={refresh} />
                  ))}
                </div>
              )}

              {/* Maybe */}
              {maybeEvents.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-yellow-700 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-yellow-600 rounded-full"></span>
                    Maybe ({maybeEvents.length})
                  </h2>
                  {maybeEvents.map(event => (
                    <EventCard key={event.id} event={event} onRsvpChange={refresh} />
                  ))}
                </div>
              )}

              {/* Not Going */}
              {notGoingEvents.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-red-700 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-red-600 rounded-full"></span>
                    Not Going ({notGoingEvents.length})
                  </h2>
                  {notGoingEvents.map(event => (
                    <EventCard key={event.id} event={event} onRsvpChange={refresh} />
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
