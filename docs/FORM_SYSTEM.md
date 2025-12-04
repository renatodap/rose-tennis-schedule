# Premium Form System

## Overview

The Rose-Hulman Tennis App now features a complete, accessible, and delightful form system designed for premium user experience. All form components are built with:

- **Touch-friendly sizing** (44px minimum for mobile)
- **Clear visual feedback** (focus states, error states, success states)
- **Smooth animations** (Framer Motion for delightful interactions)
- **Full accessibility** (ARIA labels, keyboard navigation, screen reader support)
- **Consistent design language** (uses design tokens from `lib/design-tokens.ts`)

---

## Components

### 1. Input (`components/ui/input.tsx`)

A versatile text input component with multiple variants and states.

**Features:**
- 3 variants: `default`, `filled`, `outlined`
- 3 sizes: `sm` (36px), `default` (44px), `lg` (52px)
- 3 states: `default`, `error`, `success`
- Leading/trailing icons
- Prefix/suffix text
- Clearable option
- Disabled state

**Usage:**
```tsx
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

// Basic
<Input placeholder="Email address" />

// With leading icon
<Input
  leadingIcon={<Mail className="h-5 w-5" />}
  placeholder="Email address"
/>

// Error state
<Input state="error" placeholder="Invalid email" />

// Clearable
<Input clearable onClear={() => console.log('Cleared')} />

// Sizes
<Input inputSize="sm" placeholder="Small" />
<Input inputSize="lg" placeholder="Large" />
```

---

### 2. Label (`components/ui/label.tsx`)

Accessible labels with required/optional indicators.

**Features:**
- Required indicator (red asterisk)
- Optional indicator (gray text)
- Size variants: `sm`, `default`, `lg`
- Proper ARIA association

**Usage:**
```tsx
import { Label } from '@/components/ui/label';

// Required field
<Label htmlFor="email" required>Email Address</Label>

// Optional field
<Label htmlFor="bio" optional>Bio</Label>
```

---

### 3. Textarea (`components/ui/textarea.tsx`)

Multi-line text input with auto-resize and character counting.

**Features:**
- 3 variants: `default`, `filled`, `outlined`
- 3 states: `default`, `error`, `success`
- Auto-resize option
- Character count display
- Max length support

**Usage:**
```tsx
import { Textarea } from '@/components/ui/textarea';

// Basic
<Textarea placeholder="Tell us about yourself..." />

// With character count
<Textarea
  showCharCount
  maxLength={500}
  placeholder="Max 500 characters"
/>

// Auto-resize
<Textarea autoResize placeholder="Grows as you type..." />
```

---

### 4. Checkbox (`components/ui/checkbox.tsx`)

Beautiful checkbox with spring animation and helper components.

**Features:**
- 3 sizes: `sm`, `default` (24px), `lg`
- Indeterminate state
- Spring animation on check
- `CheckboxWithLabel` helper
- `CheckboxGroup` for multiple checkboxes

**Usage:**
```tsx
import { Checkbox, CheckboxWithLabel, CheckboxGroup } from '@/components/ui/checkbox';

// Basic
<Checkbox id="terms" />

// With label helper
<CheckboxWithLabel
  label="Enable notifications"
  description="Get notified about new matches"
/>

// Group
<CheckboxGroup orientation="vertical">
  <CheckboxWithLabel label="Option 1" />
  <CheckboxWithLabel label="Option 2" />
  <CheckboxWithLabel label="Option 3" />
</CheckboxGroup>

// Indeterminate
<Checkbox indeterminate />
```

---

### 5. Radio Group (`components/ui/radio-group.tsx`)

Radio buttons with standard and card-style variants.

**Features:**
- 3 sizes: `sm`, `default` (24px), `lg`
- 2 variants: `default`, `cards`
- 2 layouts: `vertical`, `horizontal`
- `RadioCard` for rich selections (perfect for RSVP)
- `RadioWithLabel` helper
- Spring animation on select

**Usage:**
```tsx
import { RadioGroup, RadioGroupItem, RadioCard, RadioWithLabel } from '@/components/ui/radio-group';

// Basic
<RadioGroup defaultValue="option1">
  <RadioWithLabel value="option1" label="Option 1" />
  <RadioWithLabel value="option2" label="Option 2" />
</RadioGroup>

// Card style (perfect for RSVP)
<RadioGroup variant="cards" defaultValue="going">
  <RadioCard
    value="going"
    icon={<Check className="h-5 w-5" />}
    label="Going"
    description="I'll be there"
  />
  <RadioCard
    value="maybe"
    icon={<HelpCircle className="h-5 w-5" />}
    label="Maybe"
    description="Not sure yet"
  />
  <RadioCard
    value="not_going"
    icon={<X className="h-5 w-5" />}
    label="Can't Go"
    description="Won't be able to make it"
  />
</RadioGroup>

// Horizontal layout
<RadioGroup layout="horizontal" defaultValue="yes">
  <RadioWithLabel value="yes" label="Yes" />
  <RadioWithLabel value="no" label="No" />
</RadioGroup>
```

---

### 6. Select (`components/ui/select.tsx`)

Enhanced dropdown with premium styling.

**Features:**
- 44px height (touch-friendly)
- Hover states
- Checkmark for selected items
- Smooth animations

**Usage:**
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="beginner">Beginner</SelectItem>
    <SelectItem value="intermediate">Intermediate</SelectItem>
    <SelectItem value="advanced">Advanced</SelectItem>
  </SelectContent>
