<objective>
Create stunning Badge and Avatar components - crucial for status indicators and user identity.
Badges show event types, RSVP status, user roles. Avatars represent team members.
These small elements have outsized impact on perceived quality.
</objective>

<context>
Tennis team app with Bold Athletic design direction.
Badge uses: Event types (mandatory/recommended/optional/match), RSVP status, user roles, notification counts.
Avatar uses: User profiles, attendee lists, admin user tables.

@components/ui/badge.tsx - Current badge
@components/ui/avatar.tsx - Current avatar
@components/events/AttendeeAvatars.tsx - Avatar group example
@lib/design-tokens.ts - Design tokens
</context>

<design_principles>
Premium indicator characteristics:
1. INSTANT RECOGNITION - Color/shape conveys meaning immediately
2. CONSISTENT SIZE - Badges align, avatars stack predictably
3. HIERARCHY - Some badges/avatars are more prominent than others
4. ACCESSIBILITY - Color is not the only indicator
</design_principles>

<requirements>
1. BADGE SYSTEM:
   Variants (semantic meaning):
   - default: Neutral gray
   - primary: Brand maroon
   - success: Green (Going, Available)
   - warning: Amber (Maybe, Recommended)
   - danger: Red (Mandatory, Not Going)
   - info: Blue (Match, Info)

   Styles:
   - solid: Filled background
   - soft: Lighter background, darker text
   - outline: Border only
   - dot: Tiny indicator dot

   Sizes:
   - xs: Tiny, for counts
   - sm: Compact inline
   - default: Standard
   - lg: Prominent

   Features:
   - With leading icon
   - With remove button (for tags)
   - Animated appearance
   - Pulse animation for attention

2. AVATAR SYSTEM:
   Sizes:
   - xs: 24px (tiny lists)
   - sm: 32px (compact)
   - default: 40px (standard)
   - lg: 48px (profile)
   - xl: 64px (hero)
   - 2xl: 96px (profile page)

   Features:
   - Fallback with initials
   - Status indicator (online dot)
   - Border for white backgrounds
   - Ring for selection state
   - Subtle shadow for depth

3. AVATAR GROUP:
   - Stacked overlapping layout
   - Max visible count with "+N" overflow
   - Hover to expand (optional)
   - Consistent overlap amount per size

4. USER PRESENCE:
   - Online: Green dot
   - Away: Amber dot
   - Offline: Gray dot
   - Busy: Red dot

5. MICRO-INTERACTIONS:
   - Badge pulse for new items
   - Avatar hover scale
   - Group expand animation
</requirements>

<implementation>
Modify:
- `components/ui/badge.tsx` - Complete redesign with variants
- `components/ui/avatar.tsx` - Add sizes, status, ring
Create:
- `components/ui/avatar-group.tsx` - Stacked avatar layout
</implementation>

<output>
Modify:
- `./components/ui/badge.tsx`
- `./components/ui/avatar.tsx`
Create:
- `./components/ui/avatar-group.tsx`
</output>

<examples>
```tsx
// Event type badges
<Badge variant="danger" style="soft">Mandatory</Badge>
<Badge variant="warning" style="soft">Recommended</Badge>
<Badge variant="success" style="soft">Optional</Badge>

// RSVP status with icon
<Badge variant="success" icon={<Check />}>Going</Badge>

// User avatar with status
<Avatar size="lg" status="online">
  <AvatarImage src={user.avatar} />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Attendee group
<AvatarGroup max={5} size="sm">
  {attendees.map(a => <Avatar key={a.id}>...</Avatar>)}
</AvatarGroup>
// Shows: [Avatar][Avatar][Avatar][Avatar][Avatar][+12]
```
</examples>

<verification>
Before declaring complete:
- Badge colors pass contrast requirements
- Avatars have proper fallbacks
- Avatar groups handle overflow gracefully
- Status dots are visible at all sizes
- Animations are subtle and performant
</verification>
