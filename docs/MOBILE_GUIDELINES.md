# Mobile-First Development Guidelines

## Overview

This application is designed with a **mobile-first** approach, prioritizing touch interactions and small screen experiences before scaling up to desktop displays.

## Design Principles

### 1. Touch-First Interactions
- All interactions must work without hover states
- Minimum touch target size: **44x44px** (iOS Human Interface Guidelines)
- Active states provide immediate visual feedback
- Long-press gestures for secondary actions
- Swipe gestures for navigation and dismissal

### 2. Progressive Enhancement
- Start with mobile layout (320px width)
- Add features as screen size increases
- Never hide critical functionality on mobile
- Desktop enhancements should be additive, not subtractive

### 3. Performance
- Time to Interactive < 3 seconds on 3G
- First Contentful Paint < 1.5 seconds
- Optimize for low-end devices (4GB RAM, mid-tier CPU)
- Minimize JavaScript bundle size

## Breakpoint Strategy

### Tailwind CSS Breakpoints
```typescript
const breakpoints = {
  xs: '320px',   // Small phones (iPhone SE)
  sm: '640px',   // Large phones (iPhone 14)
  md: '768px',   // Tablets (iPad Mini)
  lg: '1024px',  // Desktop/Laptop
  xl: '1280px',  // Large Desktop
  '2xl': '1536px' // Ultra-wide
};
```

### Usage Pattern
```tsx
// ✅ Correct: Mobile-first (default styles for mobile)
<div className="text-sm md:text-base lg:text-lg">

// ❌ Wrong: Desktop-first (requires overriding for mobile)
<div className="text-lg sm:text-base md:text-sm">
```

### Component Responsive Patterns
```tsx
// Navigation: Bottom tabs on mobile, sidebar on desktop
<nav className="fixed bottom-0 left-0 right-0 lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-64">

// Cards: Stack on mobile, grid on desktop
<div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">

// Dialogs: Full-screen on mobile, centered on desktop
<Dialog className="fixed inset-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2">
```

## Touch Target Guidelines

### Minimum Sizes
- **Buttons**: 44x44px (iOS), 48x48px (Android Material Design)
- **Links**: 44x44px with padding
- **Form Inputs**: Height 44px minimum
- **Checkboxes/Radio**: 24x24px visible, 44x44px touch area
- **Icons**: 24x24px visible, 44x44px padding

### Implementation
```tsx
// ✅ Correct: Adequate touch padding
<button className="p-3 min-h-[44px] min-w-[44px]">
  <Icon className="h-5 w-5" />
</button>

// ❌ Wrong: Too small touch target
<button className="p-1">
  <Icon className="h-4 w-4" />
</button>

// ✅ Correct: Increase hit area without affecting visual size
<button className="relative">
  <span className="absolute inset-0 -m-2" /> {/* Expands hit area */}
  <Icon className="h-5 w-5" />
</button>
```

## Typography

### Responsive Font Sizes
```tsx
// Use fluid typography with Tailwind
const typography = {
  h1: "text-2xl sm:text-3xl lg:text-4xl",
  h2: "text-xl sm:text-2xl lg:text-3xl",
  h3: "text-lg sm:text-xl lg:text-2xl",
  body: "text-sm sm:text-base",
  small: "text-xs sm:text-sm",
};
```

### Readability Guidelines
- **Body text minimum**: 16px (prevents iOS zoom-in)
- **Line height**: 1.5-1.7 for body text
- **Line length**: 45-75 characters optimal
- **Paragraph spacing**: 1em between paragraphs

### Input Font Sizes
```tsx
// ✅ Correct: Prevents iOS zoom on focus
<input className="text-base" /> // 16px minimum

// ❌ Wrong: iOS zooms in on focus
<input className="text-sm" /> // < 16px triggers zoom
```

## Layout Patterns

### Navigation

#### Mobile (< 1024px)
```tsx
// Top bar: Logo + Hamburger
<header className="sticky top-0 z-50 flex items-center justify-between p-4 lg:hidden">
  <Logo />
  <HamburgerMenu />
</header>

// Bottom navigation: Primary 5 tabs
<nav className="fixed bottom-0 left-0 right-0 border-t bg-background lg:hidden">
  <ul className="flex justify-around">
    {primaryRoutes.slice(0, 5).map(route => (
      <li key={route.href}>
        <Link className="flex flex-col items-center p-2 min-h-[56px]">
          <Icon className="h-6 w-6" />
          <span className="text-xs mt-1">{route.label}</span>
        </Link>
      </li>
    ))}
  </ul>
</nav>
```

#### Desktop (≥ 1024px)
```tsx
// Left sidebar: Always visible
<aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
  <nav>
    <ul className="space-y-1">
      {allRoutes.map(route => (
        <li key={route.href}>
          <Link className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent">
            <Icon className="h-5 w-5" />
            <span>{route.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
</aside>

<main className="lg:pl-64">{children}</main>
```

