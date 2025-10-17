-- Migration: Add Challenge System
-- Description: Public match challenges where players can challenge each other
-- Date: 2025-01-17

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenger_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opponent_id UUID REFERENCES users(id) ON DELETE SET NULL,  -- null if open challenge
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('singles', 'doubles')),
  proposed_datetime TIMESTAMP WITH TIME ZONE,
  location TEXT,
  status TEXT NOT NULL CHECK (status IN ('open', 'accepted', 'completed', 'cancelled')) DEFAULT 'open',
  winner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  score TEXT,  -- e.g., "6-4, 7-5"
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- For doubles challenges - track all 4 players
CREATE TABLE IF NOT EXISTS challenge_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_side TEXT NOT NULL CHECK (team_side IN ('challenger_team', 'opponent_team')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)  -- Prevent duplicate entries
);

-- Indexes for performance
CREATE INDEX idx_challenges_challenger ON challenges(challenger_id);
CREATE INDEX idx_challenges_opponent ON challenges(opponent_id);
CREATE INDEX idx_challenges_status ON challenges(status);
CREATE INDEX idx_challenges_created_at ON challenges(created_at DESC);
CREATE INDEX idx_challenge_participants_challenge ON challenge_participants(challenge_id);
CREATE INDEX idx_challenge_participants_user ON challenge_participants(user_id);

-- RLS Policies
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;

-- Anyone can view all challenges (public board)
CREATE POLICY "Anyone can view challenges"
  ON challenges FOR SELECT
  USING (true);

-- Users can create challenges
CREATE POLICY "Users can create challenges"
  ON challenges FOR INSERT
  WITH CHECK (auth.uid() = challenger_id);

-- Users can update challenges they're involved in
CREATE POLICY "Participants can update challenges"
  ON challenges FOR UPDATE
  USING (
    auth.uid() = challenger_id
    OR auth.uid() = opponent_id
    OR EXISTS (
      SELECT 1 FROM challenge_participants
      WHERE challenge_participants.challenge_id = challenges.id
      AND challenge_participants.user_id = auth.uid()
    )
  );

-- Users can delete their own open challenges
CREATE POLICY "Challenger can delete own open challenges"
  ON challenges FOR DELETE
  USING (auth.uid() = challenger_id AND status = 'open');

-- Challenge participants policies
CREATE POLICY "Anyone can view participants"
  ON challenge_participants FOR SELECT
  USING (true);

-- Challenge creator can manage participants
CREATE POLICY "Challenge creator can manage participants"
  ON challenge_participants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM challenges
      WHERE challenges.id = challenge_participants.challenge_id
      AND challenges.challenger_id = auth.uid()
    )
  );

-- Comments
COMMENT ON TABLE challenges IS 'Public match challenges between players';
COMMENT ON TABLE challenge_participants IS 'Participants in doubles challenges';
