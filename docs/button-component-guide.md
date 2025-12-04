# Button Component - $100M Design System

## Overview

The Button component is a world-class, feature-rich button system designed for premium user experiences. Every interaction feels satisfying, every state is crystal clear, and every tap is optimized for mobile devices.

## Features

✅ **8 Visual Variants** - From primary CTAs to subtle links
✅ **9 Size Options** - Including icon-only variants
✅ **Premium Micro-Interactions** - Framer Motion powered
✅ **Loading States** - Built-in spinner, prevents double-clicks
✅ **Icon Support** - Left/right icons with perfect alignment
✅ **Mobile Optimized** - 44px+ touch targets, tactile feedback
✅ **Accessibility** - Focus rings, disabled states, ARIA support
✅ **Type-Safe** - Full TypeScript support

---

## Variants

### 1. Default (Primary)
Bold maroon CTAs for main actions.
```tsx
<Button>Sign In</Button>
<Button variant="default" size="lg">Get Started</Button>
```

### 2. Success
Positive confirmations, "Going" RSVP.
```tsx
<Button variant="success">Going</Button>
<Button variant="success" size="lg">Confirm</Button>
```

### 3. Warning
Cautionary actions, "Maybe" RSVP.
```tsx
<Button variant="warning">Maybe</Button>
<Button variant="warning" size="default">Proceed with Caution</Button>
```

### 4. Destructive
Dangerous actions, "Not Going" or delete.
```tsx
<Button variant="destructive">Delete</Button>
<Button variant="destructive">Not Going</Button>
```

### 5. Secondary
Outlined, subtle for secondary actions.
```tsx
<Button variant="secondary">Cancel</Button>
<Button variant="secondary" size="lg">View Details</Button>
```

### 6. Ghost
Transparent until hover, tertiary actions.
```tsx
<Button variant="ghost">Edit</Button>
<Button variant="ghost" size="sm">More Options</Button>
```

### 7. Outline
Neutral border only.
```tsx
<Button variant="outline">Filter</Button>
<Button variant="outline" size="default">Apply</Button>
```

### 8. Link
Text-only, inline actions.
```tsx
<Button variant="link">Learn More</Button>
<Button variant="link">Terms & Conditions</Button>
```

---

## Sizes

### Standard Sizes
```tsx
<Button size="xs">Extra Small</Button>       {/* 32px height */}
<Button size="sm">Small</Button>             {/* 36px height */}
<Button size="default">Default</Button>      {/* 44px height - touch optimized */}
<Button size="lg">Large</Button>             {/* 52px height */}
<Button size="xl">Extra Large</Button>       {/* 60px height */}
```

### Icon Sizes
```tsx
import { Plus, Search, Settings } from 'lucide-react';

<Button size="icon-xs"><Plus /></Button>     {/* 32x32 */}
<Button size="icon-sm"><Search /></Button>   {/* 36x36 */}
<Button size="icon"><Settings /></Button>    {/* 44x44 - default */}
<Button size="icon-lg"><Plus /></Button>     {/* 52x52 */}
<Button size="icon-xl"><Search /></Button>   {/* 60x60 */}
```

---

## Icon Support

### Left Icon
```tsx
import { Calendar, User, Mail } from 'lucide-react';

<Button iconLeft={<Calendar className="h-5 w-5" />}>
  Schedule
</Button>

<Button variant="success" iconLeft={<User className="h-5 w-5" />}>
  My Profile
</Button>
```

### Right Icon
```tsx
import { ArrowRight, ExternalLink } from 'lucide-react';

<Button iconRight={<ArrowRight className="h-5 w-5" />}>
  Next
</Button>

<Button variant="link" iconRight={<ExternalLink className="h-4 w-4" />}>
  Open
</Button>
```

### Both Icons
```tsx
import { Download, Check } from 'lucide-react';

<Button
  iconLeft={<Download className="h-5 w-5" />}
  iconRight={<Check className="h-5 w-5" />}
>
  Download Complete
</Button>
```

---

## Loading State

Prevents double-clicks and shows visual feedback.