### Content Spacing
```tsx
// Consistent padding system
const spacing = {
  mobile: "p-4",         // 16px
  tablet: "md:p-6",      // 24px
  desktop: "lg:p-8",     // 32px
};

// Vertical rhythm
const verticalSpacing = {
  tight: "space-y-2",    // 8px
  normal: "space-y-4",   // 16px
  relaxed: "space-y-6",  // 24px
  loose: "space-y-8",    // 32px
};
```

### Forms

#### Mobile Form Layout
```tsx
<form className="space-y-4">
  {/* Full-width inputs on mobile */}
  <div className="space-y-2">
    <Label htmlFor="name" className="text-sm font-medium">
      Name
    </Label>
    <Input
      id="name"
      type="text"
      className="w-full min-h-[44px] text-base"
      placeholder="Enter your name"
    />
  </div>

  {/* Stacked buttons on mobile, inline on desktop */}
  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
    <Button variant="outline" className="w-full sm:w-auto">
      Cancel
    </Button>
    <Button type="submit" className="w-full sm:w-auto">
      Submit
    </Button>
  </div>
</form>
```

#### Input Best Practices
```tsx
// ✅ Correct input types (optimizes mobile keyboard)
<input type="tel" />       // Shows numeric keyboard
<input type="email" />     // Shows email keyboard (@, .com)
<input type="url" />       // Shows URL keyboard (/, .com)
<input type="number" />    // Shows numeric keyboard
<input type="date" />      // Shows date picker

// ✅ Use autocomplete attributes
<input
  type="email"
  autoComplete="email"
  inputMode="email"
/>

// ✅ Disable autocorrect for codes/usernames
<input
  type="text"
  autoComplete="username"
  autoCapitalize="none"
  autoCorrect="off"
  spellCheck="false"
/>
```

## Touch Gestures

### Swipe Gestures
```tsx
// Swipe to delete (iOS Mail pattern)
<div className="relative overflow-hidden">
  <motion.div
    drag="x"
    dragConstraints={{ left: -100, right: 0 }}
    onDragEnd={(e, info) => {
      if (info.offset.x < -80) {
        handleDelete();
      }
    }}
  >
    <EventCard />
  </motion.div>
  <div className="absolute right-0 top-0 bottom-0 flex items-center bg-red-500 px-4">
    <Trash2 className="h-5 w-5 text-white" />
  </div>
</div>
```

### Pull to Refresh
```tsx
// Implement pull-to-refresh pattern
const [refreshing, setRefreshing] = useState(false);

const handleRefresh = async () => {
  setRefreshing(true);
  await refetch();
  setRefreshing(false);
};

<div
  className="touch-pan-y overscroll-contain"
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleRefresh}
>
  {refreshing && <RefreshIndicator />}
  <EventList />
</div>
```

### Long Press
```tsx
// Long press for context menu (Android pattern)
const [showMenu, setShowMenu] = useState(false);
let pressTimer: NodeJS.Timeout;

<div
  onTouchStart={() => {
    pressTimer = setTimeout(() => {
      setShowMenu(true);
    }, 500); // 500ms long press threshold
  }}
  onTouchEnd={() => {
    clearTimeout(pressTimer);
  }}
  onTouchMove={() => {
    clearTimeout(pressTimer);
  }}
>
  <EventCard />
</div>
```

## Dialogs and Modals

### Mobile Pattern: Full-Screen
```tsx
<Dialog>
  <DialogContent className="fixed inset-0 sm:inset-auto sm:max-w-lg sm:rounded-lg">
    {/* Full screen on mobile, centered modal on desktop */}
    <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
      <DialogTitle>Edit Event</DialogTitle>
    </DialogHeader>
    <DialogBody className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
      {/* Scrollable content */}
    </DialogBody>
    <DialogFooter className="sticky bottom-0 border-t bg-background p-4 sm:px-6">
      {/* Sticky footer buttons */}
      <Button className="w-full sm:w-auto">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Bottom Sheets (Mobile Native Pattern)
```tsx
// Slide up from bottom (iOS/Android pattern)
<Sheet>
  <SheetContent side="bottom" className="h-[90vh] rounded-t-xl">
    <SheetHeader>
      {/* Drag handle */}
      <div className="mx-auto h-1 w-12 rounded-full bg-muted" />
      <SheetTitle>Select Date</SheetTitle>
    </SheetHeader>
    <SheetBody className="overflow-y-auto">
      <Calendar />
    </SheetBody>
  </SheetContent>
</Sheet>
```

## Performance Optimization

### Image Optimization
```tsx
// Use Next.js Image with responsive sizes
<Image
  src="/avatar.jpg"
  alt="User avatar"
  width={40}
  height={40}
  sizes="(max-width: 640px) 40px, 48px"
  className="rounded-full"
