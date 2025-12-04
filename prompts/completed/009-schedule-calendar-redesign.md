<objective>
Redesign the Schedule page and calendar components to be intuitive and gorgeous.
Scheduling is complex - classes, availability, blockers - but the UI must be simple.
The calendar should feel premium like Fantastical or Google Calendar.
</objective>

<context>
Tennis team app with Bold Athletic design direction.
Schedule includes: Class schedules, availability windows, blockers (one-time and recurring).

@app/(dashboard)/schedule/page.tsx - Schedule page
@components/calendar/WeekView.tsx - Week calendar view
@components/calendar/DayView.tsx - Day view
@components/calendar/TimeSlotSelector.tsx - Time slot picker
@components/calendar/QuarterSelector.tsx - Quarter picker
@components/schedule/ClassScheduleBlock.tsx - Class block
@components/availability/AvailabilityCalendar.tsx - Availability view
@lib/design-tokens.ts - Design tokens
</context>

<design_principles>
Premium calendar experience:
1. OVERVIEW FIRST - See the week at a glance
2. ZOOM IN - Tap for day details
3. DRAG & DROP - Easy time selection (optional)
4. COLOR CODED - Item types instantly recognizable
5. RESPONSIVE - Works beautifully on phones
</design_principles>

<requirements>
1. SCHEDULE PAGE LAYOUT:
   - View toggles: Week, Day, List
   - Quarter/period selector
   - Current week highlighted
   - Navigation: Previous/Next week arrows
   - "Today" quick button
   - Add item floating action button

2. WEEK VIEW REDESIGN:
   - 7 columns (or 5 for weekdays only)
   - Time axis on left (6 AM - 10 PM)
   - Colored blocks for different item types:
     - Classes: Brand maroon
     - Availability: Green
     - Blockers: Orange/red
     - Events: Blue
   - Current time indicator (red line)
   - Tap block to edit/view

3. DAY VIEW REDESIGN:
   - Larger, more detailed view
   - Hour-by-hour grid
   - Item details visible on blocks
   - Swipe between days
   - Add time slot by tapping empty area

4. MOBILE CALENDAR CONSIDERATIONS:
   - Week view: Show abbreviated (M/T/W)
   - Horizontal scroll if needed
   - Day view as primary on mobile
   - Bottom sheet for adding items
   - Touch-friendly time selection

5. TIME SLOT SELECTOR:
   - Start/end time pickers
   - Duration indicator
   - Conflict detection (visual warning)
   - Preset durations (30m, 1h, 2h)

6. ITEM BLOCKS:
   - Color bar on left indicating type
   - Title visible
   - Time range
   - Location (if space)
   - Subtle shadow for elevation

7. EMPTY STATE:
   - Encouraging message when no items
   - Quick add suggestions
</requirements>

<implementation>
Redesign schedule and calendar components:
- Mobile-first approach
- Use new atomic components
- Framer Motion for day transitions
- Proper time handling with date-fns-tz
- Touch-friendly interactions
</implementation>

<output>
Modify:
- `./app/(dashboard)/schedule/page.tsx`
- `./components/calendar/WeekView.tsx`
- `./components/calendar/DayView.tsx`
- `./components/calendar/TimeSlotSelector.tsx`
- `./components/calendar/QuarterSelector.tsx`
- `./components/schedule/ClassScheduleBlock.tsx`
- `./components/availability/AvailabilityCalendar.tsx`
Create:
- `./components/calendar/CalendarHeader.tsx`
- `./components/calendar/TimeBlock.tsx`
- `./components/calendar/CurrentTimeIndicator.tsx`
</output>

<examples>
```tsx
// Week view with blocks
<WeekView
  startDate={weekStart}
  items={scheduleItems}
  onItemClick={handleItemClick}
  onSlotClick={handleAddItem}
/>

// Time block component
<TimeBlock
  type="class"
  title="CSSE 232"
  startTime="10:00"
  endTime="10:50"
  location="O257"
/>

// Calendar header with navigation
<CalendarHeader
  currentDate={currentDate}
  view="week"
  onViewChange={setView}
  onNavigate={handleNavigate}
  onToday={goToToday}
/>
```
</examples>

<verification>
Before declaring complete:
- Calendar is readable on 375px screen
- Time blocks don't overlap incorrectly
- Current time indicator updates
- Navigation between weeks is smooth
- Touch targets are generous
- Colors are distinguishable (including for colorblind users)
</verification>
