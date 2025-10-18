/**
 * Migration: Backfill Missing Event Teams
 *
 * Problem: Events created after migration 004 might still be using the old
 * applies_to_* flags without creating event_teams entries. This causes
 * events to be invisible to players because the RLS policies use event_teams.
 *
 * Solution: Find all events missing event_teams entries and create them
 * based on the applies_to_* flags.
 */

-- Insert missing event_teams entries for events that have the old flags
-- but no event_teams entries
INSERT INTO event_teams (event_id, team_id)
SELECT DISTINCT
    e.id as event_id,
    t.id as team_id
FROM events e
CROSS JOIN teams t
WHERE
    -- Only process events that don't already have event_teams entries
    NOT EXISTS (
        SELECT 1 FROM event_teams et
        WHERE et.event_id = e.id
    )
    AND (
        -- Match based on the old boolean flags
        (e.applies_to_men = TRUE AND t.gender = 'men') OR
        (e.applies_to_women = TRUE AND t.gender = 'women')
    )
    AND (
        (e.applies_to_jv = TRUE AND t.team_level = 'jv') OR
        (e.applies_to_varsity = TRUE AND t.team_level = 'varsity')
    )
ON CONFLICT DO NOTHING; -- In case some entries already exist

-- Log how many event_teams entries were created
DO $$
DECLARE
    events_without_teams INT;
    total_event_teams INT;
BEGIN
    -- Count events that had no teams
    SELECT COUNT(DISTINCT e.id) INTO events_without_teams
    FROM events e
    WHERE NOT EXISTS (
        SELECT 1 FROM event_teams et
        WHERE et.event_id = e.id
    );

    -- Count total event_teams after backfill
    SELECT COUNT(*) INTO total_event_teams
    FROM event_teams;

    RAISE NOTICE 'Backfill complete. Events without teams before: %, Total event_teams entries: %',
        events_without_teams, total_event_teams;
END $$;

-- Add a comment explaining this migration
COMMENT ON TABLE event_teams IS 'Links events to teams. Events without event_teams entries are invisible to all players.';
