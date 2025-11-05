# React Hooks Guide

## Overview

This guide documents all custom React hooks in the Rose-Hulman Tennis Schedule application, including usage examples, best practices, and architectural patterns.

## Hook Categories

### 1. Data Fetching Hooks
Hooks that fetch and manage data from Supabase.

### 2. State Management Hooks
Hooks that manage complex component state.

### 3. Context Hooks
Hooks that provide access to React Context providers.

### 4. Utility Hooks
General-purpose hooks for common patterns.

---

## Context Hooks

### `useToast()`

Provides access to the global toast notification system.

**Returns**:
```typescript
{
  toasts: Toast[];
  toast: {
    success: (title: string, description?: string, duration?: number) => void;
    error: (title: string, description?: string, duration?: number) => void;
    warning: (title: string, description?: string, duration?: number) => void;
    info: (title: string, description?: string, duration?: number) => void;
    custom: (toast: Omit<Toast, 'id'>) => void;
  };
  dismiss: (id: string) => void;
  dismissAll: () => void;
}
```

**Usage**:
```tsx
import { useToast } from '@/lib/contexts';

function EventForm() {
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      await createEvent(data);
      toast.success('Event created successfully');
    } catch (error) {
      toast.error('Failed to create event', error.message);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Best Practices**:
- Use `success` for completed actions
- Use `error` for failures with actionable messages
- Use `info` for neutral notifications
- Use `warning` for important but non-blocking messages
- Keep titles short (< 50 characters)
- Provide descriptions for context

---

### `useQuarter()`

Provides access to the selected academic quarter.

**Returns**:
```typescript
{
  quarterId: QuarterId;
  currentQuarter: Quarter;
  quarters: Record<QuarterId, Quarter>;
  quarterOrder: QuarterId[];
  setQuarterId: (id: QuarterId) => void;
  getQuarter: (id: QuarterId) => Quarter;
  isInCurrentQuarter: (date: Date) => boolean;
  getCurrentQuarterByDate: () => QuarterId;
}
```

**Usage**:
```tsx
import { useQuarter } from '@/lib/contexts';

