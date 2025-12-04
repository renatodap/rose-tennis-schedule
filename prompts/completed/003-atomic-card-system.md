<objective>
Create a stunning Card component system - the primary content container for this app.
Cards display events, matches, schedules, forms. They must be elegant, informative, and touchable.
Mobile-first: cards should feel native, swipeable-ready, thumb-friendly.
</objective>

<context>
Tennis team app with Bold Athletic design direction.
Cards are used for: Events, Matches, Forms, User profiles, Stats, Quick actions.

@components/ui/card.tsx - Current basic card
@components/events/EventCard.tsx - Example of card usage
@lib/design-tokens.ts - Design tokens

Mobile considerations:
- Full-width cards on mobile
- Clear visual hierarchy within limited space
- Touch-friendly interactive areas
</context>

<design_principles>
Premium card characteristics:
1. VISUAL HIERARCHY - Eye flows naturally from most to least important
2. GENEROUS SPACING - Content breathes, never cramped
3. SUBTLE DEPTH - Shadows create layering without heaviness
4. CLEAR BOUNDARIES - Cards are distinct containers
5. INTERACTIVE CUES - Clickable cards show affordance
</design_principles>

<requirements>
Create a comprehensive card system:

1. BASE CARD VARIANTS:
   - default: Standard content container, subtle border
   - elevated: Raised with shadow, interactive feel
   - outlined: Border-only, minimal
   - filled: Solid background, for emphasis
   - glass: Subtle blur/transparency (for overlays)
   - interactive: Hover effects, cursor pointer

2. CARD ANATOMY COMPONENTS:
   - Card: Container with variants
   - CardHeader: Title area with optional actions
   - CardTitle: Primary text, proper typography
   - CardDescription: Secondary text, muted
   - CardContent: Main body area
   - CardFooter: Actions area, proper alignment
   - CardMedia: Image/video area with aspect ratios
   - CardBadge: Status indicators (positioned)

3. SPECIALIZED CARD PATTERNS:
   - EventCard layout: badge + title + meta + actions
   - MatchCard layout: teams + score + date
   - StatCard layout: icon + value + label
   - ActionCard layout: icon + title + description

4. RESPONSIVE BEHAVIOR:
   - Mobile: Full-width, stacked layout
   - Tablet: 2-column grid
   - Desktop: Flexible grid, max-width constraints

5. INTERACTIVE STATES:
   - Hover: Subtle lift, shadow increase
   - Active/pressed: Slight depression
   - Selected: Border/background highlight
   - Loading: Skeleton state

6. MICRO-INTERACTIONS:
   - Hover lift (translateY -2px, shadow increase)
   - Press feedback (scale 0.99)
   - Smooth transitions (200ms)
</requirements>

<implementation>
1. Modify `components/ui/card.tsx`:
   - Add variants using CVA
   - Add interactive states
   - Add Framer Motion for animations
   - Proper TypeScript typing for all props
   - CardMedia component with aspect ratio support
   - CardBadge for positioned indicators

2. Create card composition examples/patterns
</implementation>

<output>
Modify: `./components/ui/card.tsx`
</output>

<examples>
```tsx
// Interactive event card
<Card variant="interactive" className="group">
  <CardBadge variant="mandatory">Mandatory</CardBadge>
  <CardHeader>
    <CardTitle>Team Practice</CardTitle>
    <CardDescription>Indoor Courts</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Friday, Dec 6 at 4:00 PM</p>
  </CardContent>
  <CardFooter>
    <Button>RSVP</Button>
  </CardFooter>
</Card>

// Stat card
<Card variant="filled">
  <CardContent className="text-center">
    <span className="text-4xl font-bold">12</span>
    <span className="text-muted-foreground">Upcoming Events</span>
  </CardContent>
</Card>
```
</examples>

<verification>
Before declaring complete:
- Cards look premium at all breakpoints
- Interactive cards have clear hover states
- Content hierarchy is obvious
- Spacing is consistent and generous
- Works in both light/dark contexts
- No content overflow issues
</verification>
