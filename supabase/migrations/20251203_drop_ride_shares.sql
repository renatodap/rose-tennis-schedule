-- Drop ride sharing feature tables
-- This migration removes the carpooling/ride sharing coordination system
-- as part of codebase cleanup to focus on core tennis team features

-- Drop ride_requests first (has FK to ride_offers)
DROP TABLE IF EXISTS ride_requests CASCADE;

-- Drop ride_offers table
DROP TABLE IF EXISTS ride_offers CASCADE;
