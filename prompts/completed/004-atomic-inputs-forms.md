<objective>
Redesign all form inputs to be beautiful, accessible, and delightful to use.
Forms are critical: sign-in, profile updates, event creation, RSVP responses.
Every input should feel premium and provide clear feedback.
</objective>

<context>
Tennis team app with Bold Athletic design direction.
Forms are used for: Authentication, profile editing, event creation, form responses, schedule editing.

@components/ui/input.tsx - Current input
@components/ui/label.tsx - Current label
@components/ui/textarea.tsx - Current textarea
@components/ui/select.tsx - Current select
@components/ui/checkbox.tsx - Current checkbox
@components/ui/radio-group.tsx - Current radio
@lib/design-tokens.ts - Design tokens
</context>

<design_principles>
Premium form characteristics:
1. CLEAR FOCUS - Users always know where they are
2. INSTANT FEEDBACK - Validation states are immediate
3. GENEROUS TOUCH TARGETS - Mobile-first sizing
4. CONSISTENT RHYTHM - All inputs share visual language
5. ACCESSIBLE - Labels, errors, hints all properly connected
</design_principles>

<requirements>
1. TEXT INPUT (input.tsx):
   - Variants: default, filled, outlined
   - States: default, focus, error, success, disabled
   - Sizes: sm (36px), default (44px), lg (52px)
   - With leading/trailing icons
   - With prefix/suffix text
   - Clear button for clearable inputs
   - Focus ring with brand color
   - Error state with red border + error message
   - Subtle background on focus

2. LABEL (label.tsx):
   - Required indicator (subtle asterisk)
   - Optional indicator (gray text)
   - Proper association with inputs
   - Responsive sizing

3. TEXTAREA (textarea.tsx):
   - Auto-resize option
   - Character count display
   - Same states as input
   - Comfortable min-height

4. SELECT (select.tsx):
   - Custom styled dropdown
   - Search/filter for long lists
   - Multi-select variant
   - Clear visual distinction from input
   - Smooth open/close animation

5. CHECKBOX (checkbox.tsx):
   - Custom styled checkmark
   - Indeterminate state
   - Group layout component
   - Touch-friendly size (24px minimum)
   - Satisfying check animation

6. RADIO GROUP (radio-group.tsx):
   - Custom styled radio circles
   - Horizontal and vertical layouts
   - Card-style variant (for RSVP-like selections)
   - Clear selected state

7. FORM FIELD WRAPPER:
   - Create FormField component that combines:
   - Label + Input + Error message + Hint text
   - Proper spacing and alignment
   - Animated error state appearance
</requirements>

<implementation>
Modify each component file:
- Add variants using CVA where applicable
- Ensure consistent sizing across all inputs
- Add Framer Motion for focus animations
- Proper aria attributes for accessibility
- TypeScript types for all props
- Use design tokens consistently
</implementation>

<output>
Modify:
- `./components/ui/input.tsx`
- `./components/ui/label.tsx`
- `./components/ui/textarea.tsx`
- `./components/ui/select.tsx`
- `./components/ui/checkbox.tsx`
- `./components/ui/radio-group.tsx`
Create:
- `./components/ui/form-field.tsx` (wrapper component)
</output>

<examples>
```tsx
// Text input with icon
<Input
  leadingIcon={<Mail />}
  placeholder="Email address"
  size="lg"
/>

// Input with error
<FormField
  label="Email"
  error="Please enter a valid email"
  required
>
  <Input type="email" state="error" />
</FormField>

// Card-style radio for RSVP
<RadioGroup variant="cards">
  <RadioCard value="going" icon={<Check />}>Going</RadioCard>
  <RadioCard value="maybe" icon={<HelpCircle />}>Maybe</RadioCard>
  <RadioCard value="not_going" icon={<X />}>Not Going</RadioCard>
</RadioGroup>
```
</examples>

<verification>
Before declaring complete:
- All inputs have 44px minimum touch target
- Focus states are visible and on-brand
- Error states are clear but not jarring
- Labels are properly associated (accessibility)
- Tab order is logical
- Works with screen readers
</verification>
