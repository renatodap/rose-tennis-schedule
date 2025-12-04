-- Drop challenges feature tables
-- This migration removes the player-vs-player challenge match system
-- as part of codebase cleanup to focus on core tennis team features

-- Drop challenge_participants first (has FK to challenges)
DROP TABLE IF EXISTS challenge_participants CASCADE;

-- Drop challenges table
DROP TABLE IF EXISTS challenges CASCADE;
