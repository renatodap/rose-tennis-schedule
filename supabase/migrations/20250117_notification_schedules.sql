-- Migration: Add notification_schedules table
-- Description: Stores scheduled notifications for events (24hr and 7hr reminders)
-- Date: 2025-01-17

-- Create notification_schedules table
CREATE TABLE IF NOT EXISTS notification_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('24hr', '7hr', '2hr', '1hr')),
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient querying of unsent notifications
CREATE INDEX idx_notification_schedules_pending
  ON notification_schedules(scheduled_for, sent_at)
  WHERE sent_at IS NULL;

-- Create index for event_id lookups
CREATE INDEX idx_notification_schedules_event
  ON notification_schedules(event_id);

-- Create index for user_id lookups
CREATE INDEX idx_notification_schedules_user
  ON notification_schedules(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE notification_schedules ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notification_schedules
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can insert/update/delete notifications
CREATE POLICY "Service role can manage notifications"
  ON notification_schedules
  FOR ALL
  USING (auth.role() = 'service_role');

-- Add comment
COMMENT ON TABLE notification_schedules IS 'Stores scheduled email notifications for events (24hr, 7hr, 2hr, 1hr reminders)';
