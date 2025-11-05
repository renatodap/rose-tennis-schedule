# Component Development Guide

## Overview

This guide establishes standards for creating, documenting, and maintaining React components in the Rose-Hulman Tennis Schedule application.

## Component Structure

### File Organization
```
components/
├── ui/                          # Base UI components (shadcn/ui)
│   ├── button.tsx
│   ├── input.tsx
│   └── dialog.tsx
├── shared/                      # Shared composite components
│   ├── loading-state.tsx
│   ├── empty-state.tsx
│   └── error-boundary.tsx
└── [feature]/                   # Feature-specific components
    ├── event-card.tsx
    ├── event-list.tsx
    └── event-details-dialog.tsx
```

### File Naming
- **Components**: `kebab-case.tsx` (e.g., `event-card.tsx`)
- **One component per file** (except small related sub-components)
- **Index files**: Use for barrel exports only

### Component Template
```tsx
/**
 * ComponentName - Brief description of what this component does
 *
 * @example
 * ```tsx
 * <EventCard
 *   event={event}
 *   onRsvp={handleRsvp}
 * />
 * ```
 */

// 1. External imports
import { useState } from 'react';
import { format } from 'date-fns';

// 2. Internal imports (components)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 3. Internal imports (utilities)
import { cn } from '@/lib/utils';
import type { Event } from '@/lib/types';

// 4. Type definitions
interface EventCardProps {
  /**
   * The event to display
   */
  event: Event;

  /**
   * Callback when user RSVPs
   */
  onRsvp?: (response: 'going' | 'maybe' | 'not_going') => void;

  /**
   * Whether the card should be interactive
   * @default true
   */
  interactive?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

// 5. Component
export function EventCard({
  event,
  onRsvp,
  interactive = true,
  className,
}: EventCardProps) {
  // Hooks
  const [isExpanded, setIsExpanded] = useState(false);

  // Derived state
  const formattedDate = format(new Date(event.start_time), 'PPp');

  // Event handlers
  const handleRsvpClick = (response: 'going' | 'maybe' | 'not_going') => {
    onRsvp?.(response);
  };

  // Early returns
  if (!event) {
    return null;
  }

  // Render
  return (
    <Card className={cn('p-4', className)}>
      <h3 className="text-lg font-semibold">{event.title}</h3>
      <p className="text-sm text-muted-foreground">{formattedDate}</p>

      {interactive && (
        <div className="mt-4 flex gap-2">
          <Button onClick={() => handleRsvpClick('going')}>
            Going
          </Button>
          <Button variant="outline" onClick={() => handleRsvpClick('maybe')}>
            Maybe
          </Button>
        </div>
      )}
    </Card>
  );
}

// 6. Sub-components (if small and tightly coupled)
EventCard.Skeleton = function EventCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="h-6 w-48 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted" />
    </Card>
  );
};
```

## Component Types

### 1. Presentational Components
**Purpose**: Display data, no business logic

**Characteristics**:
- Receive all data via props
- No data fetching
- No side effects (except analytics)
- Can have local UI state (open/closed, selected item)