</Select>
```

---

### 7. FormField (`components/ui/form-field.tsx`)

Wrapper component that combines label, input, error/success messages, and hints.

**Features:**
- Animated error/success messages
- Hint text support
- Proper spacing and alignment
- Icons for errors/success
- Automatic ARIA associations

**Usage:**
```tsx
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';

// With label and required indicator
<FormField label="Email Address" required>
  <Input placeholder="you@example.com" />
</FormField>

// With error
<FormField
  label="Password"
  required
  error="Password must be at least 8 characters"
>
  <Input type="password" state="error" />
</FormField>

// With success
<FormField
  label="Username"
  success="Username is available!"
>
  <Input state="success" />
</FormField>

// With hint
<FormField
  label="Bio"
  optional
  hint="Tell us a little bit about yourself"
>
  <Textarea placeholder="I am a..." />
</FormField>
```

---

## Design Tokens

All components use design tokens from `lib/design-tokens.ts`:

### Colors
- **Primary**: `maroon-700` (#991b1b)
- **Error**: `error-500` (#ef4444)
- **Success**: `success-500` (#22c55e)
- **Neutral**: `neutral-300`, `neutral-400`, `neutral-500`

### Sizing
- **Small**: 36px height
- **Default**: 44px height (mobile-optimized)
- **Large**: 52px height

### Touch Targets
- Minimum: 24px × 24px (checkboxes, radio buttons)
- Preferred: 44px × 44px (inputs, buttons)

### Focus States
- Ring color: `maroon-700`
- Ring width: 2px
- Ring offset: 2px
- Background: Subtle `neutral-50` on focus

---

## Accessibility Features

All components include:

1. **Keyboard Navigation**
   - Full tab order support
   - Enter/Space activation
   - Arrow key navigation (radio groups)

2. **Screen Reader Support**
   - Proper ARIA labels
   - Role attributes
   - Live regions for errors
   - Required/optional indicators

3. **Focus Management**
   - Visible focus rings
   - Focus trap in modals
   - Logical tab order

4. **Error Handling**
   - `role="alert"` for errors
   - Associated error messages
   - Clear visual indicators

---

## Animation Guidelines

### Transitions
- **Fast**: 150ms (hover states)
- **Normal**: 200ms (focus states, color changes)
- **Slow**: 300ms (slide animations)

### Easing
- **Athletic**: `cubic-bezier(0.4, 0, 0.2, 1)` - Fast out, slow in
- **Spring**: `cubic-bezier(0.34, 1.56, 0.64, 1)` - Bouncy

### Spring Animations
Checkboxes and radio buttons use Framer Motion spring:
```ts
{
  type: 'spring',
  stiffness: 500,
  damping: 25
}
```

---

## Complete Form Examples

See `docs/form-examples.tsx` for comprehensive examples including:

1. **Sign-Up Form** - Complete registration with all field types
2. **RSVP Form** - Card-style radio buttons for event responses
3. **Profile Edit** - Mix of inputs, selects, and textareas
4. **Settings Form** - Checkbox groups and toggles

---

## Migration Guide

### From Old Input
```tsx
// Before
<input className="..." />

// After
<Input inputSize="default" variant="default" />
```

### From Old Checkbox
```tsx
// Before
<input type="checkbox" />
<label>Accept terms</label>

// After
<CheckboxWithLabel label="Accept terms" />
```

### From Old Radio
```tsx
// Before
<input type="radio" name="rsvp" value="going" />
<label>Going</label>

// After
<RadioGroup>
  <RadioCard
    value="going"
    label="Going"
    description="I'll be there"
  />
</RadioGroup>
```

---

## Best Practices

### 1. Always Use FormField
Wrap inputs in FormField for consistent spacing and error handling:
```tsx
<FormField label="Email" required error={errors.email}>
  <Input type="email" state={errors.email ? 'error' : 'default'} />
</FormField>
```

### 2. Provide Clear Feedback
Always indicate required fields and provide helpful errors:
```tsx
<FormField
  label="Password"
  required
  hint="Must be at least 8 characters"
  error={errors.password}
>
  <Input type="password" />
</FormField>
```

### 3. Use Appropriate Input Types
- Email: `type="email"`
- Password: `type="password"`
- Number: `type="number"`
- Tel: `type="tel"`

### 4. Mobile Optimization
- Use `default` size (44px) for primary forms
- Use `lg` size (52px) for hero/landing forms
- Use `sm` size (36px) for dense tables/lists

### 5. Icon Usage
- Leading icons for input type (Mail, Lock, User)
- Trailing icons for actions (Search, Clear)
- Card icons for visual hierarchy (Check, X, HelpCircle)

---

## Testing Checklist

Before deploying forms:

- [ ] All inputs have 44px minimum touch target
- [ ] Focus states are visible and on-brand
- [ ] Error states are clear but not jarring
- [ ] Labels are properly associated (test with screen reader)
- [ ] Tab order is logical
- [ ] Form works without mouse (keyboard only)
- [ ] Required fields are marked
- [ ] Error messages are helpful
- [ ] Success states provide confirmation
- [ ] Mobile viewport is comfortable

---

## Support

For questions or issues:
1. Check examples in `docs/form-examples.tsx`
2. Review design tokens in `lib/design-tokens.ts`
3. Test with component playground at `/card-showcase`