```tsx
const [isLoading, setIsLoading] = React.useState(false);

<Button isLoading={isLoading} onClick={handleSubmit}>
  Save Changes
</Button>

// When loading:
// ⟳ Save Changes (with spinner, text at 70% opacity)
```

### Loading with Variants
```tsx
<Button variant="success" isLoading>Going</Button>
<Button variant="destructive" isLoading>Deleting...</Button>
<Button variant="default" size="lg" isLoading>Submitting Form</Button>
```

---

## Full Width

Perfect for mobile CTAs.

```tsx
<Button fullWidth>Sign In</Button>
<Button fullWidth variant="success" size="lg">
  Create Account
</Button>
```

---

## Common Patterns

### RSVP Button Group
```tsx
import { Check, HelpCircle, X } from 'lucide-react';

<div className="flex gap-2">
  <Button
    variant="success"
    iconLeft={<Check className="h-5 w-5" />}
    onClick={() => handleRsvp('going')}
  >
    Going
  </Button>

  <Button
    variant="warning"
    iconLeft={<HelpCircle className="h-5 w-5" />}
    onClick={() => handleRsvp('maybe')}
  >
    Maybe
  </Button>

  <Button
    variant="destructive"
    iconLeft={<X className="h-5 w-5" />}
    onClick={() => handleRsvp('not_going')}
  >
    Not Going
  </Button>
</div>
```

### Form Actions
```tsx
<div className="flex justify-end gap-3">
  <Button variant="ghost" onClick={handleCancel}>
    Cancel
  </Button>
  <Button
    variant="default"
    isLoading={isSubmitting}
    onClick={handleSubmit}
  >
    Save
  </Button>
</div>
```

### Mobile Full-Width Stack
```tsx
<div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-end">
  <Button fullWidth variant="secondary" className="sm:w-auto">
    Cancel
  </Button>
  <Button fullWidth variant="default" className="sm:w-auto">
    Confirm
  </Button>
</div>
```

### Icon-Only Floating Action Button (FAB)
```tsx
import { Plus } from 'lucide-react';

<Button
  size="icon-lg"
  variant="default"
  className="fixed bottom-6 right-6 rounded-full shadow-xl"
>
  <Plus className="h-6 w-6" />
</Button>
```

---

## Accessibility

### Focus States
All buttons have visible focus rings for keyboard navigation.
```tsx
<Button>Keyboard Accessible</Button>
// Focus with Tab key - visible ring appears
```

### Disabled States
```tsx
<Button disabled>Disabled Button</Button>
<Button disabled variant="success">Can't Click Me</Button>
```

### ARIA Labels
```tsx
import { Trash2 } from 'lucide-react';

<Button
  size="icon"
  variant="destructive"
  aria-label="Delete event"
>
  <Trash2 className="h-5 w-5" />
</Button>
```

---

## Advanced Usage

### As Child (Composition)
Use `asChild` to render as a different element (e.g., Link).

```tsx
import Link from 'next/link';

<Button asChild>
  <Link href="/events">View Events</Link>
</Button>

<Button asChild variant="link">
  <a href="https://example.com" target="_blank">
    External Link
  </a>
</Button>
```

### Custom Styling
```tsx
<Button className="bg-gradient-to-r from-maroon-700 to-maroon-500">
  Gradient Button
</Button>

<Button variant="ghost" className="hover:bg-success-50 hover:text-success-700">
  Custom Hover
</Button>
```

---

## States Reference

| State | Visual | Description |
|-------|--------|-------------|
| Default | Inviting, touchable | Base state, ready for interaction |
| Hover | Subtle scale (1.02x), shadow lift | Mouse over / touch preview |
| Active/Press | Scale down (0.98x) | Pressed/tapped feedback |
| Focus | Visible ring | Keyboard navigation |
| Disabled | 50% opacity, no pointer | Cannot interact |
| Loading | Spinner + dimmed text | Processing, prevents double-click |

---

## Micro-Interactions

