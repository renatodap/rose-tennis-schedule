/**
 * Migration: Class Schedule Exceptions
 *
 * Adds a new table to track exceptions for recurring class schedules.
 * This allows users to mark specific dates when their recurring classes don't apply
 * (e.g., no class on a specific Monday due to a holiday or cancellation).
 */

-- Create class_schedule_exceptions table
CREATE TABLE IF NOT EXISTS class_schedule_exceptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_schedule_id UUID NOT NULL REFERENCES class_schedules(id) ON DELETE CASCADE,
  exception_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),

  -- Ensure a user can only have one exception per class per date
  UNIQUE(user_id, class_schedule_id, exception_date)
);

-- Create index for faster lookups
CREATE INDEX idx_class_schedule_exceptions_user_id ON class_schedule_exceptions(user_id);
CREATE INDEX idx_class_schedule_exceptions_class_schedule_id ON class_schedule_exceptions(class_schedule_id);
CREATE INDEX idx_class_schedule_exceptions_date ON class_schedule_exceptions(exception_date);

-- Add RLS policies
ALTER TABLE class_schedule_exceptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own exceptions
CREATE POLICY "Users can view their own class schedule exceptions"
  ON class_schedule_exceptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own exceptions
CREATE POLICY "Users can insert their own class schedule exceptions"
  ON class_schedule_exceptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own exceptions
CREATE POLICY "Users can update their own class schedule exceptions"
  ON class_schedule_exceptions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own exceptions
CREATE POLICY "Users can delete their own class schedule exceptions"
  ON class_schedule_exceptions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all exceptions
CREATE POLICY "Admins can view all class schedule exceptions"
  ON class_schedule_exceptions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('coach', 'captain')
    )
  );
