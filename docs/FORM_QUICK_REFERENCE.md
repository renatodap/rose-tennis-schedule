# Form Components Quick Reference

## At-a-Glance Component Guide

---

## 🎯 Input

**Import**: `import { Input } from '@/components/ui/input';`

| Prop | Type | Options | Default |
|------|------|---------|---------|
| `variant` | string | `default`, `filled`, `outlined` | `default` |
| `inputSize` | string | `sm`, `default`, `lg` | `default` |
| `state` | string | `default`, `error`, `success` | `default` |
| `leadingIcon` | ReactNode | Any icon component | - |
| `trailingIcon` | ReactNode | Any icon component | - |
| `prefix` | string | Text before input | - |
| `suffix` | string | Text after input | - |
| `clearable` | boolean | Show clear button | `false` |
| `onClear` | function | Clear handler | - |

**Quick Examples**:
```tsx
<Input placeholder="Basic input" />
<Input leadingIcon={<Mail />} placeholder="With icon" />
<Input state="error" placeholder="Error state" />
<Input inputSize="lg" placeholder="Large size" />
```

---

## 🏷️ Label

**Import**: `import { Label } from '@/components/ui/label';`

| Prop | Type | Options | Default |
|------|------|---------|---------|
| `required` | boolean | Show asterisk | `false` |
| `optional` | boolean | Show "(optional)" | `false` |
| `size` | string | `sm`, `default`, `lg` | `default` |
| `htmlFor` | string | Input ID to associate | - |

**Quick Examples**:
```tsx
<Label htmlFor="email" required>Email</Label>
<Label htmlFor="bio" optional>Bio</Label>
```

---

## 📝 Textarea

**Import**: `import { Textarea } from '@/components/ui/textarea';`

| Prop | Type | Options | Default |
|------|------|---------|---------|
| `variant` | string | `default`, `filled`, `outlined` | `default` |
| `state` | string | `default`, `error`, `success` | `default` |
| `autoResize` | boolean | Auto-grow height | `false` |
| `showCharCount` | boolean | Show character count | `false` |
| `maxLength` | number | Max characters | - |

**Quick Examples**:
```tsx
<Textarea placeholder="Basic textarea" />
<Textarea autoResize placeholder="Auto-resize" />
<Textarea showCharCount maxLength={500} />
```

---

## ☑️ Checkbox

**Import**: `import { Checkbox, CheckboxWithLabel, CheckboxGroup } from '@/components/ui/checkbox';`

| Prop | Type | Options | Default |
|------|------|---------|---------|
| `size` | string | `sm`, `default`, `lg` | `default` |
| `indeterminate` | boolean | Indeterminate state | `false` |

**Quick Examples**:
```tsx
<Checkbox id="terms" />
<CheckboxWithLabel label="Accept terms" />
<CheckboxWithLabel
  label="Notifications"
  description="Get email updates"
/>

<CheckboxGroup orientation="vertical">
  <CheckboxWithLabel label="Option 1" />
  <CheckboxWithLabel label="Option 2" />
</CheckboxGroup>
```

---

## 🔘 Radio Group

**Import**: `import { RadioGroup, RadioGroupItem, RadioCard, RadioWithLabel } from '@/components/ui/radio-group';`

| Prop | Type | Options | Default |
|------|------|---------|---------|
| `variant` | string | `default`, `cards` | `default` |
| `layout` | string | `vertical`, `horizontal` | `vertical` |
| `size` | string | `sm`, `default`, `lg` | `default` |

**Quick Examples**:
```tsx
// Basic
<RadioGroup defaultValue="yes">
  <RadioWithLabel value="yes" label="Yes" />
  <RadioWithLabel value="no" label="No" />
</RadioGroup>

// Card style (RSVP)
<RadioGroup variant="cards">
  <RadioCard
    value="going"
    icon={<Check />}
    label="Going"
    description="I'll be there"
  />
  <RadioCard
    value="not_going"
    icon={<X />}
    label="Can't Go"
  />
</RadioGroup>
```

---

## 📋 Select

**Import**: `import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';`