All buttons (except `asChild`) include:
- **Hover**: Subtle scale up (1.02x) with shadow lift
- **Press**: Scale down (0.98x) for tactile feedback
- **Spring Animation**: Athletic, bouncy feel (400 stiffness, 25 damping)
- **Smooth Transitions**: 200ms for color/shadow changes

---

## Touch Target Guidelines

All buttons meet **minimum 44px touch targets** on mobile:

| Size | Height | Recommended Use |
|------|--------|-----------------|
| `xs` | 32px | Desktop-only, tight spaces |
| `sm` | 36px | Secondary actions, forms |
| `default` | **44px** | ✅ Primary mobile actions |
| `lg` | 52px | Hero CTAs, important actions |
| `xl` | 60px | Marketing pages, emphasis |

---

## Examples by Context

### Tennis Match RSVP
```tsx
<div className="flex gap-2 justify-center">
  <Button variant="success" size="lg">Going</Button>
  <Button variant="warning" size="lg">Maybe</Button>
  <Button variant="destructive" size="lg">Not Going</Button>
</div>
```

### Event Details Actions
```tsx
import { Calendar, Share2, MapPin } from 'lucide-react';

<div className="grid grid-cols-3 gap-2">
  <Button
    variant="secondary"
    iconLeft={<Calendar className="h-5 w-5" />}
  >
    Add to Calendar
  </Button>
  <Button
    variant="ghost"
    iconLeft={<Share2 className="h-5 w-5" />}
  >
    Share
  </Button>
  <Button
    variant="outline"
    iconLeft={<MapPin className="h-5 w-5" />}
  >
    Directions
  </Button>
</div>
```

### Profile Actions
```tsx
import { Save, LogOut } from 'lucide-react';

<div className="flex flex-col gap-3 sm:flex-row">
  <Button
    fullWidth
    variant="default"
    size="lg"
    iconLeft={<Save className="h-5 w-5" />}
    isLoading={isSaving}
  >
    Save Profile
  </Button>
  <Button
    fullWidth
    variant="destructive"
    size="lg"
    iconLeft={<LogOut className="h-5 w-5" />}
  >
    Sign Out
  </Button>
</div>
```

---

## Design Tokens Used

The button uses design tokens from `lib/design-tokens.ts`:

- **Colors**: `maroon`, `success`, `warning`, `error`, `neutral`
- **Shadows**: `md`, `lg`, `maroon`, `accent`
- **Radius**: `md`, `lg`, `xl`, `2xl`
- **Transitions**: Athletic spring animations

---

## TypeScript Props

```typescript
interface ButtonProps {
  variant?:
    | 'default'
    | 'secondary'
    | 'ghost'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'outline'
    | 'link';

  size?:
    | 'xs'
    | 'sm'
    | 'default'
    | 'lg'
    | 'xl'
    | 'icon'
    | 'icon-xs'
    | 'icon-sm'
    | 'icon-lg'
    | 'icon-xl';

  asChild?: boolean;
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;

  // Plus all standard button HTML attributes
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  // ... etc
}
```

---

## Best Practices

### ✅ Do
- Use `size="default"` or larger for mobile touch targets
- Use semantic variants (`success`, `warning`, `destructive`) for RSVP/actions
- Provide `aria-label` for icon-only buttons
- Use `isLoading` for async operations
- Use `fullWidth` for mobile CTAs

### ❌ Don't
- Don't use `size="xs"` for mobile primary actions
- Don't stack too many buttons without spacing
- Don't forget focus states for keyboard users
- Don't use `disabled` without visual explanation
- Don't nest interactive elements inside buttons

---

## Performance

- **Tree-shakeable**: Only imports what you use
- **Optimized animations**: GPU-accelerated transforms
- **Minimal re-renders**: Memoized motion props
- **Small bundle**: CVA for efficient class generation

---

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Android Chrome (latest)

---

## Related Components

- **ButtonGroup**: Connect multiple buttons
- **ToggleButton**: Toggle state buttons
- **FloatingActionButton**: Mobile FAB pattern
- **IconButton**: Specialized icon-only variant

---

Built with ❤️ for the Rose-Hulman Tennis Team
