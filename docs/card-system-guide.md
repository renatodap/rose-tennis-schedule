# Card Component System - $100M Design System

## Overview

The Card component system is a comprehensive, premium content container system designed for the Rose-Hulman Tennis Team app. Built with mobile-first principles, it provides elegant, informative, and touchable cards with multiple variants and interactive states.

## Features

- ✨ **6 Visual Variants**: default, elevated, outlined, filled, glass, interactive
- 📱 **Mobile-First**: Full-width cards on mobile, responsive grid on desktop
- 🎨 **Interactive States**: Hover lift, press feedback, selected states
- ⚡ **Micro-Interactions**: Smooth transitions (200ms) with athletic easing
- 🎯 **Positioned Badges**: Status indicators for events, matches
- 🖼️ **Media Support**: Image/video areas with aspect ratio control
- ⏳ **Loading States**: Skeleton loading component
- 🌓 **Dark Mode**: Full dark mode support

## Components

### Card (Main Container)

The primary card container with variant support.

```tsx
import { Card } from '@/components/ui/card';

// Basic card
<Card>Content goes here</Card>

// With variant
<Card variant="elevated">Premium elevated card</Card>

// Interactive card with hover effects
<Card variant="interactive" onClick={handleClick}>
  Clickable card
</Card>

// Selected state
<Card selected>Selected card with ring</Card>

// Loading state
<Card loading>Loading content...</Card>
```

#### Card Variants

**default** - Subtle border, light shadow (standard)
```tsx
<Card variant="default">Standard content container</Card>
```

**elevated** - Raised with shadow, premium feel
```tsx
<Card variant="elevated">Premium raised card</Card>
```

**outlined** - Border-only, minimal and clean
```tsx
<Card variant="outlined">Minimal bordered card</Card>
```

**filled** - Solid background for emphasis
```tsx
<Card variant="filled">Emphasized content</Card>
```

**glass** - Subtle blur/transparency for overlays
```tsx
<Card variant="glass">Glass morphism effect</Card>
```

**interactive** - Hover effects, cursor pointer
```tsx
<Card variant="interactive" onClick={handleClick}>
  Clickable with hover lift
</Card>
```

#### Card Sizes

```tsx
<Card size="sm">Compact card</Card>
<Card size="default">Standard card</Card>
<Card size="lg">Spacious card</Card>
```

### CardHeader

Title area with optional actions.

```tsx
<CardHeader>
  <CardTitle>Event Title</CardTitle>
  <CardDescription>Secondary information</CardDescription>
</CardHeader>
```

### CardTitle

Primary heading with responsive typography.

```tsx
<CardTitle>Team Practice</CardTitle>
// text-lg on mobile, text-xl on desktop
```

### CardDescription

Secondary text with muted color.

```tsx
<CardDescription>Indoor Courts, 4:00 PM</CardDescription>
```

### CardContent

Main body area with generous spacing.

```tsx
<CardContent>
  <p>Your main content here</p>
  <p>Automatic vertical rhythm (space-y-4)</p>
</CardContent>
```

### CardFooter

Actions area with proper alignment.

```tsx
<CardFooter>
  <Button>RSVP</Button>
  <Button variant="outline">Details</Button>
</CardFooter>
```

### CardMedia

Image/video area with aspect ratio support.

```tsx
// With image
<CardMedia
  src="/images/event.jpg"
  alt="Event photo"
  aspectRatio="16/9"
/>

// With custom content
<CardMedia aspectRatio="square">
  <video src="/video.mp4" />
</CardMedia>
```

Aspect ratio options: `"16/9"` | `"4/3"` | `"1/1"` | `"video"` | `"square"`

### CardBadge

Positioned status indicators.

```tsx
<Card>
  <CardBadge variant="mandatory" position="top-right">
    Mandatory
  </CardBadge>
  <CardHeader>...</CardHeader>
</Card>
```

#### Badge Variants
- `mandatory` - Red (required events)
- `recommended` - Orange (suggested events)
- `optional` - Green (optional events)
- `match` - Maroon (tennis matches)
- `default` - Neutral gray

#### Badge Positions
- `top-left`
- `top-right` (default)
- `bottom-left`
- `bottom-right`

### CardSkeleton

Loading skeleton for card content.

```tsx
<CardSkeleton
  showHeader={true}
  showMedia={false}
  showFooter={true}
  lines={3}
/>
```

## Usage Examples

### Event Card Pattern

```tsx
<Card variant="interactive" className="group">
  <CardBadge variant="mandatory">Mandatory</CardBadge>

  <CardHeader>
    <CardTitle>Team Practice</CardTitle>
    <CardDescription>Indoor Courts</CardDescription>
  </CardHeader>

  <CardContent>
    <div className="flex items-center gap-2 text-sm text-neutral-600">
      <Calendar className="h-4 w-4" />
      <span>Friday, Dec 6 at 4:00 PM</span>
    </div>
  </CardContent>

  <CardFooter>
    <Button>RSVP</Button>
  </CardFooter>
</Card>
```

### Match Card Pattern

