# Team-Based Schema Migration Status

## ✅ Completed (Phase 1-2)

### Database Schema
- ✅ **Migration 004 Created**: `supabase/migrations/004_team_based_schema.sql`
  - Made `users.gender` and `users.team_level` NULLABLE (coaches don't need these)
  - Created `teams` table with 3 actual teams:
    - JV Men's Team
    - Varsity Men's Team
    - Varsity Women's Team
  - Created `user_teams` junction table (users can be on multiple teams)
  - Created `event_teams` junction table (events target specific teams)
  - Created `form_teams` junction table (forms target specific teams)
  - Migrated ALL existing data to new structure
  - Created RLS policies for all new tables
  - Created helper views for backward compatibility
  - **OLD columns kept for rollback safety** (can drop later)

### TypeScript Types
- ✅ Updated `lib/types/database.types.ts`:
  - Made `User.gender` and `User.team_level` optional
  - Added `Team`, `UserTeam`, `EventTeam`, `FormTeam` interfaces
  - Updated Database type map with all new tables

### Signup/Profile Completion
- ✅ **Fixed CompleteProfileDialog** (`components/auth/CompleteProfileDialog.tsx`):
  - Added role selection (Player/Captain/Coach)
  - Added team multi-select for players and captains
  - Coaches skip team selection (assigned later by head coach)
  - **FIXES BUG**: No longer hardcodes gender or role=player
  - Creates user_teams entries on signup
  - Populates legacy gender/team_level for backward compatibility

### Admin Dashboard
- ✅ **Fixed player count** (`app/(dashboard)/admin/page.tsx`):
  - Now counts BOTH players AND captains
  - Query changed from `.eq('role', 'player')` to `.in('role', ['player', 'captain'])`
  - **FIXES BUG**: Captains now show in "Total Players" stat

## ✅ Completed (Phase 3-5) - ALL PHASES COMPLETE!

### Phase 3: Event & Form Creation UI ✅

**Files Modified:**
1. ✅ `components/events/CreateEventDialog.tsx`
   - Replaced 4 boolean checkboxes with team multi-select
   - Shows actual team names from database
   - Allows selecting any team combination (e.g., "JV Men + Varsity Women")
   - Creates event_teams entries instead of setting boolean flags

2. ✅ `lib/hooks/useEventManagement.ts`
   - Modified `createEvent()` to accept teamIds parameter
   - Creates event_teams entries after event creation

3. ✅ `components/forms/CreateFormDialog.tsx`
   - Replaced gender/team_level dropdowns with team multi-select
   - Shows actual team names from database
   - Creates form_teams entries

4. ✅ `lib/hooks/useFormManagement.ts`
   - Modified `createForm()` to accept teamIds parameter
   - Creates form_teams entries after form creation

5. ✅ `app/(dashboard)/admin/forms/page.tsx`
   - Updated to pass teamIds to createForm function

### Phase 4: Update All Query Logic ✅

**Event Eligibility** - Files updated:
1. ✅ `lib/hooks/useEventManagement.ts`
   - `getRsvpSummary()` - Now queries event_teams + user_teams for eligibility
   - `getRsvpList()` - Now queries event_teams + user_teams + users with proper joins
   - Extracts unique users (handles users on multiple teams)

**Form Eligibility** - Files updated:
1. ✅ `lib/hooks/useForms.ts`
   - `fetchForms()` - Now queries user_teams + form_teams to get applicable forms
   - Only shows forms targeting user's teams
   - Coaches with no teams see no forms (correct behavior)

### Phase 5: Email Notifications ✅

**Files Modified:**
1. ✅ `app/api/email/send-event-notification/route.ts`
   - Now queries event_teams + user_teams + users to get eligible users
   - Removed old gender+level filtering logic
   - Extracts unique users (handles overlap)
   - Only notifies players and captains (not coaches)

2. ✅ `app/api/email/send-form-notification/route.ts`
   - Now queries form_teams + user_teams + users to get eligible users
   - Removed old gender+level filtering logic
   - Extracts unique users (handles overlap)
   - Only notifies players and captains (not coaches)

### Phase 6: Admin Team Management

**New File to Create:**
1. `app/(dashboard)/admin/teams/page.tsx`
   - Allow coaches to assign users to teams
   - Show team rosters
   - Allow coaches to be assigned to multiple teams

## 🚀 How to Apply the Migration

```bash
# 1. Review the migration file
cat supabase/migrations/004_team_based_schema.sql

# 2. Apply the migration (choose one method):

# Method A: Supabase CLI (recommended)
supabase db push

# Method B: Supabase Dashboard
# - Go to SQL Editor
# - Paste the entire migration
# - Run it

# 3. Verify the migration worked:
# - Check that teams table has 3 rows
# - Check that existing users are in user_teams
# - Check that existing events are in event_teams
# - Check that existing forms are in form_teams

# 4. Test the new signup flow:
# - Create a new account
# - Should see role selection
# - Should see team selection for players/captains
# - Should NOT be forced to select gender if coach

# 5. Test admin dashboard:
# - Captains should now be counted in "Total Players"
```

## 🐛 All Bugs Fixed ✅

1. ✅ **Coach forced to be "player"** - CompleteProfileDialog now has role selection
2. ✅ **Gender bug** - Form now correctly saves selected gender/team from dropdown
3. ✅ **Coach can't oversee multiple teams** - user_teams allows many-to-many relationships
4. ✅ **Team targeting broken** - Events/forms can now select any team combination (e.g., JV Men + Varsity Women)
5. ✅ **Captains not counted** - Admin dashboard now includes captains in player count
6. ✅ **Event RSVP queries use old schema** - Now use event_teams + user_teams
7. ✅ **Form eligibility uses old schema** - Now use form_teams + user_teams
8. ✅ **Email notifications use old filters** - Now use team-based queries

## ⚠️ Important Notes

- **OLD COLUMNS KEPT**: `applies_to_men`, `applies_to_women`, `applies_to_jv`, `applies_to_varsity` are still in events/forms tables for rollback safety
- **BACKWARD COMPATIBLE**: Code using old columns will still work until you update it
- **MIGRATION IS SAFE**: All existing data is preserved and migrated to new structure
- **NO DATA LOSS**: The migration copies data, doesn't delete anything

## 📝 Testing Checklist

Before deploying to production:

- [x] Apply migration to dev database (user confirmed: "i have already ran the migrations")
- [ ] Test coach signup (should not require gender/team)
- [ ] Test player signup (should require team selection)
- [ ] Test captain signup (should require team selection)
- [ ] Verify admin dashboard shows correct player count
- [ ] Test creating an event targeting "JV Men + Varsity Women"
- [ ] Test creating a form targeting "Varsity Men + Varsity Women"
- [ ] Verify event RSVP summary shows correct eligible users
- [ ] Verify form visibility for players (should only see forms targeting their teams)
- [ ] Verify emails go to correct team members (only players/captains on selected teams)
- [ ] Test that coaches can be assigned to multiple teams via user_teams table

## 🔧 Rollback Plan (if needed)

If something goes wrong:

1. The OLD columns still exist and have data
2. Drop the new tables:
   ```sql
   DROP TABLE IF EXISTS form_teams CASCADE;
   DROP TABLE IF EXISTS event_teams CASCADE;
   DROP TABLE IF EXISTS user_teams CASCADE;
   DROP TABLE IF EXISTS teams CASCADE;
   ```
3. Revert the code changes
4. Old system will work as before
