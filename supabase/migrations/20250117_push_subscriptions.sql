-- Migration: Add push_subscriptions table
-- Description: Stores PWA push notification subscriptions for users
-- Date: 2025-01-17

-- Create push_subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_push_subscriptions_user ON push_subscriptions(user_id);
CREATE INDEX idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Row Level Security (RLS) Policies
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON push_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert own subscriptions"
  ON push_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own subscriptions
CREATE POLICY "Users can delete own subscriptions"
  ON push_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Service role can manage all subscriptions (for cron job cleanup)
CREATE POLICY "Service role can manage subscriptions"
  ON push_subscriptions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Add comment
COMMENT ON TABLE push_subscriptions IS 'Stores PWA push notification subscriptions for real-time event reminders';
