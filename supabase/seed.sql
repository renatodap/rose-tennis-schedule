-- Rose-Hulman Tennis Team Availability App - Seed Data
-- This file contains initial data for coaches and captains

-- NOTE: These users need to sign up through the app first to create their auth.users records
-- After they sign up, run these UPDATE statements to set their roles

-- Update Matt Wilson to coach (Men's coach)
-- UPDATE users SET role = 'coach' WHERE email = 'matt.wilson@rose-hulman.edu';

-- Update Amanda Lubold to coach (Women's coach)
-- UPDATE users SET role = 'coach' WHERE email = 'amanda.lubold@rose-hulman.edu';

-- Update Chris Lian to captain
-- UPDATE users SET role = 'captain' WHERE email = 'chris.lian@rose-hulman.edu';

-- Update Camille Clark to captain
-- UPDATE users SET role = 'captain' WHERE email = 'camille.clark@rose-hulman.edu';

-- Update Renato Prado to captain
-- UPDATE users SET role = 'captain' WHERE email = 'renato.prado@rose-hulman.edu';

-- Alternative: If you have their UUIDs after signup, you can update by ID:
-- UPDATE users SET role = 'coach' WHERE id = 'uuid-here';

-- To bulk update multiple users:
/*
UPDATE users
SET role = 'coach'
WHERE email IN ('matt.wilson@rose-hulman.edu', 'amanda.lubold@rose-hulman.edu');

UPDATE users
SET role = 'captain'
WHERE email IN (
    'chris.lian@rose-hulman.edu',
    'camille.clark@rose-hulman.edu',
    'renato.prado@rose-hulman.edu'
);
*/

-- Sample data for testing (optional - uncomment if needed for development)
/*
-- Sample event
INSERT INTO events (
    title,
    description,
    start_datetime,
    end_datetime,
    location,
    event_type,
    applies_to_men,
    applies_to_women,
    created_by
) VALUES (
    'Team Meeting',
    'Welcome back meeting for the entire team',
    '2025-09-05 16:00:00-05',
    '2025-09-05 17:00:00-05',
    'Sports Center',
    'mandatory',
    TRUE,
    TRUE,
    (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Sample form
INSERT INTO forms (
    title,
    description,
    questions,
    applies_to_men,
    applies_to_women,
    created_by,
    due_date
) VALUES (
    'Season Goals Survey',
    'Tell us about your goals for this season',
    '[
        {
            "id": "1",
            "type": "text",
            "question": "What are your personal goals for this season?",
            "required": true
        },
        {
            "id": "2",
            "type": "multiple_choice",
            "question": "How many hours per week can you commit to practice?",
            "options": ["0-5 hours", "5-10 hours", "10-15 hours", "15+ hours"],
            "required": true
        },
        {
            "id": "3",
            "type": "rating",
            "question": "How would you rate your current skill level?",
            "min": 1,
            "max": 5,
            "required": true
        }
    ]'::jsonb,
    TRUE,
    TRUE,
    (SELECT id FROM users WHERE role = 'coach' LIMIT 1),
    '2025-09-15 23:59:59-05'
);
*/
