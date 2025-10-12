-- Rose-Hulman Tennis Team Availability App - Row Level Security Policies
-- Migration 002: RLS Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_blockers ENABLE ROW LEVEL SECURITY;
ALTER TABLE one_time_blockers ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is coach or captain
CREATE OR REPLACE FUNCTION is_coach_or_captain(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users
        WHERE id = user_id
        AND role IN ('coach', 'captain')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is coach
CREATE OR REPLACE FUNCTION is_coach(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users
        WHERE id = user_id
        AND role = 'coach'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if event applies to user
CREATE OR REPLACE FUNCTION event_applies_to_user(event_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_record RECORD;
    event_record RECORD;
BEGIN
    SELECT gender, team_level INTO user_record FROM users WHERE id = user_id;
    SELECT applies_to_men, applies_to_women, applies_to_jv, applies_to_varsity
    INTO event_record FROM events WHERE id = event_id;

    -- Check gender match
    IF user_record.gender = 'men' AND NOT event_record.applies_to_men THEN
        RETURN FALSE;
    END IF;
    IF user_record.gender = 'women' AND NOT event_record.applies_to_women THEN
        RETURN FALSE;
    END IF;

    -- Check team level match (if user has a team level)
    IF user_record.team_level IS NOT NULL THEN
        IF user_record.team_level = 'jv' AND NOT event_record.applies_to_jv THEN
            RETURN FALSE;
        END IF;
        IF user_record.team_level = 'varsity' AND NOT event_record.applies_to_varsity THEN
            RETURN FALSE;
        END IF;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if form applies to user
CREATE OR REPLACE FUNCTION form_applies_to_user(form_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_record RECORD;
    form_record RECORD;
BEGIN
    SELECT gender, team_level INTO user_record FROM users WHERE id = user_id;
    SELECT applies_to_men, applies_to_women, applies_to_jv, applies_to_varsity
    INTO form_record FROM forms WHERE id = form_id;

    -- Check gender match
    IF user_record.gender = 'men' AND NOT form_record.applies_to_men THEN
        RETURN FALSE;
    END IF;
    IF user_record.gender = 'women' AND NOT form_record.applies_to_women THEN
        RETURN FALSE;
    END IF;

    -- Check team level match (if user has a team level)
    IF user_record.team_level IS NOT NULL THEN
        IF user_record.team_level = 'jv' AND NOT form_record.applies_to_jv THEN
            RETURN FALSE;
        END IF;
        IF user_record.team_level = 'varsity' AND NOT form_record.applies_to_varsity THEN
            RETURN FALSE;
        END IF;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- USERS TABLE POLICIES
-- ============================================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- Coaches and captains can read all users
CREATE POLICY "Coaches and captains can read all users"
    ON users FOR SELECT
    USING (is_coach_or_captain(auth.uid()));

-- Users can update their own profile (except role and team_level)
CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND
        role = (SELECT role FROM users WHERE id = auth.uid()) AND
        team_level = (SELECT team_level FROM users WHERE id = auth.uid())
    );

-- Coaches can update any user's team_level
CREATE POLICY "Coaches can update team levels"
    ON users FOR UPDATE
    USING (is_coach(auth.uid()));

-- New users can insert their profile (handled by auth trigger)
CREATE POLICY "Users can insert own profile"
    ON users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================================
-- CLASS SCHEDULES POLICIES
-- ============================================================

-- Users can read their own schedules
CREATE POLICY "Users can read own schedules"
    ON class_schedules FOR SELECT
    USING (auth.uid() = user_id);

-- Coaches and captains can read all schedules
CREATE POLICY "Coaches and captains can read all schedules"
    ON class_schedules FOR SELECT
    USING (is_coach_or_captain(auth.uid()));

-- Users can manage their own schedules
CREATE POLICY "Users can insert own schedules"
    ON class_schedules FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules"
    ON class_schedules FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules"
    ON class_schedules FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- RECURRING BLOCKERS POLICIES
-- ============================================================

CREATE POLICY "Users can read own recurring blockers"
    ON recurring_blockers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Coaches and captains can read all recurring blockers"
    ON recurring_blockers FOR SELECT
    USING (is_coach_or_captain(auth.uid()));

CREATE POLICY "Users can insert own recurring blockers"
    ON recurring_blockers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recurring blockers"
    ON recurring_blockers FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recurring blockers"
    ON recurring_blockers FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- ONE-TIME BLOCKERS POLICIES
-- ============================================================

CREATE POLICY "Users can read own one-time blockers"
    ON one_time_blockers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Coaches and captains can read all one-time blockers"
    ON one_time_blockers FOR SELECT
    USING (is_coach_or_captain(auth.uid()));

CREATE POLICY "Users can insert own one-time blockers"
    ON one_time_blockers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own one-time blockers"
    ON one_time_blockers FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own one-time blockers"
    ON one_time_blockers FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- PRACTICE AVAILABILITY POLICIES
-- ============================================================

CREATE POLICY "Users can read own practice availability"
    ON practice_availability FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Coaches and captains can read all practice availability"
    ON practice_availability FOR SELECT
    USING (is_coach_or_captain(auth.uid()));

CREATE POLICY "Users can insert own practice availability"
    ON practice_availability FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own practice availability"
    ON practice_availability FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own practice availability"
    ON practice_availability FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- EVENTS POLICIES
-- ============================================================

-- Users can read events that apply to them
CREATE POLICY "Users can read applicable events"
    ON events FOR SELECT
    USING (event_applies_to_user(id, auth.uid()));

-- Coaches and captains can read all events
CREATE POLICY "Coaches and captains can read all events"
    ON events FOR SELECT
    USING (is_coach_or_captain(auth.uid()));

-- Coaches and captains can create events
CREATE POLICY "Coaches and captains can create events"
    ON events FOR INSERT
    WITH CHECK (is_coach_or_captain(auth.uid()) AND auth.uid() = created_by);

-- Coaches and captains can update events
CREATE POLICY "Coaches and captains can update events"
    ON events FOR UPDATE
    USING (is_coach_or_captain(auth.uid()));

-- Coaches and captains can delete events
CREATE POLICY "Coaches and captains can delete events"
    ON events FOR DELETE
    USING (is_coach_or_captain(auth.uid()));

-- ============================================================
-- EVENT RESPONSES POLICIES
-- ============================================================

-- Users can read their own responses
CREATE POLICY "Users can read own event responses"
    ON event_responses FOR SELECT
    USING (auth.uid() = user_id);

-- Coaches and captains can read all responses
CREATE POLICY "Coaches and captains can read all event responses"
    ON event_responses FOR SELECT
    USING (is_coach_or_captain(auth.uid()));

-- Users can create responses for events that apply to them
CREATE POLICY "Users can create event responses"
    ON event_responses FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        event_applies_to_user(event_id, auth.uid())
    );

-- Users can update their own responses
CREATE POLICY "Users can update own event responses"
    ON event_responses FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own responses
CREATE POLICY "Users can delete own event responses"
    ON event_responses FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- FORMS POLICIES
-- ============================================================

-- Users can read active forms that apply to them
CREATE POLICY "Users can read applicable forms"
    ON forms FOR SELECT
    USING (
        is_active = TRUE AND
        form_applies_to_user(id, auth.uid())
    );

-- Coaches and captains can read all forms
CREATE POLICY "Coaches and captains can read all forms"
    ON forms FOR SELECT
    USING (is_coach_or_captain(auth.uid()));

-- Coaches and captains can create forms
CREATE POLICY "Coaches and captains can create forms"
    ON forms FOR INSERT
    WITH CHECK (is_coach_or_captain(auth.uid()) AND auth.uid() = created_by);

-- Coaches and captains can update forms
CREATE POLICY "Coaches and captains can update forms"
    ON forms FOR UPDATE
    USING (is_coach_or_captain(auth.uid()));

-- Coaches and captains can delete forms
CREATE POLICY "Coaches and captains can delete forms"
    ON forms FOR DELETE
    USING (is_coach_or_captain(auth.uid()));

-- ============================================================
-- FORM RESPONSES POLICIES
-- ============================================================

-- Users can read their own form responses
CREATE POLICY "Users can read own form responses"
    ON form_responses FOR SELECT
    USING (auth.uid() = user_id);

-- Coaches and captains can read all form responses
CREATE POLICY "Coaches and captains can read all form responses"
    ON form_responses FOR SELECT
    USING (is_coach_or_captain(auth.uid()));

-- Users can create responses for forms that apply to them
CREATE POLICY "Users can create form responses"
    ON form_responses FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        form_applies_to_user(form_id, auth.uid()) AND
        EXISTS (SELECT 1 FROM forms WHERE id = form_id AND is_active = TRUE)
    );

-- Users can update their own responses (before due date)
CREATE POLICY "Users can update own form responses"
    ON form_responses FOR UPDATE
    USING (
        auth.uid() = user_id AND
        (
            SELECT due_date IS NULL OR due_date > NOW()
            FROM forms WHERE id = form_id
        )
    );

-- Users can delete their own responses (before due date)
CREATE POLICY "Users can delete own form responses"
    ON form_responses FOR DELETE
    USING (
        auth.uid() = user_id AND
        (
            SELECT due_date IS NULL OR due_date > NOW()
            FROM forms WHERE id = form_id
        )
    );
