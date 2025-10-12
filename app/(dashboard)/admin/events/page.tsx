'use client';

/**
 * Admin Events Management Page
 * For coaches and captains to create, edit, and manage events
 * Shows RSVP summaries for all events
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateEventDialog } from '@/components/events/CreateEventDialog';
import { EditEventDialog } from '@/components/events/EditEventDialog';
import { EventRsvpList } from '@/components/events/EventRsvpList';
import { useEventManagement } from '@/lib/hooks/useEventManagement';
import { Event } from '@/lib/hooks/useEvents';
import { Plus, Calendar, MapPin, Clock, Users, Edit, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { BRAND_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils/cn';

export default function AdminEventsPage() {
  const { isAdmin, getAllEvents, getRsvpSummary } = useEventManagement();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewingRsvpsEvent, setViewingRsvpsEvent] = useState<Event | null>(null);
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [rsvpSummaries, setRsvpSummaries] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const allEvents = await getAllEvents();
    setEvents(allEvents);

    // Load RSVP summaries for all events
    const summaries = new Map();
    for (const event of allEvents) {
      const summary = await getRsvpSummary(event.id);
      if (summary) {
        summaries.set(event.id, summary);
      }
    }
    setRsvpSummaries(summaries);
    setLoading(false);
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6 max-w-6xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Event Management
          </h1>
          <p className="mt-2 text-gray-600">
            Access denied. Only coaches and captains can manage events.
          </p>
        </div>
      </div>
    );
  }

  // Filter events
  const now = new Date().toISOString();
  let filteredEvents = events;

  // Filter by time
  if (timeFilter === 'upcoming') {
    filteredEvents = filteredEvents.filter(e => e.start_datetime >= now);
  } else if (timeFilter === 'past') {
    filteredEvents = filteredEvents.filter(e => e.start_datetime < now);
  }

  // Filter by event type
  if (eventTypeFilter !== 'all') {
    filteredEvents = filteredEvents.filter(e => e.event_type === eventTypeFilter);
  }

  const eventTypeColors = {
    mandatory: 'bg-red-100 text-red-800 border-red-300',
    recommended: 'bg-orange-100 text-orange-800 border-orange-300',
    optional: 'bg-green-100 text-green-800 border-green-300',
  };

  const eventTypeLabels = {
    mandatory: 'Mandatory',
    recommended: 'Recommended',
    optional: 'Optional',
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Event Management
          </h1>
          <p className="mt-2 text-gray-600">
            Create and manage team events
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select value={timeFilter} onValueChange={(value: any) => setTimeFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>

        <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="mandatory">Mandatory</SelectItem>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="optional">Optional</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: BRAND_COLORS.PRIMARY }} />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${BRAND_COLORS.PRIMARY}10` }}>
            <Calendar className="h-8 w-8" style={{ color: BRAND_COLORS.PRIMARY }} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Events Found
          </h3>
          <p className="text-gray-600 mb-4">
            {timeFilter !== 'all' || eventTypeFilter !== 'all'
              ? 'No events match your filters.'
              : 'Get started by creating your first event.'}
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map((event) => {
            const summary = rsvpSummaries.get(event.id);
            const startDate = new Date(event.start_datetime);
            const endDate = new Date(event.end_datetime);
            const isPast = event.start_datetime < now;

            return (
              <Card
                key={event.id}
                className={cn(
                  'hover:shadow-md transition-shadow',
                  event.event_type === 'mandatory' && 'border-red-500 border-2',
                  isPast && 'opacity-75'
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="outline"
                          className={cn('text-xs', eventTypeColors[event.event_type])}
                        >
                          {eventTypeLabels[event.event_type]}
                        </Badge>
                        {isPast && (
                          <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-300">
                            Past Event
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingEvent(event)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{format(startDate, 'EEEE, MMMM d, yyyy')}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                      </span>
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>
                        {event.applies_to_men && event.applies_to_women
                          ? 'All Teams'
                          : event.applies_to_men
                          ? 'Men\'s Team'
                          : 'Women\'s Team'}
                        {' • '}
                        {event.applies_to_jv && event.applies_to_varsity
                          ? 'JV & Varsity'
                          : event.applies_to_jv
                          ? 'JV'
                          : 'Varsity'}
                      </span>
                    </div>
                  </div>

                  {event.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  {/* RSVP Summary */}
                  {summary && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">RSVP Summary</span>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => setViewingRsvpsEvent(event)}
                          className="text-xs"
                        >
                          View Details
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1 text-xs">
                          <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                          <span className="font-medium">{summary.going}</span>
                          <span className="text-gray-600">Going</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="inline-block w-2 h-2 bg-yellow-600 rounded-full"></span>
                          <span className="font-medium">{summary.maybe}</span>
                          <span className="text-gray-600">Maybe</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                          <span className="font-medium">{summary.not_going}</span>
                          <span className="text-gray-600">Not Going</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="inline-block w-2 h-2 bg-gray-600 rounded-full"></span>
                          <span className="font-medium">{summary.no_response}</span>
                          <span className="text-gray-600">No Response</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {summary.total_users} eligible {summary.total_users === 1 ? 'person' : 'people'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialogs */}
      <CreateEventDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onEventCreated={loadEvents}
      />

      <EditEventDialog
        event={editingEvent}
        open={!!editingEvent}
        onOpenChange={(open) => !open && setEditingEvent(null)}
        onEventUpdated={loadEvents}
        onEventDeleted={loadEvents}
      />

      <EventRsvpList
        event={viewingRsvpsEvent}
        open={!!viewingRsvpsEvent}
        onOpenChange={(open) => !open && setViewingRsvpsEvent(null)}
      />
    </div>
  );
}
