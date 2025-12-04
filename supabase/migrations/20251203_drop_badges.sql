-- Drop badges feature tables
-- This migration removes the gamification badges system
-- as part of codebase cleanup to focus on core tennis team features

-- Drop user_badges first (has FK to badge_definitions)
DROP TABLE IF EXISTS user_badges CASCADE;

-- Drop badge_definitions table
DROP TABLE IF EXISTS badge_definitions CASCADE;