**Example**:
```tsx
interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

export function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{event.description}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onEdit(event)}>Edit</Button>
        <Button variant="destructive" onClick={() => onDelete(event.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### 2. Container Components
**Purpose**: Fetch data and manage state

**Characteristics**:
- Use custom hooks for data fetching
- Manage complex state
- Pass data to presentational components
- Handle side effects

**Example**:
```tsx
export function EventListContainer() {
  const { events, loading, error, deleteEvent } = useEventManagement();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  if (loading) return <EventList.Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (events.length === 0) return <EmptyState />;

  return (
    <>
      <EventList
        events={events}
        onEdit={setEditingEvent}
        onDelete={deleteEvent}
      />
      {editingEvent && (
        <EditEventDialog
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </>
  );
}
```

### 3. Compound Components
**Purpose**: Components that work together as a unit

**Characteristics**:
- Parent manages shared state
- Children access state via context
- Flexible composition
- Cleaner API

**Example**:
```tsx
// Parent component with context
const EventDetailsContext = createContext<EventDetailsContextValue | null>(null);

export function EventDetails({ event, children }: EventDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <EventDetailsContext.Provider value={{ event, isEditing, setIsEditing }}>
      <div className="space-y-4">{children}</div>
    </EventDetailsContext.Provider>
  );
}

// Child components
EventDetails.Header = function EventDetailsHeader() {
  const { event, isEditing, setIsEditing } = useEventDetails();
  return (
    <div className="flex items-center justify-between">
      <h2>{event.title}</h2>
      <Button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Cancel' : 'Edit'}
      </Button>
    </div>
  );
};

EventDetails.Body = function EventDetailsBody() {
  const { event } = useEventDetails();
  return <p>{event.description}</p>;
};

// Usage
<EventDetails event={event}>
  <EventDetails.Header />
  <EventDetails.Body />
</EventDetails>
```

## Props Best Practices

### Prop Naming
```tsx
// ✅ Good: Clear, descriptive names
interface Props {
  isLoading: boolean;        // Boolean prefix: is, has, should, can
  onSave: () => void;        // Event handler prefix: on
  userData: User;            // Data suffix: data, info, details
  maxItems: number;          // Clear constraints
}

// ❌ Bad: Vague names
interface Props {
  loading: boolean;          // Not clear if it's a state or action
  save: () => void;          // Unclear that it's a callback
  user: User;                // Could be confused with a userId
  max: number;               // Max what?
}
```

### Default Props
```tsx
// ✅ Good: Default parameters
interface Props {
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function Button({ size = 'md', disabled = false }: Props) {
  // ...
}

// ✅ Also good: Explicit defaults in destructuring
export function Button(props: Props) {
  const { size = 'md', disabled = false } = props;
  // ...
}
```

### Optional vs Required Props
```tsx
// Make props required if they're essential
interface EventCardProps {
  event: Event;              // Required: Can't render without it
  onRsvp?: (response: RsvpResponse) => void; // Optional: Card can display without RSVP
}

// Use unions for mutually exclusive props
interface DialogProps {
  mode: 'create' | 'edit';
  event?: Event; // Required when mode is 'edit', use discriminated union:
}

// Better: Discriminated union
type DialogProps =
  | { mode: 'create'; event?: never }
  | { mode: 'edit'; event: Event };
```

### Children Props
```tsx
// Use React.ReactNode for children
interface Props {
  children: React.ReactNode;
}

// Or be more specific
interface Props {
  children: React.ReactElement<typeof EventCard>;
}

// Or use render props for flexibility
interface Props {
  renderHeader: (event: Event) => React.ReactNode;
}
```

## State Management

### Local State Guidelines
```tsx
// ✅ Good: UI state stays local
function Accordion() {
  const [isOpen, setIsOpen] = useState(false);
  // isOpen only affects this component's display
}

// ✅ Good: Derived state computed from props
function EventCard({ event }: { event: Event }) {
  const isPast = new Date(event.start_time) < new Date();
  // Don't store isPast in state, compute it
}

// ❌ Bad: Duplicating props in state
function EventCard({ event }: { event: Event }) {
  const [eventData, setEventData] = useState(event); // Unnecessary
}
```

### When to Use Context
```tsx
// ✅ Use context for:
// - Global app state (theme, auth, current quarter)
// - Deep prop drilling (> 2 levels)
// - Compound components

// Example: Quarter context
export function QuarterProvider({ children }: { children: React.ReactNode }) {
  const [quarter, setQuarter] = useState(getCurrentQuarter());

  return (
    <QuarterContext.Provider value={{ quarter, setQuarter }}>
      {children}
    </QuarterContext.Provider>
  );
}

// ❌ Don't use context for:
// - Frequently changing values (causes re-renders)
// - Values only used in 1-2 components
// - Data that should be fetched by specific components
```

## Styling Guidelines

### Tailwind Class Organization
```tsx
// Order: Layout → Spacing → Typography → Colors → Effects
<div
  className={cn(
    // Layout
    'flex items-center justify-between',

    // Spacing
    'px-4 py-2',

    // Typography
    'text-sm font-medium',

    // Colors
    'bg-white text-gray-900',

    // Effects
    'rounded-lg shadow-sm hover:shadow-md transition-shadow',

    // Responsive
    'md:px-6 md:py-3 md:text-base',

    // Conditional
    isActive && 'bg-blue-50',

    // External classes
    className
  )}
>
```

### Dynamic Styles
```tsx
// ✅ Good: Use cn() utility for conditional classes
import { cn } from '@/lib/utils';

<button
  className={cn(
    'px-4 py-2 rounded',
    variant === 'primary' && 'bg-blue-500 text-white',
    variant === 'secondary' && 'bg-gray-200 text-gray-900',
    disabled && 'opacity-50 cursor-not-allowed'
  )}
/>

// ❌ Bad: String concatenation
<button
  className={
    'px-4 py-2 rounded ' +
    (variant === 'primary' ? 'bg-blue-500' : 'bg-gray-200')
  }
/>

// ❌ Bad: Inline styles for things Tailwind can do
<button style={{ backgroundColor: isActive ? 'blue' : 'gray' }} />
```

### CSS Variables for Dynamic Colors
```tsx
// ✅ Good: Use CSS variables for brand colors
// In globals.css:
:root {
  --color-primary: 138 36 50;
  --color-secondary: 90 90 90;
}

// In component:
<div className="bg-[rgb(var(--color-primary))]" />

// Or use Tailwind config:
<div className="bg-primary" />
```

## Performance Optimization

### Memoization
```tsx
import { memo, useMemo, useCallback } from 'react';

// 1. Memo for expensive components
export const EventList = memo(function EventList({ events }: Props) {
  return (
    <ul>
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </ul>
  );
});

// 2. useMemo for expensive calculations
function EventCalendar({ events }: Props) {
  const eventsByDate = useMemo(() => {
    return groupEventsByDate(events); // Expensive operation
  }, [events]);

  return <Calendar events={eventsByDate} />;
}

// 3. useCallback for functions passed as props
function EventContainer() {
  const handleDelete = useCallback((id: string) => {
    deleteEvent(id);
  }, []); // Empty deps if deleteEvent is stable

  return <EventList onDelete={handleDelete} />;
}
```

### Code Splitting
```tsx
import dynamic from 'next/dynamic';

// Lazy load heavy components
const EventCalendar = dynamic(() => import('./event-calendar'), {
  loading: () => <CalendarSkeleton />,
  ssr: false, // Don't render on server if not needed
});

// Lazy load dialogs (only load when opened)
const EditEventDialog = dynamic(() => import('./edit-event-dialog'));

function EventPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>Edit</Button>
      {isDialogOpen && <EditEventDialog />}
    </>
  );
}
```

## Error Handling

### Error Boundaries
```tsx
// Create reusable error boundary
export class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<ErrorPage />}>
  <EventList />
