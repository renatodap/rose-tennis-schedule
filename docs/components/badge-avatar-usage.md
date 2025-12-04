# Badge & Avatar Component Usage Guide

Premium badge and avatar components for the Rose-Hulman Tennis Team app.

## Badge Component

The Badge component provides semantic visual indicators with multiple variants, styles, and sizes.

### Basic Usage

```tsx
import { Badge } from '@/components/ui/badge';

// Simple badge
<Badge>Default</Badge>

// With variant
<Badge variant="success">Going</Badge>
<Badge variant="warning">Maybe</Badge>
<Badge variant="danger">Mandatory</Badge>
```

### Variants

**Semantic variants** (use these for new code):
- `default` - Neutral gray
- `primary` - Rose-Hulman maroon
- `success` - Green (Going, Available)
- `warning` - Amber (Maybe, Recommended)
- `danger` - Red (Mandatory, Not Going)
- `info` - Blue (Match, Info)

**Legacy variants** (backward compatible):
- `secondary` - Gray (mapped to default soft)
- `destructive` - Red (mapped to danger solid)
- `outline` - Outlined (mapped to default outline)

### Badge Styles

Use the `badgeStyle` prop to control appearance:

```tsx
// Solid (default) - Filled background
<Badge variant="success" badgeStyle="solid">Going</Badge>

// Soft - Lighter background, darker text
<Badge variant="warning" badgeStyle="soft">Recommended</Badge>

// Outline - Border only
<Badge variant="danger" badgeStyle="outline">Mandatory</Badge>

// Dot - Tiny indicator dot
<Badge variant="success" badgeStyle="dot">Available</Badge>
```

### Sizes

```tsx
<Badge size="xs">Tiny</Badge>
<Badge size="sm">Small</Badge>
<Badge size="default">Default</Badge>
<Badge size="lg">Large</Badge>
```

### With Icons

```tsx
import { Check, AlertCircle, X } from 'lucide-react';

<Badge variant="success" icon={<Check className="w-3 h-3" />}>
  Going
</Badge>

<Badge variant="warning" icon={<AlertCircle className="w-3 h-3" />}>
  Maybe
</Badge>
```

### Removable (Tags)

```tsx
<Badge
  variant="primary"
  removable
  onRemove={() => console.log('Removed')}
>
  Filter Tag
</Badge>
```

### Pulse Animation

```tsx
<Badge variant="danger" pulse>
  New
</Badge>
```

### Event Type Examples

```tsx
// Event types
<Badge variant="danger" badgeStyle="soft">Mandatory</Badge>
<Badge variant="warning" badgeStyle="soft">Recommended</Badge>
<Badge variant="success" badgeStyle="soft">Optional</Badge>
<Badge variant="info" badgeStyle="soft">Match</Badge>

// RSVP status
<Badge variant="success" badgeStyle="dot" icon={<Check />}>Going</Badge>
<Badge variant="warning" badgeStyle="dot">Maybe</Badge>
<Badge variant="danger" badgeStyle="dot" icon={<X />}>Not Going</Badge>
```

## Avatar Component

The Avatar component displays user profile images with fallback initials, status indicators, and multiple sizes.

### Basic Usage

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="John Doe" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### Sizes

```tsx
<Avatar size="xs">...</Avatar>      {/* 24px */}
<Avatar size="sm">...</Avatar>      {/* 32px */}
<Avatar size="default">...</Avatar> {/* 40px */}
<Avatar size="lg">...</Avatar>      {/* 48px */}
<Avatar size="xl">...</Avatar>      {/* 64px */}
<Avatar size="2xl">...</Avatar>     {/* 96px */}
```

### With Status Indicator

```tsx
// Online status
<Avatar status="online">
  <AvatarImage src={user.avatar} />
  <AvatarFallback>{user.initials}</AvatarFallback>
</Avatar>

// Status options: 'online' | 'away' | 'busy' | 'offline'
<Avatar status="away">...</Avatar>
<Avatar status="busy">...</Avatar>
<Avatar status="offline">...</Avatar>
```

### With Ring (Border)

