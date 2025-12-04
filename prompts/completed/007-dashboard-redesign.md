<objective>
Transform the dashboard into a stunning, informative, and action-oriented home screen.
This is the first thing users see - it must impress and immediately provide value.
Mobile-first: The dashboard should be perfect on a phone.
</objective>

<context>
Tennis team app with Bold Athletic design direction.
Dashboard currently shows: Welcome message, pending forms count, quick actions.
Users: Tennis players, team captains, coaches.

@app/(dashboard)/dashboard/page.tsx - Current dashboard
@components/dashboard/QuickActionsCard.tsx - Quick actions component
@lib/design-tokens.ts - Design tokens

Key user needs from dashboard:
- What's happening today/soon?
- Any actions I need to take?
- My current status/standing
- Quick access to common tasks
</context>

<design_principles>
Premium dashboard characteristics:
1. GLANCEABLE - Key info visible in 2 seconds
2. ACTIONABLE - Clear next steps
3. PERSONALIZED - Feels tailored to the user
4. DYNAMIC - Updates with real-time data
5. HIERARCHY - Most important info is most prominent
</design_principles>

<requirements>
1. HERO SECTION (Top):
   - Personalized greeting with time of day (Good morning/afternoon/evening)
   - Today's date prominently displayed
   - Current weather/conditions (optional enhancement)
   - User's next upcoming event/match preview

2. QUICK STATS ROW:
   - 2-3 key metrics in attractive stat cards
   - Pending forms count (with call to action if > 0)
   - Upcoming events this week
   - Your response rate or participation
   - Subtle icons, bold numbers, muted labels

3. TODAY'S SCHEDULE:
   - Timeline view of today's events/classes
   - Visual distinction between event types
   - Empty state: "Nothing scheduled today" with encouragement
   - Tap to see details

4. UPCOMING EVENTS PREVIEW:
   - Next 3-5 events with RSVP status
   - Compact card layout
   - Quick RSVP actions inline
   - "View all" link to events page

5. QUICK ACTIONS:
   - Large, tappable action buttons
   - Add class, Mark availability, View schedule
   - Icons with labels
   - Grid layout on mobile (2x2)

6. ALERT BANNER (Conditional):
   - If mandatory event needs RSVP: Prominent alert
   - If forms pending: Notification banner
   - Dismissible but persistent if important

7. MOBILE CONSIDERATIONS:
   - Single column layout
   - Swipeable sections (optional)
   - Pull-to-refresh
   - Skeleton loading states
</requirements>

<implementation>
Redesign `app/(dashboard)/dashboard/page.tsx`:
- Mobile-first layout
- Use new Card, Button, Badge components
- Framer Motion for section animations
- Real data integration
- Loading/empty states

Create supporting components:
- StatCard for metrics
- TodayTimeline for schedule
- UpcomingEventsList for events preview
- QuickActions grid
</implementation>

<output>
Modify: `./app/(dashboard)/dashboard/page.tsx`
Modify: `./components/dashboard/QuickActionsCard.tsx`
Create:
- `./components/dashboard/StatCard.tsx`
- `./components/dashboard/TodayTimeline.tsx`
- `./components/dashboard/UpcomingEventsList.tsx`
- `./components/dashboard/AlertBanner.tsx`
</output>

<examples>
```tsx
// Stat card
<StatCard
  icon={<Calendar />}
  value={5}
  label="Events this week"
  trend="+2 from last week"
/>

// Today timeline
<TodayTimeline
  events={todayEvents}
  emptyMessage="Your schedule is clear today"
/>

// Alert banner
<AlertBanner variant="warning">
  You haven't RSVPd to the mandatory team meeting tomorrow
  <Button size="sm">RSVP Now</Button>
</AlertBanner>
```
</examples>

<verification>
Before declaring complete:
- Dashboard loads in under 2 seconds
- Key information visible without scrolling
- All cards use consistent styling
- Empty states are friendly, not sad
- Loading skeletons match content layout
- Works beautifully on 375px (iPhone SE)
</verification>
