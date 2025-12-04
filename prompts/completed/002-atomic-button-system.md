<objective>
Redesign the Button component to be world-class - the single most touched element in the app.
Every tap should feel satisfying. Every state should be crystal clear.
This button should make users WANT to interact with the app.
</objective>

<context>
Tennis team app with Bold Athletic design direction.
Mobile-first: buttons must be perfectly sized for thumbs (min 44px touch target).
Current button is basic shadcn/ui with minimal styling.

@components/ui/button.tsx - Current button implementation
@lib/design-tokens.ts - Design tokens (created in prompt 001)

Button usage contexts in this app:
- RSVP actions (Going, Maybe, Not Going) - emotional, colorful
- Form submissions (Save, Submit, Cancel) - action-oriented
- Navigation/dialogs (Open, Close, View Details) - subtle
- Destructive actions (Delete, Remove) - warning, cautious
</context>

<design_principles>
Premium button characteristics:
1. TACTILE FEEDBACK - Subtle scale/shadow changes on press
2. CLEAR AFFORDANCE - Obviously clickable, inviting
3. STATE CLARITY - Loading, disabled, active states unmistakable
4. SIZE HIERARCHY - Touch targets generous on mobile, refined on desktop
5. ICON HARMONY - Icons perfectly sized and aligned with text
</design_principles>

<requirements>
Create a comprehensive button system:

1. VARIANTS (visual style):
   - primary: Bold, brand color, main CTAs
   - secondary: Outlined, subtle, secondary actions
   - ghost: Transparent until hover, tertiary actions
   - destructive: Red-toned, dangerous actions
   - success: Green-toned, positive confirmations (Going)
   - warning: Amber-toned, cautionary (Maybe)
   - link: Text-only, inline actions

2. SIZES:
   - xs: Compact, icon-only viable (32px height)
   - sm: Tight spaces (36px height)
   - default: Standard actions (44px height - touch optimized)
   - lg: Primary CTAs (52px height)
   - xl: Hero actions (60px height)

3. STATES (every state must be styled):
   - default: Inviting, touchable
   - hover: Subtle lift/glow
   - focus: Visible focus ring (accessibility)
   - active/pressed: Subtle press-down feel
   - disabled: Obviously inactive, muted
   - loading: Spinner replaces content, prevents double-click

4. COMPOSITIONS:
   - Icon-only buttons (square, perfect circles for FABs)
   - Icon + text (left or right icon)
   - Full-width buttons (mobile CTAs)
   - Button groups (connected buttons for toggles)

5. MICRO-INTERACTIONS (Framer Motion):
   - Subtle scale on hover (1.02)
   - Press animation (0.98 scale)
   - Loading spinner rotation
   - Success/error color flash on action completion
</requirements>

<implementation>
Modify `components/ui/button.tsx`:
- Keep CVA (class-variance-authority) pattern
- Add all new variants and sizes
- Integrate Framer Motion for animations
- Add loading state with spinner
- Ensure proper TypeScript typing
- Add iconLeft, iconRight, isLoading props
- Use design tokens from lib/design-tokens.ts
</implementation>

<output>
Modify: `./components/ui/button.tsx`
</output>

<examples>
```tsx
// Primary CTA
<Button size="lg" className="w-full">Sign In</Button>

// RSVP buttons
<Button variant="success" size="default">Going</Button>
<Button variant="warning" size="default">Maybe</Button>
<Button variant="destructive" size="default">Not Going</Button>

// Icon button
<Button variant="ghost" size="icon"><Plus /></Button>

// Loading state
<Button isLoading>Saving...</Button>

// With icons
<Button iconLeft={<Calendar />}>Schedule</Button>
```
</examples>

<verification>
Before declaring complete:
- All touch targets are minimum 44px on mobile
- Hover/active states are visually distinct
- Loading state prevents interaction
- Focus ring is visible for keyboard navigation
- Works beautifully in both light context
- No layout shift when switching states
</verification>