</ErrorBoundary>
```

### Error States in Components
```tsx
function EventList() {
  const { events, loading, error } = useEvents();

  // Loading state
  if (loading) {
    return <EventList.Skeleton />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title="Failed to load events"
        description={error.message}
        action={
          <Button onClick={() => refetch()}>
            Try Again
          </Button>
        }
      />
    );
  }

  // Empty state
  if (events.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No events scheduled"
        description="Create your first event to get started"
        action={
          <Button onClick={() => setShowCreateDialog(true)}>
            Create Event
          </Button>
        }
      />
    );
  }

  // Success state
  return (
    <ul className="space-y-2">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </ul>
  );
}
```

## Accessibility

### Semantic HTML
```tsx
// ✅ Good: Use semantic elements
<button onClick={handleClick}>Click me</button>
<nav>
  <ul>
    <li><a href="/events">Events</a></li>
  </ul>
</nav>

// ❌ Bad: Divs for everything
<div onClick={handleClick}>Click me</div>
<div>
  <div>
    <div><span onClick={goToEvents}>Events</span></div>
  </div>
</div>
```

### ARIA Labels
```tsx
// Add labels for icon-only buttons
<button aria-label="Close dialog" onClick={onClose}>
  <X className="h-4 w-4" />
</button>

// Add descriptions for complex interactions
<button
  aria-label="Delete event"
  aria-describedby="delete-description"
  onClick={handleDelete}