```tsx
// White ring (for grouped avatars)
<Avatar ring="default">...</Avatar>

// Colored rings
<Avatar ring="primary">...</Avatar>  {/* Maroon */}
<Avatar ring="success">...</Avatar>  {/* Green */}
<Avatar ring="warning">...</Avatar>  {/* Amber */}
<Avatar ring="danger">...</Avatar>   {/* Red */}
```

### Hover Effect

```tsx
<Avatar hover>
  <AvatarImage src={user.avatar} />
  <AvatarFallback>{user.initials}</AvatarFallback>
</Avatar>
```

## Avatar Group Component

Display multiple avatars in a stacked, overlapping layout with overflow handling.

### Basic Usage

```tsx
import { AvatarGroup } from '@/components/ui/avatar-group';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

<AvatarGroup max={5} size="sm">
  {attendees.map(user => (
    <Avatar key={user.id}>
      <AvatarImage src={user.avatar} />
      <AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
  ))}
</AvatarGroup>
```

### Props

- `max` - Maximum number of avatars to show before overflow (default: 5)
- `size` - Size applied to all avatars ('xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl')

### Features

- **Automatic overflow**: Shows "+N" for remaining avatars
- **Stacked layout**: Overlapping with proper z-index
- **Hover effect**: Individual avatars scale on hover
- **Consistent spacing**: Proper overlap based on size

### Complete Example

```tsx
import { AvatarGroup } from '@/components/ui/avatar-group';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function EventAttendees({ attendees }: { attendees: User[] }) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-3">
        <AvatarGroup max={5} size="sm">
          {attendees.map(user => (
            <Tooltip key={user.id}>
              <TooltipTrigger asChild>
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{user.fullName}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </AvatarGroup>

        <span className="text-sm text-gray-600 font-medium">
          {attendees.length} going
        </span>
      </div>
    </TooltipProvider>
  );
}
```

## Real-World Examples

### Event Card with Type Badge

```tsx
<div className="space-y-2">
  <div className="flex items-center justify-between">
    <h3 className="font-semibold">Spring Practice</h3>
    <Badge variant="danger" badgeStyle="soft" size="sm">
      Mandatory
    </Badge>
  </div>

  <AvatarGroup max={4} size="xs">
    {attendees.map(user => (
      <Avatar key={user.id}>
        <AvatarImage src={user.avatar} />
        <AvatarFallback>{user.initials}</AvatarFallback>
      </Avatar>
    ))}
  </AvatarGroup>
</div>
```

### User Profile with Status

```tsx
<div className="flex items-center gap-3">
  <Avatar size="xl" status="online">
    <AvatarImage src={user.avatar} />
    <AvatarFallback>{user.initials}</AvatarFallback>
  </Avatar>

  <div>
    <h3 className="font-semibold">{user.name}</h3>
    <div className="flex gap-2">
      <Badge variant="primary" badgeStyle="soft" size="sm">
        Captain
      </Badge>
      <Badge variant="success" badgeStyle="dot" size="sm">
        Available
      </Badge>
    </div>
  </div>
</div>
```

### Filter Tags

```tsx
<div className="flex gap-2 flex-wrap">
  <Badge
    variant="primary"
    badgeStyle="soft"
    removable
    onRemove={() => removeFilter('mandatory')}
  >
    Mandatory Events
  </Badge>
  <Badge
    variant="success"
    badgeStyle="soft"
    removable
    onRemove={() => removeFilter('going')}
  >
    Going
  </Badge>
</div>
```

## Accessibility

- Badges support all standard HTML attributes
- Status dots include `aria-label` for screen readers
- Removable badges have proper `aria-label` on close button
- Color is not the only indicator (icons, text, patterns)

## Migration from Legacy API

If you're using the old Badge API:

```tsx
// Old (still works)
<Badge variant="outline">Text</Badge>
<Badge variant="secondary">Text</Badge>
<Badge variant="destructive">Text</Badge>

// New (preferred)
<Badge variant="default" badgeStyle="outline">Text</Badge>
<Badge variant="default" badgeStyle="soft">Text</Badge>
<Badge variant="danger" badgeStyle="solid">Text</Badge>
```

The old API is maintained for backward compatibility but new code should use the new semantic variants.