function EventFilter() {
  const { currentQuarter, quarterId, setQuarterId, quarterOrder } = useQuarter();

  return (
    <div>
      <h2>Current Quarter: {currentQuarter.name}</h2>
      <select
        value={quarterId}
        onChange={(e) => setQuarterId(e.target.value as QuarterId)}
      >
        {quarterOrder.map((id) => (
          <option key={id} value={id}>
            {getQuarter(id).name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

**Best Practices**:
- Use `isInCurrentQuarter()` to filter events by quarter
- Persist quarter selection across page navigation
- Display current quarter in UI for context

---

## Data Fetching Hooks

### `useAuth()`

**Location**: `/lib/hooks/useAuth.ts`

Manages authentication state and provides auth methods.

**Returns**:
```typescript
{
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}
```

**Usage**:
```tsx
import { useAuth } from '@/lib/hooks/useAuth';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingState />;
  if (!user) return <Navigate to="/sign-in" />;

  return <>{children}</>;
}
```

---

### `useUser()`

**Location**: `/lib/hooks/useUser.ts`

Fetches and manages user profile data.

**Returns**:
```typescript
{
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}
```

**Usage**:
```tsx
import { useUser } from '@/lib/hooks/useUser';

function ProfilePage() {
  const { profile, loading, error, updateProfile } = useUser();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!profile) return <EmptyState title="Profile not found" />;

  const handleSave = async (updates: Partial<Profile>) => {
    await updateProfile(updates);
    toast.success('Profile updated');
  };

  return <ProfileForm profile={profile} onSave={handleSave} />;
}
```

---

### `useEventManagement()`

**Location**: `/lib/hooks/useEventManagement.ts`

**Current Size**: 422 lines (needs refactoring)

Manages event CRUD operations and filtering.

**Returns**:
```typescript
{
  events: Event[];
  loading: boolean;
  error: Error | null;
  createEvent: (event: CreateEventInput) => Promise<Event>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  filterEvents: (filters: EventFilters) => Event[];
  refetch: () => Promise<void>;
}
```

**Refactoring Recommendation**:

This hook should be split into:
1. `useEvents()` - Data fetching only
2. `useEventMutations()` - CRUD operations
3. `useEventFilters()` - Filtering logic

**Current Usage**:
```tsx
import { useEventManagement } from '@/lib/hooks/useEventManagement';

function EventList() {
  const {
    events,
    loading,
    error,
    deleteEvent,
    filterEvents
  } = useEventManagement();

  const filteredEvents = filterEvents({
    eventType: 'mandatory',
    startDate: quarterStart,
    endDate: quarterEnd
  });

  return (
    <div>
      {filteredEvents.map(event => (
        <EventCard
          key={event.id}
          event={event}
          onDelete={() => deleteEvent(event.id)}
        />
      ))}
    </div>
  );
}
```

---

### `useClassSchedule()`

**Location**: `/lib/hooks/useClassSchedule.ts`

**Current Size**: 288 lines

Manages user class schedules.

**Returns**:
```typescript
{
  classes: ClassScheduleItem[];
  loading: boolean;
  error: Error | null;
  addClass: (classItem: CreateClassInput) => Promise<void>;
  updateClass: (id: string, updates: Partial<ClassScheduleItem>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  checkConflicts: (timeRange: TimeRange) => Conflict[];
}
```

**Usage**:
```tsx
import { useClassSchedule } from '@/lib/hooks/useClassSchedule';

function ClassScheduleManager() {
  const { classes, addClass, deleteClass, checkConflicts } = useClassSchedule();

  const handleAddClass = async (classData: CreateClassInput) => {
    const conflicts = checkConflicts({
      day: classData.day_of_week,
      start: classData.start_time,
      end: classData.end_time
    });

    if (conflicts.length > 0) {
      toast.warning('This conflicts with existing classes');
      return;
    }

    await addClass(classData);
    toast.success('Class added');
  };

  return <ClassScheduleForm onSubmit={handleAddClass} />;
}
```

---

### `useBlockers()`

**Location**: `/lib/hooks/useBlockers.ts`

**Current Size**: 373 lines (needs refactoring)

Manages availability blockers (exams, conflicts).

**Refactoring Recommendation**:

Split into:
1. `useOneTimeBlockers()` - One-time events
2. `useRecurringBlockers()` - Recurring blockers
3. `useBlockerMutations()` - CRUD operations

---

### `useAvailability()`

**Location**: `/lib/hooks/useAvailability.ts`

**Current Size**: 345 lines

Manages user availability slots.

**Usage**:
```tsx
import { useAvailability } from '@/lib/hooks/useAvailability';

function AvailabilityCalendar() {
  const { availability, setAvailability, loading } = useAvailability();

  const handleSlotClick = async (slot: TimeSlot) => {
    await setAvailability(slot.id, !slot.available);
  };

  return (
    <Calendar
      slots={availability}
      onSlotClick={handleSlotClick}
    />
  );
}
```

---

## Best Practices

### 1. Hook Composition

**Good**: Compose small hooks
```tsx
function useEventList() {
  const { events, loading } = useEvents();
  const { currentQuarter } = useQuarter();
  const { profile } = useUser();

  const filteredEvents = useMemo(() => {
    return events.filter(event =>
      isInQuarter(event.start_time, currentQuarter) &&
      matchesUserTeam(event, profile)
    );
  }, [events, currentQuarter, profile]);

  return { events: filteredEvents, loading };
}
```

**Bad**: One giant hook that does everything
```tsx
function useEventListWithFilteringAndSortingAndGrouping() {
  // 500 lines of mixed concerns...
}
```

### 2. Error Handling

**Always return error state**:
```tsx
function useData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
```

### 3. Memoization

**Use `useMemo` for expensive computations**:
```tsx
function useFilteredEvents(events: Event[], filters: Filters) {
  return useMemo(() => {
    return events.filter(event => {
      // Complex filtering logic
      return matchesFilters(event, filters);
    });
  }, [events, filters]);
}
```

**Use `useCallback` for stable function references**:
```tsx
function useEventActions() {
  const { toast } = useToast();

  const deleteEvent = useCallback(async (id: string) => {
    await api.deleteEvent(id);
    toast.success('Event deleted');
  }, [toast]); // toast is stable from context

  return { deleteEvent };
}
```

### 4. Data Fetching Patterns

**Pattern 1: Fetch on mount**
```tsx
function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  return { events, loading };
}
```

**Pattern 2: Fetch with dependencies**
```tsx
function useEventsByQuarter(quarterId: QuarterId) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEventsByQuarter(quarterId).then(setEvents);
  }, [quarterId]); // Re-fetch when quarter changes

  return { events };
}
```

**Pattern 3: Manual refetch**
```tsx
function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, [refreshTrigger]);

  const refetch = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return { events, refetch };
}
```

### 5. Cleanup

**Always cleanup side effects**:
```tsx
function useRealTimeEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const subscription = supabase
      .channel('events')
      .on('INSERT', handleInsert)
      .on('UPDATE', handleUpdate)
      .subscribe();

    // Cleanup on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { events };
}
```

### 6. TypeScript

**Always type hook returns**:
```tsx
interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function useEvents(): UseEventsReturn {
  // Implementation
}
```

## Common Patterns

### Loading State Pattern
```tsx
function useData<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetcher()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [fetcher]);

  return { data, loading, error };
}
```

### Optimistic Update Pattern
```tsx
function useOptimisticUpdate() {
  const [items, setItems] = useState<Item[]>([]);

  const deleteItem = async (id: string) => {
    // Optimistic update
    const previousItems = items;
    setItems(prev => prev.filter(item => item.id !== id));

    try {
      await api.deleteItem(id);
    } catch (error) {
      // Rollback on error
      setItems(previousItems);
      toast.error('Failed to delete item');
    }
  };

  return { items, deleteItem };
}
```

### Debounce Pattern
```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    // Only runs 300ms after user stops typing
    fetchResults(debouncedSearch);
  }, [debouncedSearch]);

  return <input value={search} onChange={e => setSearch(e.target.value)} />;
}
```

## Testing Hooks

### Using React Testing Library
```tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

### Testing with Context
```tsx
import { renderHook } from '@testing-library/react';
import { ToastProvider } from '@/lib/contexts';
import { useToast } from '@/lib/contexts';

describe('useToast', () => {
  it('shows success toast', () => {
    const wrapper = ({ children }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.toast.success('Test');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('success');
  });
});
```

## Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [React Hooks Testing Library](https://react-hooks-testing-library.com/)
- [Supabase React Hooks](https://supabase.com/docs/guides/with-react)
