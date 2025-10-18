# URGENT FIX: Events Not Visible to Users

## The Problem

Your friends can't see events because:

1. **Events are missing `event_teams` entries** - The events you created have the old `applies_to_men/women/jv/varsity` flags set, but they don't have corresponding entries in the `event_teams` table.

2. **RLS policies were outdated** - The Row Level Security policies were still checking the old flags through the `event_applies_to_user` function, which doesn't work correctly with the new team-based system.

## The Solution (3 Migrations Required)

You need to run **3 migrations** in this order:

### 1. Fix RLS Policies (CRITICAL)
**File**: `supabase/migrations/20251017_fix_event_rls_policies.sql`

This updates the database security policies to use the new `event_teams` table instead of the deprecated `applies_to_*` columns.

### 2. Backfill Missing Event Teams (CRITICAL)
**File**: `supabase/migrations/20251017_backfill_event_teams.sql`

This creates `event_teams` entries for all existing events that are missing them, including the 4 events you mentioned.

### 3. Add Match Fields (for tennis schedule feature)
**File**: `supabase/migrations/20251017_match_events.sql`

This adds match-specific fields to the events table (opponent, home/away, etc.).

---

## How to Apply the Migrations

### Option A: Using Supabase CLI (Recommended)

```bash
# 1. Make sure you're in the project directory
cd rose-available-tennis

# 2. Apply all pending migrations
npx supabase db push

# Or apply them one by one:
npx supabase migration up --db-url "your-supabase-db-url"
```

### Option B: Using Supabase Dashboard (Easier)

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Run each migration file in order:

**FIRST - Run this (Fix RLS Policies):**
```sql
-- Copy and paste the entire contents of:
-- supabase/migrations/20251017_fix_event_rls_policies.sql
```

**SECOND - Run this (Backfill Event Teams):**
```sql
-- Copy and paste the entire contents of:
-- supabase/migrations/20251017_backfill_event_teams.sql
```

**THIRD - Run this (Add Match Fields):**
```sql
-- Copy and paste the entire contents of:
-- supabase/migrations/20251017_match_events.sql
```

---

## Verify the Fix

After running the migrations, verify they worked:

### Check if event_teams were created:
```sql
SELECT
    e.title,
    e.created_at,
    COUNT(et.id) as team_count,
    STRING_AGG(t.name, ', ') as teams
FROM events e
LEFT JOIN event_teams et ON et.event_id = e.id
LEFT JOIN teams t ON t.id = et.team_id
WHERE e.created_by = '2ed1b8be-6dba-429e-bd57-fc506e3e4465'
GROUP BY e.id, e.title, e.created_at
ORDER BY e.created_at DESC;
```

You should see each event linked to teams (e.g., "JV Men's Team, Varsity Men's Team").

### Check RLS function:
```sql
-- Test if a user can see an event
SELECT event_applies_to_user(
    '7e437ad2-061b-4bd0-96d1-15f733c66640'::uuid,  -- event ID
    'some-user-id'::uuid  -- replace with actual user ID
);
```

Should return `true` if the user is on a team targeted by the event.

---

## Why This Happened

The issue occurred because:

1. **Migration 004** introduced the new team-based system (`event_teams` table) and migrated existing events
2. **But** the `CreateEventDialog` component was still using the old `applies_to_*` flags
3. When you created new events after migration 004, they set the flags but didn't create `event_teams` entries
4. The RLS policies were never updated to use the new system

## Preventing This in the Future

The fix is already in place:
- ✅ `CreateEventDialog` now requires selecting teams and creates `event_teams` entries
- ✅ `ScheduleImportDialog` (new match import) creates `event_teams` entries
- ✅ RLS policies now use `event_teams` table
- ✅ The backfill migration fixes all existing broken events

---

## Quick Test

After applying migrations, have your friends:

1. **Log out and log back in** (to clear any cached queries)
2. Go to the **Events** page
3. They should now see all 4 events:
   - Captain Lead Practice (Oct 17)
   - Optional Practice (Oct 13)
   - Optional Practice (Oct 14)
   - SRC Conditioning (Oct 15)

---

## If Events Still Don't Show

If events still don't appear after migrations:

### 1. Check user's team membership
```sql
SELECT
    u.first_name,
    u.last_name,
    t.name as team_name,
    t.gender,
    t.team_level
FROM users u
JOIN user_teams ut ON ut.user_id = u.id
JOIN teams t ON t.id = ut.team_id
WHERE u.email = 'friend@example.com';  -- replace with friend's email
```

If your friend isn't on any teams, add them:
```sql
INSERT INTO user_teams (user_id, team_id)
VALUES (
    (SELECT id FROM users WHERE email = 'friend@example.com'),
    (SELECT id FROM teams WHERE name = 'JV Men''s Team')  -- or appropriate team
);
```

### 2. Check if events target the right teams
```sql
SELECT
    e.title,
    t.name as team_name
FROM events e
JOIN event_teams et ON et.event_id = e.id
JOIN teams t ON t.id = et.team_id
WHERE e.id = '7e437ad2-061b-4bd0-96d1-15f733c66640';
```

Should show which teams can see the event.

---

## Summary

**Run these 3 migrations in Supabase SQL Editor:**
1. `20251017_fix_event_rls_policies.sql` - Fixes security policies
2. `20251017_backfill_event_teams.sql` - Fixes existing events
3. `20251017_match_events.sql` - Adds match features

**Then tell your friends to refresh the page.**

That's it! Events should be visible immediately after the migrations run.
