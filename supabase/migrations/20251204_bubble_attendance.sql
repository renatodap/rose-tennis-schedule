-- Bubble practice attendance tracking
CREATE TABLE IF NOT EXISTS bubble_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  practice_date date NOT NULL,
  status text NOT NULL CHECK (status IN ('confirmed', 'declined')),
  location text NOT NULL CHECK (location IN ('bubble', 'src')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, practice_date)
);

-- Enable RLS
ALTER TABLE bubble_attendance ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all attendance records
CREATE POLICY "Users can read all attendance"
  ON bubble_attendance FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Users can insert/update their own attendance
CREATE POLICY "Users can manage own attendance"
  ON bubble_attendance FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Index for fast lookups by date
CREATE INDEX idx_bubble_attendance_date ON bubble_attendance(practice_date);
CREATE INDEX idx_bubble_attendance_user ON bubble_attendance(user_id);
