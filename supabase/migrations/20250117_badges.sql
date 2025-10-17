-- Migration: Add Achievement Badge System
-- Description: Track and award achievement badges (both serious and funny)
-- Date: 2025-01-17

-- Badge definitions (predefined badges)
CREATE TABLE IF NOT EXISTS badge_definitions (
  id TEXT PRIMARY KEY,  -- e.g., 'perfect-attendance', 'ghost', etc.
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,  -- emoji or icon name
  category TEXT NOT NULL CHECK (category IN ('serious', 'funny', 'milestone')),
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'legendary')),
  criteria JSONB NOT NULL,  -- Flexible criteria for badge checking
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges (awarded badges)
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES badge_definitions(id) ON DELETE CASCADE,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress_data JSONB,  -- Track progress toward badge
  UNIQUE(user_id, badge_id)  -- Each badge once per user
);

-- Indexes
CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge ON user_badges(badge_id);
CREATE INDEX idx_user_badges_awarded ON user_badges(awarded_at DESC);
CREATE INDEX idx_badge_definitions_category ON badge_definitions(category);

-- RLS Policies
ALTER TABLE badge_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Anyone can view badge definitions
CREATE POLICY "Anyone can view badge definitions"
  ON badge_definitions FOR SELECT
  USING (true);

-- Anyone can view user badges (public achievements)
CREATE POLICY "Anyone can view user badges"
  ON user_badges FOR SELECT
  USING (true);

-- Only system (service role) can insert badges
CREATE POLICY "Service role can insert user badges"
  ON user_badges FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Insert predefined badges
INSERT INTO badge_definitions (id, name, description, icon, category, rarity, criteria) VALUES
  -- Serious Badges
  ('perfect-attendance', 'Perfect Attendance', 'Attended every practice this month', '🎯', 'serious', 'rare', '{"type": "attendance", "count": 30, "period": "month"}'),
  ('team-captain', 'Team Captain', 'Leadership role on the team', '👑', 'serious', 'legendary', '{"type": "role", "role": "captain"}'),
  ('early-bird', 'Early Bird', 'Always first to arrive at practice', '🌅', 'serious', 'common', '{"type": "arrival", "position": 1, "count": 5}'),
  ('comeback-king', 'Comeback King', 'Won a match after being down', '⚡', 'serious', 'rare', '{"type": "match_result", "comeback": true}'),
  ('practice-warrior', 'Practice Warrior', 'Attended 50 practices', '⚔️', 'milestone', 'rare', '{"type": "attendance", "count": 50}'),
  ('century-club', 'Century Club', 'Attended 100 practices', '💯', 'milestone', 'legendary', '{"type": "attendance", "count": 100}'),

  -- Funny Badges
  ('ghost', 'Ghost 👻', 'Flaked on 5+ events without RSVPing', '👻', 'funny', 'common', '{"type": "no_show", "count": 5}'),
  ('the-regular', 'The Regular', '100% RSVP rate (always responds)', '📅', 'funny', 'rare', '{"type": "rsvp_rate", "percent": 100, "min_events": 10}'),
  ('wildcard', 'Wildcard', 'Always clicks Maybe on RSVPs', '🎲', 'funny', 'common', '{"type": "maybe_streak", "count": 10}'),
  ('fashionably-late', 'Fashionably Late', 'Arrived late 10+ times', '⏰', 'funny', 'common', '{"type": "late_arrival", "count": 10}'),
  ('rain-man', 'Rain Man ☔', 'Only shows up when it rains', '☔', 'funny', 'rare', '{"type": "weather_pattern", "condition": "rain"}'),
  ('sunshine-only', 'Sunshine Only ☀️', 'Only shows up on perfect days', '☀️', 'funny', 'common', '{"type": "weather_pattern", "condition": "sunny"}'),
  ('court-jester', 'Court Jester', 'Brings the laughs to every practice', '🃏', 'funny', 'common', '{"type": "manual", "requires_nomination": true}'),
  ('night-owl', 'Night Owl', 'Prefers evening practices', '🦉', 'funny', 'common', '{"type": "time_preference", "time": "evening", "count": 15}'),
  ('hype-person', 'Hype Person', 'Always cheering teammates on', '📣', 'funny', 'rare', '{"type": "manual", "requires_nomination": true}'),
  ('streaker', 'The Streaker', 'Attended 10 practices in a row', '🔥', 'milestone', 'common', '{"type": "streak", "count": 10}'),
  ('social-butterfly', 'Social Butterfly', 'Challenged 20 different players', '🦋', 'funny', 'rare', '{"type": "challenges", "unique_opponents": 20}'),
  ('undefeated', 'Undefeated', 'Won 10 challenges in a row', '🏆', 'serious', 'legendary', '{"type": "win_streak", "count": 10}'),
  ('good-sport', 'Good Sport', 'Lost gracefully 5 times', '🤝', 'serious', 'common', '{"type": "losses_recorded", "count": 5}'),
  ('ride-share-hero', 'Ride Share Hero', 'Gave rides to 15+ teammates', '🚗', 'serious', 'rare', '{"type": "rides_given", "count": 15}')
ON CONFLICT (id) DO NOTHING;

-- Comments
COMMENT ON TABLE badge_definitions IS 'Predefined achievement badges';
COMMENT ON TABLE user_badges IS 'Badges awarded to users';
