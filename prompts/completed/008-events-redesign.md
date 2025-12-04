<objective>
Transform the Events page and EventCard into a stunning, functional experience.
Events are core to this app - practices, matches, team activities.
The RSVP flow must be seamless and satisfying.
</objective>

<context>
Tennis team app with Bold Athletic design direction.
Events have types: mandatory, recommended, optional, match.
RSVP statuses: going, maybe, not_going, no_response.

@app/(dashboard)/events/page.tsx - Events page
@components/events/EventCard.tsx - Event card component
@components/events/RsvpButtons.tsx - RSVP button group
@components/events/EventDetailsDialog.tsx - Event details modal
@components/events/CompactEventList.tsx - Compact list view
@components/events/MobileRsvpZones.tsx - Mobile RSVP
@lib/design-tokens.ts - Design tokens
</context>

<design_principles>
Premium events experience:
1. SCANNABLE - See what's coming at a glance
2. URGENCY CLEAR - Mandatory events stand out
3. ONE-TAP RSVP - Responding is effortless
4. FEEDBACK RICH - Your response is confirmed visually
5. CONTEXTUAL - See who else is going
</design_principles>

<requirements>
1. EVENTS PAGE LAYOUT:
   - Filter tabs: All, Upcoming, Past, Needs RSVP
   - List view with date grouping (Today, Tomorrow, This Week, Later)
   - Floating action button to create event (admin only)
   - Pull-to-refresh on mobile
   - Search/filter capability

2. EVENT CARD REDESIGN:
   - Visual hierarchy: Type badge → Title → DateTime → Location
   - Mandatory events: Red left border or accent
   - Match events: Blue athletic styling
   - Compact but not cramped
   - Show attendee avatars (who's going)
   - Your RSVP status badge
   - Tap anywhere to see details

3. RSVP BUTTONS REDESIGN:
   - Three clear options: Going (green), Maybe (amber), Not Going (red)
   - Icon + text labels
   - Current selection is highlighted/filled
   - Instant visual feedback on tap
   - Loading state while saving
   - Success animation (subtle pulse or check)

4. EVENT DETAILS DIALOG:
   - Full event information
   - Description with markdown support
   - Map link for location
   - Attendee list with RSVP breakdown
   - Large RSVP buttons
   - Share/calendar options

5. MOBILE-SPECIFIC:
   - Swipe to RSVP (optional enhancement)
   - Bottom sheet for details instead of modal
   - Sticky filter tabs
   - Touch-optimized everything

6. EMPTY/LOADING STATES:
   - No events: Encouraging message with illustration
   - Loading: Skeleton cards
   - Error: Retry option
</requirements>

<implementation>
Redesign all event-related components:
- Use new atomic components (Card, Button, Badge, Avatar)
- Framer Motion for animations
- Mobile-first responsive design
- Proper TypeScript typing
</implementation>

<output>
Modify:
- `./app/(dashboard)/events/page.tsx`
- `./components/events/EventCard.tsx`
- `./components/events/RsvpButtons.tsx`
- `./components/events/EventDetailsDialog.tsx`
- `./components/events/CompactEventList.tsx`
- `./components/events/MobileRsvpZones.tsx`
Create:
- `./components/events/EventFilters.tsx`
- `./components/events/EventListSkeleton.tsx`
</output>

<examples>
```tsx
// Event card with new components
<Card variant="interactive" className={cn(
  event.type === 'mandatory' && 'border-l-4 border-l-red-500'
)}>
  <CardHeader>
    <Badge variant="danger" style="soft">Mandatory</Badge>
    <CardTitle>{event.title}</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex items-center gap-2 text-muted-foreground">
      <Calendar className="h-4 w-4" />
      <span>Tomorrow at 4:00 PM</span>
    </div>
    <AvatarGroup max={4} className="mt-3">
      {event.attendees.map(a => <Avatar key={a.id}>...</Avatar>)}
    </AvatarGroup>
  </CardContent>
  <CardFooter>
    <RsvpButtons eventId={event.id} currentResponse={event.userRsvp} />
  </CardFooter>
</Card>

// RSVP buttons
<div className="flex gap-2">
  <Button
    variant={response === 'going' ? 'success' : 'outline'}
    size="sm"
  >
    <Check className="h-4 w-4 mr-1" />
    Going
  </Button>
  <Button
    variant={response === 'maybe' ? 'warning' : 'outline'}
    size="sm"
  >
    <HelpCircle className="h-4 w-4 mr-1" />
    Maybe
  </Button>
  <Button
    variant={response === 'not_going' ? 'destructive' : 'outline'}
    size="sm"
  >
    <X className="h-4 w-4 mr-1" />
    Can't Go
  </Button>
</div>
```
</examples>

<verification>
Before declaring complete:
- Event types are immediately distinguishable
- RSVP buttons are large enough for thumbs (44px)
- Current RSVP status is unmistakable
- Card tap areas work correctly
- Filter tabs scroll properly on mobile
- Animations don't feel sluggish
</verification>