```tsx
<Card variant="elevated">
  <CardBadge variant="match" position="top-left">Match</CardBadge>

  <CardContent className="text-center">
    <div className="flex items-center justify-between">
      <div>
        <p className="font-bold text-lg">Rose-Hulman</p>
        <p className="text-4xl font-bold text-maroon-700">6</p>
      </div>
      <div className="text-neutral-400">VS</div>
      <div>
        <p className="font-bold text-lg">Opponents</p>
        <p className="text-4xl font-bold">2</p>
      </div>
    </div>
  </CardContent>

  <CardFooter className="justify-center">
    <span className="text-sm text-neutral-600">Saturday, 2:00 PM</span>
  </CardFooter>
</Card>
```

### Stat Card Pattern

```tsx
<Card variant="filled" className="text-center">
  <CardContent className="py-8">
    <div className="flex flex-col items-center gap-2">
      <Trophy className="h-8 w-8 text-maroon-700" />
      <span className="text-4xl font-bold text-maroon-700">12</span>
      <span className="text-sm text-neutral-600">Upcoming Events</span>
    </div>
  </CardContent>
</Card>
```

### Profile Card Pattern

```tsx
<Card variant="outlined">
  <CardMedia
    aspectRatio="square"
    src="/avatars/player.jpg"
    alt="Player profile"
  />

  <CardHeader className="text-center">
    <CardTitle>John Doe</CardTitle>
    <CardDescription>Team Captain</CardDescription>
  </CardHeader>

  <CardContent>
    <div className="grid grid-cols-2 gap-4 text-center">
      <div>
        <p className="text-2xl font-bold text-maroon-700">24</p>
        <p className="text-xs text-neutral-600">Matches Played</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-maroon-700">18</p>
        <p className="text-xs text-neutral-600">Wins</p>
      </div>
    </div>
  </CardContent>
</Card>
```

### Loading State

```tsx
// Show skeleton while loading
{loading ? (
  <CardSkeleton showMedia lines={4} />
) : (
  <Card>
    <CardHeader>
      <CardTitle>Loaded Content</CardTitle>
    </CardHeader>
    <CardContent>Real data here</CardContent>
  </Card>
)}
```

### Grid Layout (Responsive)

```tsx
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  <Card variant="elevated">Card 1</Card>
  <Card variant="elevated">Card 2</Card>
  <Card variant="elevated">Card 3</Card>
</div>
```

## Interactive States

### Hover Effects

The `interactive` and `elevated` variants automatically include hover effects:
- Subtle lift (translateY -2px)
- Shadow increase
- Smooth 200ms transition

```tsx
<Card variant="interactive">
  {/* Automatically lifts on hover */}
</Card>
```

### Press Feedback

Interactive cards include press feedback:
- Scale to 0.99 on active state
- Shadow decrease (shadow-press)

### Selected State

```tsx
<Card selected>
  {/* Shows maroon ring and border */}
</Card>
```

## Responsive Behavior

Cards are mobile-first and automatically responsive:

- **Mobile (< 640px)**: Full-width, stacked layout
- **Tablet (640px+)**: 2-column grid
- **Desktop (1024px+)**: Flexible grid with max-width constraints

## Design Principles

1. **Visual Hierarchy** - Eye flows naturally from most to least important
2. **Generous Spacing** - Content breathes, never cramped (space-y-4)
3. **Subtle Depth** - Shadows create layering without heaviness
4. **Clear Boundaries** - Cards are distinct containers
5. **Interactive Cues** - Clickable cards show clear affordance

## Accessibility

- Proper semantic HTML (heading hierarchy)
- Focus states on interactive cards
- Color contrast meets WCAG AA standards
- Dark mode support included

## Performance

- Uses Framer Motion for smooth animations
- CSS-based transitions for most effects
- Optimized for mobile devices
- Minimal JavaScript overhead

## Dark Mode

All card variants support dark mode automatically:

```tsx
<Card variant="default">
  {/* Automatically uses dark mode styles when enabled */}
</Card>
```

Dark mode styles:
- Inverted colors for backgrounds and borders
- Adjusted shadow values
- Maintained contrast ratios
- Badge color adaptations

## Migration from Old Card

The new card system is backward compatible with the old card component. Simply add variants where needed:

```tsx
// Old (still works)
<Card>Content</Card>

// New (enhanced)
<Card variant="elevated">Content</Card>
```

## Custom Styling

Override styles with className:

```tsx
<Card
  variant="elevated"
  className="border-maroon-700 hover:border-maroon-900"
>
  Custom styled card
</Card>
```

## Animation Details

- **Transition duration**: 200ms (snappy, athletic)
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1) - fast out, slow in
- **Hover lift**: -2px translateY
- **Press scale**: 0.99

## Best Practices

1. Use `interactive` variant for clickable cards
2. Use `elevated` for important content
3. Use `outlined` for subtle emphasis
4. Always include CardBadge for event types
5. Use CardSkeleton during loading states
6. Keep card content focused and scannable
7. Use CardMedia for visual hierarchy
8. Group related actions in CardFooter

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization Tips

1. Use CardSkeleton for perceived performance
2. Lazy load CardMedia images
3. Limit animations on low-end devices
4. Use CSS transforms for better performance
5. Avoid excessive nesting

---

**Version**: 1.0.0
**Last Updated**: December 2024
**Design System**: $100M Rose-Hulman Tennis Team App
