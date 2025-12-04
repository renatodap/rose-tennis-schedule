'use client';

/**
 * Team Events Page - $100M DESIGN SYSTEM
 * Premium events experience: scannable, urgent, one-tap RSVP, feedback-rich
 * Features: Filter tabs, date grouping, pull-to-refresh (future), search capability
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventFilters, EventFilter } from '@/components/events/EventFilters';
import { EventListSkeleton } from '@/components/events/EventListSkeleton';
import { CompactEventList } from '@/components/events/CompactEventList';
import { useEvents } from '@/lib/hooks/useEvents';
import { CalendarDays, Sparkles } from 'lucide-react';
import { EventType } from '@/lib/constants';
import { isToday, isTomorrow, isThisWeek, isPast } from 'date-fns';
import { cn } from '@/lib/utils/cn';

export default function EventsPage() {
  const { events, loading, error, refresh, getUpcomingEvents, getPastEvents } = useEvents();
  const [activeFilter, setActiveFilter] = useState<EventFilter>('upcoming');

  // Exclude matches from team events view - matches have their own dedicated page
  const teamEvents = events.filter(event => event.event_type !== EventType.MATCH);
  const upcomingEvents = getUpcomingEvents().filter(event => event.event_type !== EventType.MATCH);
  const pastEvents = getPastEvents().filter(event => event.event_type !== EventType.MATCH);

  // Events that need RSVP (upcoming events with no response)
  const needsRsvpEvents = upcomingEvents.filter(
    event => !event.user_rsvp || event.user_rsvp.response === 'no_response'
  );

  // Filter events based on active filter
  const filteredEvents = useMemo(() => {
    switch (activeFilter) {
      case 'all':
        return teamEvents;
      case 'upcoming':
        return upcomingEvents;
      case 'past':
        return pastEvents;
      case 'needs-rsvp':
        return needsRsvpEvents;
      default:
        return upcomingEvents;
    }
  }, [activeFilter, teamEvents, upcomingEvents, pastEvents, needsRsvpEvents]);

  // Group events by date category
  const groupedEvents = useMemo(() => {
    const groups = {
      today: [] as typeof filteredEvents,
      tomorrow: [] as typeof filteredEvents,
      thisWeek: [] as typeof filteredEvents,
      later: [] as typeof filteredEvents,
      past: [] as typeof filteredEvents,
    };

    filteredEvents.forEach(event => {
      const eventDate = new Date(event.start_datetime);

      if (isPast(eventDate)) {
        groups.past.push(event);
      } else if (isToday(eventDate)) {
        groups.today.push(event);
      } else if (isTomorrow(eventDate)) {
        groups.tomorrow.push(event);
      } else if (isThisWeek(eventDate)) {
        groups.thisWeek.push(event);
      } else {
        groups.later.push(event);
      }
    });

    return groups;
  }, [filteredEvents]);

  // Filter counts for badges
  const filterCounts = {
    all: teamEvents.length,
    upcoming: upcomingEvents.length,
    past: pastEvents.length,
    needsRsvp: needsRsvpEvents.length,
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
            Team Events
          </h1>
          <p className="mt-2 text-base text-neutral-600">
            View and respond to team events
          </p>
        </div>
        <EventFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <EventListSkeleton count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
            Team Events
          </h1>
          <p className="mt-2 text-base text-neutral-600">
            View and respond to team events
          </p>
        </div>
        <div className="text-center py-12 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">Error loading events. Please try again.</p>
        </div>
      </div>
    );
  }

  const showEmptyState = filteredEvents.length === 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
            Team Events
          </h1>
          <p className="mt-2 text-base text-neutral-600">
            View and respond to team events
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-0 z-10 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 bg-white/80 backdrop-blur-sm border-b border-neutral-200">
        <EventFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={filterCounts}
        />
      </div>

      {/* Event Lists */}
      <AnimatePresence mode="wait">
        {showEmptyState ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-center py-16 bg-gradient-to-br from-neutral-50 to-neutral-100 border border-dashed border-neutral-300 rounded-2xl"
          >
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-maroon-700 to-maroon-600 flex items-center justify-center mb-6 shadow-lg">
              <CalendarDays className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              {activeFilter === 'needs-rsvp' ? 'All Caught Up!' : 'No Events Found'}
            </h3>
            <p className="text-neutral-600 max-w-sm mx-auto">
              {activeFilter === 'needs-rsvp'
                ? 'You\'ve responded to all upcoming events. Great job staying organized!'
                : activeFilter === 'past'
                ? 'No past events to show yet.'
                : 'There are no upcoming events scheduled at this time.'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="events"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* Today */}
            {groupedEvents.today.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-neutral-900">
                    Today
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-maroon-100 text-maroon-700 text-xs font-semibold rounded-full">
                    <Sparkles className="h-3 w-3" />
                    Now
                  </span>
                </div>
                <CompactEventList
                  events={groupedEvents.today}
                  onRsvpChange={refresh}
                />
              </div>
            )}

            {/* Tomorrow */}
            {groupedEvents.tomorrow.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-neutral-900">
                  Tomorrow
                </h2>
                <CompactEventList
                  events={groupedEvents.tomorrow}
                  onRsvpChange={refresh}
                />
              </div>
            )}

            {/* This Week */}
            {groupedEvents.thisWeek.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-neutral-900">
                  This Week
                </h2>
                <CompactEventList
                  events={groupedEvents.thisWeek}
                  onRsvpChange={refresh}
                />
              </div>
            )}

            {/* Later / Future */}
            {groupedEvents.later.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-neutral-900">
                  Coming Up
                </h2>
                <CompactEventList
                  events={groupedEvents.later}
                  onRsvpChange={refresh}
                />
              </div>
            )}

            {/* Past Events (only shown when filter is 'past' or 'all') */}
            {(activeFilter === 'past' || activeFilter === 'all') && groupedEvents.past.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-neutral-600">
                  Past Events
                </h2>
                <CompactEventList
                  events={groupedEvents.past}
                  onRsvpChange={refresh}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
