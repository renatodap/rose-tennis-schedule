/**
 * Migration: Add Match-Specific Fields to Events
 *
 * Purpose: Extend the events table to support tennis match data from Rose-Hulman athletics schedules
 * - Add 'match' type to event_type enum
 * - Add match-specific columns (opponent, home/away, result, conference flag)
 */

-- Step 1: Add 'match' to the event_type enum
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'match';

-- Step 2: Create home_away enum for match location type
CREATE TYPE home_away_type AS ENUM ('home', 'away', 'neutral');

-- Step 3: Add match-specific columns to events table
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS opponent VARCHAR(255),
  ADD COLUMN IF NOT EXISTS home_away home_away_type,
  ADD COLUMN IF NOT EXISTS match_result VARCHAR(50),
  ADD COLUMN IF NOT EXISTS is_conference_match BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS external_url VARCHAR(500);

-- Step 4: Create indexes for match-specific queries
CREATE INDEX IF NOT EXISTS idx_events_opponent ON events(opponent) WHERE opponent IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_home_away ON events(home_away) WHERE home_away IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_conference ON events(is_conference_match) WHERE is_conference_match = TRUE;

-- Step 5: Add comments for documentation
COMMENT ON COLUMN events.opponent IS 'Opposing team name for match events (e.g., "DePauw University")';
COMMENT ON COLUMN events.home_away IS 'Match location: home (at Rose-Hulman), away, or neutral site';
COMMENT ON COLUMN events.match_result IS 'Match result after completion (e.g., "W, 4-3" or "L, 5-0")';
COMMENT ON COLUMN events.is_conference_match IS 'True if this is a Heartland Collegiate Athletic Conference (HCAC) match';
COMMENT ON COLUMN events.external_url IS 'Link to external resources (live video, box score, recap, etc.)';
