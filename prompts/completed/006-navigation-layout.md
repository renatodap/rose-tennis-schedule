<objective>
Redesign the navigation and layout system to be mobile-first, gorgeous, and effortlessly intuitive.
Navigation is touched constantly - it must be perfect.
The layout should make users feel oriented and in control.
</objective>

<context>
Tennis team app with Bold Athletic design direction.
Current layout: Desktop sidebar, mobile hamburger + bottom nav.
Navigation items: Home, Schedule, Matches, Events, Profile, Admin.

@app/(dashboard)/layout.tsx - Current dashboard layout
@lib/design-tokens.ts - Design tokens
@lib/constants.ts - Brand colors

Key requirements:
- Mobile bottom nav is primary navigation (most usage)
- Desktop sidebar should feel premium, not generic
- Current user context visible at all times
- Smooth transitions between sections
</context>

<design_principles>
Premium navigation characteristics:
1. ALWAYS ORIENTED - Users know exactly where they are
2. THUMB REACHABLE - Mobile nav optimized for one-hand use
3. MINIMAL COGNITIVE LOAD - Icons + labels, clear hierarchy
4. SMOOTH TRANSITIONS - Section changes feel connected
5. CONTEXTUAL - Header shows relevant info for current section
</design_principles>

<requirements>
1. MOBILE BOTTOM NAVIGATION:
   - 5 items maximum (Home, Schedule, Matches, Events, Profile)
   - Active state: Filled icon, brand color, slight scale
   - Inactive state: Outlined icon, muted
   - Safe area padding for notched phones
   - Touch target: 48px minimum
   - Subtle haptic feedback feel (visual equivalent)
   - Add subtle background blur
   - Micro-animation on tap

2. DESKTOP SIDEBAR:
   - Fixed position, 240px-280px width
   - Brand logo/name at top
   - Navigation with icons + labels
   - Active item: Background highlight, left border accent
   - Hover states: Subtle background
   - User profile at bottom (avatar + name + quick actions)
   - Collapsible to icons-only (optional enhancement)
   - Premium feel: Subtle gradient or texture

3. TOP HEADER:
   - Mobile: Brand name + hamburger (or keep simple)
   - Desktop: Page title + user avatar dropdown
   - Sticky with backdrop blur
   - Context-aware: Shows relevant actions for page

4. PAGE TRANSITIONS:
   - Subtle fade between pages
   - Maintain scroll position when returning
   - Loading states that feel intentional

5. LAYOUT SPACING:
   - Generous padding (16px mobile, 24px tablet, 32px desktop)
   - Max content width (1200px) centered on large screens
   - Bottom padding for mobile nav

6. LOADING STATES:
   - Skeleton screens that match actual content
   - Brand-colored spinner
   - Smooth appearance/disappearance
</requirements>

<implementation>
Completely redesign `app/(dashboard)/layout.tsx`:
- Mobile-first approach
- Framer Motion for transitions
- Use new design tokens throughout
- Clean, well-organized component structure
- Proper TypeScript typing
- Accessibility: proper landmarks, focus management
</implementation>

<output>
Modify: `./app/(dashboard)/layout.tsx`
Create:
- `./components/navigation/BottomNav.tsx` - Mobile bottom navigation
- `./components/navigation/Sidebar.tsx` - Desktop sidebar
- `./components/navigation/Header.tsx` - Top header bar
- `./components/navigation/NavItem.tsx` - Reusable nav item
</output>

<examples>
```tsx
// Bottom nav item with animation
<NavItem
  href="/events"
  icon={<Calendar />}
  activeIcon={<CalendarFilled />}
  label="Events"
  isActive={pathname === '/events'}
/>

// Sidebar with user footer
<Sidebar>
  <SidebarHeader>
    <Logo />
  </SidebarHeader>
  <SidebarNav>
    {navItems.map(item => <NavItem key={item.href} {...item} />)}
  </SidebarNav>
  <SidebarFooter>
    <UserMenu user={profile} />
  </SidebarFooter>
</Sidebar>
```
</examples>

<verification>
Before declaring complete:
- Bottom nav is comfortable for thumb reach
- Active states are unmistakably clear
- Page transitions are smooth (<300ms)
- Layout works from 320px to 2560px
- Sidebar doesn't overlap content
- Focus indicators work for keyboard nav
</verification>