>
  <Trash2 />
</button>
<span id="delete-description" className="sr-only">
  This will permanently delete the event and cannot be undone
</span>

// Use aria-live for dynamic updates
<div role="status" aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

### Keyboard Navigation
```tsx
function EventCard({ event }: Props) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleCardClick}
      className="cursor-pointer focus-visible:ring-2"
    >
      {event.title}
    </div>
  );
}
```

## Documentation

### Component Documentation
```tsx
/**
 * EventCard displays a single event with RSVP options.
 *
 * Features:
 * - Displays event title, date, and description
 * - Shows RSVP status and allows user to respond
 * - Supports ride-share coordination
 * - Accessible via keyboard navigation
 *
 * @example
 * ```tsx
 * <EventCard
 *   event={event}
 *   onRsvp={(response) => updateRsvp(event.id, response)}
 *   showRideShare
 * />
 * ```
 *
 * @param props - Component props
 * @param props.event - The event to display
 * @param props.onRsvp - Callback when user changes RSVP status
 * @param props.showRideShare - Whether to show ride-share section
 * @param props.className - Additional CSS classes
 */
```

### Prop Documentation
```tsx
interface EventCardProps {
  /**
   * The event to display
   */
  event: Event;

  /**
   * Callback when user changes RSVP status
   * @param response - The new RSVP response
   */
  onRsvp?: (response: RsvpResponse) => void;

  /**
   * Whether to show ride-share coordination section
   * @default false
   */
  showRideShare?: boolean;

  /**
   * Additional CSS classes to apply to the root element
   */
  className?: string;
}
```

## Testing

### Component Testing Structure
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { EventCard } from './event-card';

describe('EventCard', () => {
  const mockEvent = {
    id: '1',
    title: 'Team Practice',
    start_time: '2024-03-20T10:00:00Z',
    description: 'Regular practice session',
  };

  it('renders event title and date', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('Team Practice')).toBeInTheDocument();
  });

  it('calls onRsvp when user clicks Going button', () => {
    const handleRsvp = jest.fn();
    render(<EventCard event={mockEvent} onRsvp={handleRsvp} />);

    fireEvent.click(screen.getByText('Going'));
    expect(handleRsvp).toHaveBeenCalledWith('going');
  });

  it('is keyboard accessible', () => {
    const handleRsvp = jest.fn();
    render(<EventCard event={mockEvent} onRsvp={handleRsvp} />);

    const goingButton = screen.getByText('Going');
    fireEvent.keyDown(goingButton, { key: 'Enter' });
    expect(handleRsvp).toHaveBeenCalledWith('going');
  });
});
```

## Common Patterns

### Loading States
```tsx
// Skeleton pattern
export function EventCard({ event }: Props) {
  // Component implementation
}

EventCard.Skeleton = function EventCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="h-6 w-48 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-4 flex gap-2">
        <div className="h-9 w-20 animate-pulse rounded bg-muted" />
        <div className="h-9 w-20 animate-pulse rounded bg-muted" />
      </div>
    </Card>
  );
};
```

### Empty States
```tsx
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
```

## Resources

- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
