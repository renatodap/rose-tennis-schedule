# Project Brief: Bubble Practice Confirmation System

## Vision

**Ultra-simple, mobile-first app** for Rose-Hulman tennis players to confirm attendance at winter bubble practice sessions. Nothing more, nothing less.

## The Problem

Coach Matt Wilson needs a dead-simple way to know who's coming to each bubble practice session (5-7 PM, 12 dates in Dec-Jan). Currently, there's no easy way for 20+ players to:
- See which dates are available
- Confirm or decline each session
- See who else is coming

## Core Requirements

### Practice Dates (Fixed)
**December 2024:** 8, 10, 12, 15, 17, 19
**January 2025:** 5, 7, 9, 12, 14, 16
**Time:** All sessions 5-7 PM

### Player Groups (Fixed)
**Bubble (Men):** Joao, Ervin, Ephraim, Tim, Chris, Renato, Matt, Eli, Andrew
**Bubble (Women):** Lia, Emerson, Addie, Katie, Julia, Nova, Camille, Paige, Autumn
**SRC (Men):** Andres, Dale, Stadler, Nick, Jayden, Leo, Burch, Eoin
**SRC (Women):** Isha, Abby, Brooke

### User Stories

1. **As a player**, I can see all practice dates at a glance
2. **As a player**, I can tap to confirm/decline each date
3. **As a player**, I can see who else is confirmed for each date
4. **As a player**, I can see my confirmation status clearly
5. **As a coach**, I can see attendance counts per date

## What We're Keeping

1. **Authentication** - Existing Microsoft sign-in works fine
2. **Profiles** - `users` table with basic info (name, email, gender)
3. **Design system** - Keep the existing maroon branding, cards, buttons

## What We're Removing (NUKE IT ALL)

- All database migrations (will handle separately)
- All pages EXCEPT profile page
- All business logic for:
  - Events
  - Matches
  - Forms
  - Schedule/availability tracking
  - Blockers
  - Admin features
  - Everything else

## Success Criteria

1. **Mobile-first** - Works beautifully on phone, good on desktop
2. **Instant clarity** - Open app → see all dates → see who's coming
3. **One-tap action** - Confirm or decline with single tap
4. **Consistent design** - Uses existing UI components properly
5. **Clean code** - Simple, readable, no over-engineering

## Technical Approach

### New Database Table
```sql
bubble_attendance (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  practice_date date,
  status text CHECK (status IN ('confirmed', 'declined')),
  location text CHECK (location IN ('bubble', 'src')),
  created_at timestamp,
  updated_at timestamp,
  UNIQUE(user_id, practice_date)
)
```

### New Pages

1. **Home/Dashboard** (`/`) - List of practice dates with attendance
2. **Date Detail** (`/practice/[date]`) - Detailed view of who's attending a specific date

### Key Components

1. **PracticeDateCard** - Shows date, count, my status
2. **AttendanceList** - Shows who's confirmed/declined
3. **ConfirmButton** - One-tap confirm/decline toggle

## Constraints

- Keep existing auth flow
- Keep profile page functional
- Keep existing design tokens/colors
- Mobile-first (responsive, touch-friendly)
- Must work offline (PWA is already set up)

## Out of Scope

- Admin panel (coach just looks at the app like everyone else)
- Notifications (not needed for 12 fixed dates)
- Calendar integration
- Any complexity beyond confirm/decline
