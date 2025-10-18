/**
 * Migration: Fix Event RLS Policies for Team-Based System
 *
 * Problem: Current RLS policies use the old event_applies_to_user function
 * which checks deprecated applies_to_* columns. After migration 004, events
 * use the event_teams table for targeting, but RLS policies weren't updated.
 *
 * Solution: Update RLS policies and helper functions to use event_teams table
 */

-- Drop old event RLS policies
DROP POLICY IF EXISTS "Users can read applicable events" ON events;
DROP POLICY IF EXISTS "Coaches and captains can read all events" ON events;

-- Update the event_applies_to_user function to work with event_teams
CREATE OR REPLACE FUNCTION event_applies_to_user(event_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_team_ids UUID[];
    event_team_ids UUID[];
BEGIN
    -- If user is coach or captain, they can see all events
    IF is_coach_or_captain(user_id) THEN
        RETURN TRUE;
    END IF;

    -- Get user's team IDs
    SELECT ARRAY_AGG(team_id) INTO user_team_ids
    FROM user_teams
    WHERE user_teams.user_id = event_applies_to_user.user_id;

    -- If user has no teams, they can't see any events
    IF user_team_ids IS NULL OR array_length(user_team_ids, 1) IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Get event's target team IDs
    SELECT ARRAY_AGG(team_id) INTO event_team_ids
    FROM event_teams
    WHERE event_teams.event_id = event_applies_to_user.event_id;

    -- If event has no target teams, no one can see it (this shouldn't happen)
    IF event_team_ids IS NULL OR array_length(event_team_ids, 1) IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Check if user's teams overlap with event's teams
    RETURN user_team_ids && event_team_ids; -- && is the array overlap operator
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate event RLS policies using the updated function
CREATE POLICY "Users can read applicable events"
    ON events FOR SELECT
    USING (event_applies_to_user(id, auth.uid()));

-- Coaches and captains can still read all events (redundant with updated function but kept for clarity)
CREATE POLICY "Coaches and captains can read all events"
    ON events FOR SELECT
    USING (is_coach_or_captain(auth.uid()));

-- Add helpful comment
COMMENT ON FUNCTION event_applies_to_user IS 'Checks if an event applies to a user based on their team memberships (event_teams and user_teams tables)';
