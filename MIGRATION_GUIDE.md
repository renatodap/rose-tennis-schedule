# Database Migration Guide

This guide will help you run all necessary database migrations to fix event visibility and add tennis match schedules.

## Prerequisites

1. Access to your Supabase project dashboard
2. SQL Editor access in Supabase

## Migration Steps

Run these migrations **in order** in your Supabase SQL Editor:

### Step 1: Fix Event RLS Policies
**File:** `supabase/migrations/20251017_fix_event_rls_policies.sql`

**Purpose:** Updates Row Level Security policies to use the new team-based system instead of deprecated `applies_to_*` flags.

**Critical:** This fixes the bug where "my friends are telling me they cannot see any events that i created"

### Step 2: Add Match Event Support
**File:** `supabase/migrations/20251017_match_events.sql`

**Purpose:** Extends the events table with match-specific fields:
- `opponent` - opponent team name
- `home_away` - home/away/neutral venue
- `match_result` - match score/result
- `is_conference_match` - conference match flag
- `external_url` - link to live stream or box score

### Step 3: Backfill Event Teams
**File:** `supabase/migrations/20251017_backfill_event_teams.sql`

**Purpose:** Creates missing `event_teams` entries for all existing events based on their `applies_to_*` flags.

**Critical:** This ensures all existing events become visible to the correct teams.

### Step 4: Add Tennis Match Schedules
**File:** `supabase/migrations/20251017_add_tennis_matches.sql`

**Purpose:** Imports all 2025-26 tennis matches:
- **Women's Varsity:** 18 matches
- **Men's Varsity:** 20 matches
- **Men's JV:** 7 matches

**Total:** 45 tennis matches

## How to Run Migrations

1. **Open Supabase Dashboard**
   - Go to your Supabase project at https://supabase.com/dashboard

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar

3. **Run Each Migration**
   - For each migration file (in order):
     1. Click "New Query"
     2. Copy the entire contents of the migration file
     3. Paste into the SQL Editor
     4. Click "Run" (or press Ctrl+Enter)
     5. Verify "Success" message appears

4. **Verify Results**
   - After running all migrations:
   - Check the "Table Editor" → "events" table
   - You should see all 45 tennis matches
   - Check that your friends can now see events you created

## Troubleshooting

### If Migration Fails

**"duplicate key value violates unique constraint"**
- The migration may have already run
- Check the `events` table for existing matches
- Safe to skip if matches already exist

**"column already exists"**
- The schema migration may have already run
- Safe to skip to the next migration

**"function event_applies_to_user already exists"**
- The RLS policy migration may have already run
- Safe to skip

### Verify Event Visibility

After running migrations, test that events are visible:

1. Create a test event as a coach/captain
2. Check that players on the associated teams can see it
3. Ask your friends to check if they can see events now

## Match Schedule Details

### Women's Varsity (18 matches)
- Oct 4: vs Greenville (Homecoming) ✓ Completed
- Feb-Apr: Conference and non-conference matches
- Includes Florida trip (5 matches in Orlando)
- HCAC Tournament matches (TBA times - not imported)

### Men's Varsity (20 matches)
- Oct 4: vs Greenville (HCAC Ring Ceremony) ✓ Completed
- Feb-Apr: Conference and non-conference matches
- Includes Florida trip (5 matches in Orlando)
- Includes Rose-Hulman Tri-Match (Mar 28)
- HCAC Tournament matches (TBA times - not imported)

### Men's JV (7 matches)
- Sep 20: vs Wabash (L, 5-0) ✓ Completed
- Oct 8: vs Oakland City (L, 6-1) ✓ Completed
- Mar-Apr: 5 upcoming matches

## Next Steps

After running all migrations:

1. **Test the Matches Page**
   - Visit `/matches` in your app
   - Verify all matches are displayed
   - Check filtering by team (Varsity/JV, Men's/Women's)

2. **Test RSVP Functionality**
   - Players should be able to RSVP to matches
   - Coaches should see RSVP summaries

3. **Test Calendar Integration**
   - Matches should appear in the calendar view
   - Match events should have trophy icons
   - Home matches = green, Away = blue, Neutral = gray

4. **Remove Import Tool (Optional)**
   - Since matches are now in the database, you can remove the Schedule Import Dialog component if desired
   - Or keep it for future season updates

## Questions?

If you encounter issues running these migrations, check:
- Supabase logs for detailed error messages
- Ensure you have the necessary permissions
- Verify the database schema matches expectations