**Quick Example**:
```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Choose..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

## 📦 FormField

**Import**: `import { FormField } from '@/components/ui/form-field';`

| Prop | Type | Description |
|------|------|-------------|
| `label` | string | Field label |
| `htmlFor` | string | Input ID |
| `error` | string/boolean | Error message or state |
| `success` | string/boolean | Success message or state |
| `hint` | string | Help text |
| `required` | boolean | Show required indicator |
| `optional` | boolean | Show optional indicator |

**Quick Examples**:
```tsx
// Basic
<FormField label="Email" required>
  <Input type="email" />
</FormField>

// With error
<FormField label="Password" error="Too short">
  <Input type="password" state="error" />
</FormField>

// With success
<FormField label="Username" success="Available!">
  <Input state="success" />
</FormField>

// With hint
<FormField label="Bio" hint="Tell us about yourself">
  <Textarea />
</FormField>
```

---

## 🎨 Common Patterns

### Authentication Form
```tsx
<FormField label="Email" required>
  <Input
    leadingIcon={<Mail className="h-5 w-5" />}
    type="email"
    placeholder="you@example.com"
  />
</FormField>

<FormField label="Password" required>
  <Input
    leadingIcon={<Lock className="h-5 w-5" />}
    type="password"
    placeholder="Create a password"
  />
</FormField>

<CheckboxWithLabel label="Remember me" />
```

### RSVP Form
```tsx
<FormField label="Will you attend?" required>
  <RadioGroup variant="cards">
    <RadioCard
      value="going"
      icon={<Check className="h-5 w-5" />}
      label="Going"
    />
    <RadioCard
      value="maybe"
      icon={<HelpCircle className="h-5 w-5" />}
      label="Maybe"
    />
    <RadioCard
      value="not_going"
      icon={<X className="h-5 w-5" />}
      label="Can't Go"
    />
  </RadioGroup>
</FormField>
```

### Profile Settings
```tsx
<FormField label="Display Name" required>
  <Input placeholder="John Doe" />
</FormField>

<FormField label="Skill Level">
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Choose..." />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="beginner">Beginner</SelectItem>
      <SelectItem value="intermediate">Intermediate</SelectItem>
      <SelectItem value="advanced">Advanced</SelectItem>
    </SelectContent>
  </Select>
</FormField>

<FormField label="Availability" optional>
  <CheckboxGroup>
    <CheckboxWithLabel label="Weekday mornings" />
    <CheckboxWithLabel label="Weekday evenings" />
    <CheckboxWithLabel label="Weekends" />
  </CheckboxGroup>
</FormField>
```

---

## 🎯 Size Guide

| Component | Small (sm) | Default | Large (lg) |
|-----------|------------|---------|------------|
| Input | 36px | 44px | 52px |
| Textarea | - | 100px min | - |
| Checkbox | 16px | 24px | 28px |
| Radio | 16px | 24px | 28px |
| Select | - | 44px | - |

---

## 🎨 State Colors

| State | Border | Ring | Background |
|-------|--------|------|------------|
| Default | neutral-300 | maroon-700 | white → neutral-50 |
| Error | error-500 | error-500 | white |
| Success | success-500 | success-500 | white |
| Disabled | neutral-300 | - | white (50% opacity) |

---

## ♿ Accessibility Checklist

When using form components:

- [ ] All inputs have associated labels
- [ ] Required fields marked with `required` prop
- [ ] Error messages are descriptive
- [ ] Tab order is logical
- [ ] Focus states are visible
- [ ] Form can be submitted with keyboard
- [ ] Screen reader announces errors
- [ ] Hint text provides guidance

---

## 🔥 Pro Tips

1. **Always wrap inputs in FormField** - It handles spacing, labels, and errors automatically
2. **Use RadioCard for important choices** - Much clearer than basic radio buttons
3. **Add icons to inputs** - Visual cues improve usability
4. **Provide helpful error messages** - Tell users how to fix the problem
5. **Use autoResize on Textarea** - Better UX than fixed height
6. **Show character counts** - Helps users stay within limits
7. **Group related checkboxes** - Use CheckboxGroup for better organization
8. **Mark optional fields** - Reduces user anxiety about required info

---

## 📚 Full Documentation

- **Complete API**: See `docs/FORM_SYSTEM.md`
- **Live Examples**: See `docs/form-examples.tsx`
- **Implementation**: See `docs/FORM_IMPLEMENTATION_SUMMARY.md`
