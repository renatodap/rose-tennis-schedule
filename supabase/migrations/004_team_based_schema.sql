/**
 * Migration: Team-Based Schema Refactor
 *
 * Problem: Current schema forces all users to have gender+team_level, but:
 * - Coaches oversee multiple teams (not one gender/level)
 * - Can't target "JV Men + Varsity Women" without including non-existent "JV Women"
 * - No representation of actual teams that exist
 *
 * Solution: Create explicit team entities and many-to-many relationships
 */

-- Step 1: Make gender and team_level nullable (coaches don't have these)
ALTER TABLE users ALTER COLUMN gender DROP NOT NULL;
ALTER TABLE users ALTER COLUMN team_level DROP NOT NULL;

-- Step 2: Create teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    gender user_gender NOT NULL,
    team_level team_level NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Ensure unique combination of gender + team_level
    UNIQUE(gender, team_level)
);

-- Step 3: Create user_teams junction table (many-to-many)
CREATE TABLE user_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- A user can only be on each team once
    UNIQUE(user_id, team_id)
);

-- Step 4: Create event_teams junction table (many-to-many)
CREATE TABLE event_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- An event can only target each team once
    UNIQUE(event_id, team_id)
);

-- Step 5: Create form_teams junction table (many-to-many)
CREATE TABLE form_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- A form can only target each team once
    UNIQUE(form_id, team_id)
);

-- Step 6: Create indexes for performance
CREATE INDEX idx_user_teams_user_id ON user_teams(user_id);
CREATE INDEX idx_user_teams_team_id ON user_teams(team_id);
CREATE INDEX idx_event_teams_event_id ON event_teams(event_id);
CREATE INDEX idx_event_teams_team_id ON event_teams(team_id);
CREATE INDEX idx_form_teams_form_id ON form_teams(form_id);
CREATE INDEX idx_form_teams_team_id ON form_teams(team_id);
CREATE INDEX idx_teams_active ON teams(is_active);

-- Step 7: Add triggers for updated_at
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 8: Insert actual teams (based on real Rose-Hulman Tennis structure)
INSERT INTO teams (name, gender, team_level, is_active) VALUES
    ('JV Men''s Team', 'men', 'jv', TRUE),
    ('Varsity Men''s Team', 'men', 'varsity', TRUE),
    ('Varsity Women''s Team', 'women', 'varsity', TRUE);

-- Step 9: Migrate existing users to user_teams
-- For each user with gender and team_level, create a user_team entry
INSERT INTO user_teams (user_id, team_id)
SELECT
    u.id,
    t.id
FROM users u
INNER JOIN teams t ON u.gender = t.gender AND u.team_level = t.team_level
WHERE u.gender IS NOT NULL AND u.team_level IS NOT NULL AND u.role IN ('player', 'captain');

-- Step 10: Migrate existing events to event_teams
-- Convert boolean flags to team associations
INSERT INTO event_teams (event_id, team_id)
SELECT DISTINCT
    e.id,
    t.id
FROM events e
INNER JOIN teams t ON (
    (e.applies_to_men = TRUE AND t.gender = 'men') OR
    (e.applies_to_women = TRUE AND t.gender = 'women')
) AND (
    (e.applies_to_jv = TRUE AND t.team_level = 'jv') OR
    (e.applies_to_varsity = TRUE AND t.team_level = 'varsity')
);

-- Step 11: Migrate existing forms to form_teams
INSERT INTO form_teams (form_id, team_id)
SELECT DISTINCT
    f.id,
    t.id
FROM forms f
INNER JOIN teams t ON (
    (f.applies_to_men = TRUE AND t.gender = 'men') OR
    (f.applies_to_women = TRUE AND t.gender = 'women')
) AND (
    (f.applies_to_jv = TRUE AND t.team_level = 'jv') OR
    (f.applies_to_varsity = TRUE AND t.team_level = 'varsity')
);

-- Step 12: Add RLS policies for new tables

-- Teams table policies
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active teams"
    ON teams FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Coaches can manage teams"
    ON teams FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'coach'
        )
    );

-- User_teams policies
ALTER TABLE user_teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own team memberships"
    ON user_teams FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Coaches can view all team memberships"
    ON user_teams FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('coach', 'captain')
        )
    );

CREATE POLICY "Coaches can manage team memberships"
    ON user_teams FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'coach'
        )
    );

-- Event_teams policies
ALTER TABLE event_teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view event team assignments"
    ON event_teams FOR SELECT
    USING (TRUE);

CREATE POLICY "Coaches and captains can manage event team assignments"
    ON event_teams FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('coach', 'captain')
        )
    );

-- Form_teams policies
ALTER TABLE form_teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view form team assignments"
    ON form_teams FOR SELECT
    USING (TRUE);

CREATE POLICY "Coaches and captains can manage form team assignments"
    ON form_teams FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('coach', 'captain')
        )
    );

-- Step 13: Create helper views for backward compatibility

-- View to get all teams a user belongs to
CREATE OR REPLACE VIEW user_team_memberships AS
SELECT
    u.id as user_id,
    u.email,
    u.first_name,
    u.last_name,
    u.role,
    t.id as team_id,
    t.name as team_name,
    t.gender,
    t.team_level
FROM users u
INNER JOIN user_teams ut ON u.id = ut.user_id
INNER JOIN teams t ON ut.team_id = t.id
WHERE t.is_active = TRUE;

-- View to get all teams targeted by an event
CREATE OR REPLACE VIEW event_team_targets AS
SELECT
    e.id as event_id,
    e.title as event_title,
    t.id as team_id,
    t.name as team_name,
    t.gender,
    t.team_level
FROM events e
INNER JOIN event_teams et ON e.id = et.event_id
INNER JOIN teams t ON et.team_id = t.id
WHERE t.is_active = TRUE;

-- View to get all teams targeted by a form
CREATE OR REPLACE VIEW form_team_targets AS
SELECT
    f.id as form_id,
    f.title as form_title,
    t.id as team_id,
    t.name as team_name,
    t.gender,
    t.team_level
FROM forms f
INNER JOIN form_teams ft ON f.id = ft.form_id
INNER JOIN teams t ON ft.team_id = t.id
WHERE t.is_active = TRUE;

-- Step 14: Add comments for documentation
COMMENT ON TABLE teams IS 'Actual team entities (JV Men, Varsity Men, Varsity Women)';
COMMENT ON TABLE user_teams IS 'Many-to-many relationship between users and teams. Coaches can be on multiple teams.';
COMMENT ON TABLE event_teams IS 'Many-to-many relationship between events and teams. Events can target specific team combinations.';
COMMENT ON TABLE form_teams IS 'Many-to-many relationship between forms and teams. Forms can target specific team combinations.';

COMMENT ON COLUMN users.gender IS 'NULLABLE - Coaches may not have a specific gender assignment';
COMMENT ON COLUMN users.team_level IS 'NULLABLE - Coaches may not have a specific team level';

-- Note: OLD columns (applies_to_men, applies_to_women, applies_to_jv, applies_to_varsity)
-- are kept for rollback safety and backward compatibility
-- They can be dropped in a future migration after thorough testing