/>
```

### Lazy Loading
```tsx
// Lazy load below-the-fold content
import dynamic from 'next/dynamic';

const EventList = dynamic(() => import('./event-list'), {
  loading: () => <EventListSkeleton />,
  ssr: false, // Don't render on server if not needed
});
```

### Virtualization
```tsx
// For long lists (>100 items), use virtualization
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: events.length,
  getScrollElement: () => scrollRef.current,
  estimateSize: () => 100, // Estimated row height
});

<div ref={scrollRef} className="h-screen overflow-y-auto">
  <div style={{ height: virtualizer.getTotalSize() }}>
    {virtualizer.getVirtualItems().map(virtualRow => (
      <EventCard key={virtualRow.key} event={events[virtualRow.index]} />
    ))}
  </div>
</div>
```

## Accessibility on Mobile

### Focus Management
```tsx
// Trap focus in mobile dialogs
import { useFocusTrap } from '@/lib/hooks/use-focus-trap';

const dialogRef = useFocusTrap();

<Dialog>
  <DialogContent ref={dialogRef}>
    {/* Focus trapped within dialog */}
  </DialogContent>
</Dialog>
```

### Screen Reader Announcements
```tsx
// Announce dynamic updates
import { useLiveRegion } from '@/lib/hooks/use-live-region';

const announce = useLiveRegion();

const handleDelete = async () => {
  await deleteEvent();
  announce('Event deleted successfully');
};

// Rendered live region
<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  {message}
</div>
```

### Touch Zoom Prevention
```tsx
// In app/layout.tsx
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Prevents pinch zoom (use sparingly)
  userScalable: false, // Only if you have accessible font controls
};
```

## Testing Guidelines

### Mobile Testing Checklist
- [ ] Test on physical devices (iOS Safari, Android Chrome)
- [ ] Test in Chrome DevTools device mode (multiple viewports)
- [ ] Test touch interactions (tap, swipe, long-press)
- [ ] Test with slow 3G network throttling
- [ ] Test landscape orientation
- [ ] Test with browser bottom bar visible/hidden (iOS Safari)
- [ ] Test form input keyboard appearance
- [ ] Test with system font sizes increased (accessibility)
- [ ] Test with VoiceOver (iOS) or TalkBack (Android)

### Key Test Scenarios
1. **Navigation**: Bottom tabs work, hamburger menu opens
2. **Forms**: All inputs keyboard-accessible, zoom doesn't trigger
3. **Dialogs**: Open/close smoothly, scrollable on small screens
4. **Lists**: Scrolling is smooth, no jank
5. **Buttons**: All buttons are tappable (44x44px)
6. **Gestures**: Swipe gestures work without conflicts

### Browser-Specific Issues
```tsx
// iOS Safari: 100vh includes browser chrome (incorrect)
// Solution: Use dvh (dynamic viewport height) or JS
<div className="h-[100dvh] lg:h-screen">

// iOS Safari: Position fixed with keyboard
// Solution: Use position absolute on parent
<div className="relative">
  <button className="absolute bottom-0">Submit</button>
</div>

// Android Chrome: Pull-to-refresh conflicts
// Solution: Disable overscroll behavior
<body className="overscroll-none">
```

## Component Library Mobile Standards

### All Components Must Have:
1. **Responsive props**: `size="sm" md:size="base" lg:size="lg"`
2. **Touch padding**: Minimum 44x44px active area
3. **Mobile variant**: Full-width buttons on mobile
4. **Keyboard support**: Tab navigation, Enter/Space activation
5. **Focus visible**: Outline or ring on focus
6. **Loading states**: Skeleton or spinner
7. **Error states**: Clear error messages
8. **Empty states**: Helpful guidance when no data

### Example Mobile-Optimized Component
```tsx
interface ButtonProps {
  size?: 'sm' | 'md' | 'lg';
  fullWidthOnMobile?: boolean;
  children: React.ReactNode;
}

export function Button({
  size = 'md',
  fullWidthOnMobile = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-colors focus-visible:outline-none focus-visible:ring-2',

        // Touch optimization
        'active:scale-95 touch-manipulation',

        // Sizes with mobile-first approach
        size === 'sm' && 'h-9 px-3 text-sm',
        size === 'md' && 'h-11 px-4 text-base', // 44px minimum
        size === 'lg' && 'h-12 px-6 text-lg',

        // Responsive width
        fullWidthOnMobile && 'w-full sm:w-auto'
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

## Resources

- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios)
- [Material Design - Touch Targets](https://m2.material.io/design/usability/accessibility.html#layout-and-typography)
- [MDN - Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [Web.dev - Mobile Performance](https://web.dev/mobile/)
- [Can I Use - Mobile Browser Support](https://caniuse.com/)
