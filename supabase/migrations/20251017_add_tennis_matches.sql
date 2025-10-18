/**
 * Add 2025-26 Tennis Match Schedules
 * Imports matches for Men's Varsity, Men's JV, and Women's Varsity
 * Source: Rose-Hulman Athletics Website (October 2025)
 */

-- First, we need to get team IDs. Teams should already exist in the database.
-- Men's Varsity, Men's JV, Women's Varsity

-- Helper function to get team ID by name (for reference)
-- You'll need to replace the team_id UUIDs below with actual IDs from your database

-- ============================================================================
-- WOMEN'S VARSITY MATCHES (2025-26 Season)
-- ============================================================================

-- Sep 13-14: DePauw Invitational (Individuals Compete - skip)
-- Sep 19-21: ITA Regionals (Individuals Compete - skip)

-- Oct 4: vs Greenville University (HOME) - HOMECOMING
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Women''s Tennis vs Greenville University',
  'Homecoming Match',
  '2025-10-04 12:00:00-05:00',
  '2025-10-04 15:00:00-05:00',
  'Joy Hulbert Tennis Center, Terre Haute, Ind.',
  'match',
  false,
  true,
  false,
  true,
  'Greenville University',
  'home',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Feb 7: at Indiana University Kokomo
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Women''s Tennis at Indiana University Kokomo',
  '',
  '2026-02-07 13:30:00-05:00',
  '2026-02-07 16:30:00-05:00',
  'Kokomo, Ind.',
  'match',
  false,
  true,
  false,
  true,
  'Indiana University Kokomo',
  'away',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Feb 13: at Hope College
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Women''s Tennis at Hope College',
  '',
  '2026-02-13 14:00:00-05:00',
  '2026-02-13 17:00:00-05:00',
  'Holland, Mich.',
  'match',
  false,
  true,
  false,
  true,
  'Hope College',
  'away',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Feb 14: vs Roosevelt University (in Holland, MI)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Women''s Tennis vs Roosevelt University',
  '',
  '2026-02-14 08:00:00-05:00',
  '2026-02-14 11:00:00-05:00',
  'Holland, Mich.',
  'match',
  false,
  true,
  false,
  true,
  'Roosevelt University',
  'neutral',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- FLORIDA TRIP MATCHES
-- Mar 1: vs Adrian College (Scrimmage - skip)

-- Mar 2: vs Concordia University (Wis.)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Women''s Tennis vs Concordia University (Wis.)',
  'Florida Trip',
  '2026-03-02 12:00:00-05:00',
  '2026-03-02 15:00:00-05:00',
  'Orlando, Fla.',
  'match',
  false,
  true,
  false,
  true,
  'Concordia University (Wis.)',
  'neutral',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Mar 3: vs Capital University
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Women''s Tennis vs Capital University',
  'Florida Trip',
  '2026-03-03 09:00:00-05:00',
  '2026-03-03 12:00:00-05:00',
  'Orlando, Fla.',
  'match',
  false,
  true,
  false,
  true,
  'Capital University',
  'neutral',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Mar 3: vs Allegheny College
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Women''s Tennis vs Allegheny College',
  'Florida Trip',
  '2026-03-03 15:00:00-05:00',
  '2026-03-03 18:00:00-05:00',
  'Orlando, Fla.',
  'match',
  false,
  true,
  false,
  true,
  'Allegheny College',
  'neutral',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Mar 5: vs Wartburg College
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Women''s Tennis vs Wartburg College',
  'Florida Trip',
  '2026-03-05 12:00:00-05:00',
  '2026-03-05 15:00:00-05:00',
  'Orlando, Fla.',
  'match',
  false,
  true,
  false,
  true,
  'Wartburg College',
  'neutral',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Mar 14: at Berea College (HCAC)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Women''s Tennis at Berea College (Ky.)',
  'HCAC Conference Match',
  '2026-03-14 10:00:00-05:00',
  '2026-03-14 13:00:00-05:00',
  'Berea, Ky.',
  'match',
  false,
  true,
  false,
  true,
  'Berea College (Ky.)',
  'away',
  true,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Mar 21: at Trine University
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Women''s Tennis at Trine University',
  '',
  '2026-03-21 11:00:00-05:00',
  '2026-03-21 14:00:00-05:00',
  'Angola, Ind.',
  'match',
  false,
  true,
  false,
  true,
  'Trine University',
  'away',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Mar 22: vs Franklin College (HOME, HCAC)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Women''s Tennis vs Franklin College',
  'HCAC Conference Match',
  '2026-03-22 10:00:00-05:00',
  '2026-03-22 13:00:00-05:00',
  'Joy Hulbert Tennis Center, Terre Haute, Ind.',
  'match',
  false,
  true,
  false,
  true,
  'Franklin College',
  'home',
  true,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Mar 28: at Principia College
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Women''s Tennis at Principia College',
  '',
  '2026-03-28 11:00:00-06:00',
  '2026-03-28 14:00:00-06:00',
  'St. Louis, Mo.',
  'match',
  false,
  true,
  false,
  true,
  'Principia College',
  'away',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Apr 4: vs Transylvania University (HOME, HCAC)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Women''s Tennis vs Transylvania University',
  'HCAC Conference Match',
  '2026-04-04 10:00:00-05:00',
  '2026-04-04 13:00:00-05:00',
  'Joy Hulbert Tennis Center, Terre Haute, Ind.',
  'match',
  false,
  true,
  false,
  true,
  'Transylvania University',
  'home',
  true,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Apr 11: at Earlham College (HCAC)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Women''s Tennis at Earlham College',
  'HCAC Conference Match',
  '2026-04-11 10:00:00-05:00',
  '2026-04-11 13:00:00-05:00',
  'Richmond, Ind.',
  'match',
  false,
  true,
  false,
  true,
  'Earlham College',
  'away',
  true,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Apr 15: vs Westminster College (MO) - in Greenville, IL
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Women''s Tennis vs Westminster College (MO)',
  '',
  '2026-04-15 10:00:00-06:00',
  '2026-04-15 13:00:00-06:00',
  'Greenville, Ill.',
  'match',
  false,
  true,
  false,
  true,
  'Westminster College (MO)',
  'neutral',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Apr 15: at Greenville University
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Women''s Tennis at Greenville University',
  '',
  '2026-04-15 13:00:00-06:00',
  '2026-04-15 16:00:00-06:00',
  'Greenville, Ill.',
  'match',
  false,
  true,
  false,
  true,
  'Greenville University',
  'away',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Apr 18: vs Anderson University (HOME, HCAC)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Women''s Tennis vs Anderson University (IN)',
  'HCAC Conference Match',
  '2026-04-18 10:00:00-05:00',
  '2026-04-18 13:00:00-05:00',
  'Joy Hulbert Tennis Center, Terre Haute, Ind.',
  'match',
  false,
  true,
  false,
  true,
  'Anderson University (IN)',
  'home',
  true,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Apr 25: at Hanover College (HCAC)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Women''s Tennis at Hanover College',
  'HCAC Conference Match',
  '2026-04-25 10:00:00-05:00',
  '2026-04-25 13:00:00-05:00',
  'Hanover, Ind.',
  'match',
  false,
  true,
  false,
  true,
  'Hanover College',
  'away',
  true,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Apr 26: vs Manchester University (HOME, SENIOR DAY, HCAC)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Women''s Tennis vs Manchester University',
  'Senior Day - HCAC Conference Match',
  '2026-04-26 10:00:00-05:00',
  '2026-04-26 13:00:00-05:00',
  'Joy Hulbert Tennis Center, Terre Haute, Ind.',
  'match',
  false,
  true,
  false,
  true,
  'Manchester University',
  'home',
  true,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Skip HCAC Tournament matches (TBA times)


-- ============================================================================
-- MEN'S VARSITY MATCHES (2025-26 Season)
-- ============================================================================

-- Sep 6-7: DePauw Invitational (Individuals - skip)
-- Sep 26-29: ITA Regionals (Individuals - skip)

-- Oct 4: vs Greenville University (HOME)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis vs Greenville University',
  'HCAC Ring Ceremony | Homecoming',
  '2025-10-04 12:00:00-05:00',
  '2025-10-04 15:00:00-05:00',
  'Joy Hulbert Tennis Center, Terre Haute, Ind.',
  'match',
  true,
  false,
  false,
  true,
  'Greenville University',
  'home',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Feb 6: vs Case Western Reserve (in Crawfordsville)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis vs Case Western Reserve University',
  '',
  '2026-02-06 12:00:00-05:00',
  '2026-02-06 15:00:00-05:00',
  'Crawfordsville, Ind.',
  'match',
  true,
  false,
  false,
  true,
  'Case Western Reserve University',
  'neutral',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Feb 13: at Hope College
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis at Hope College',
  '',
  '2026-02-13 14:00:00-05:00',
  '2026-02-13 17:00:00-05:00',
  'Holland, Mich.',
  'match',
  true,
  false,
  false,
  true,
  'Hope College',
  'away',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Feb 14: vs Roosevelt University (in Holland)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis vs Roosevelt University',
  '',
  '2026-02-14 08:00:00-05:00',
  '2026-02-14 11:00:00-05:00',
  'Holland, Mich.',
  'match',
  true,
  false,
  false,
  true,
  'Roosevelt University',
  'neutral',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- FLORIDA TRIP
-- Mar 1: vs Adrian College (Scrimmage - skip)

-- Mar 2: vs Concordia (Wis.)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis vs Concordia University (Wis.)',
  'Florida Trip',
  '2026-03-02 12:00:00-05:00',
  '2026-03-02 15:00:00-05:00',
  'Orlando, Fla.',
  'match',
  true,
  false,
  false,
  true,
  'Concordia University (Wis.)',
  'neutral',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Mar 3: vs Allegheny College
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis vs Allegheny College',
  'Florida Trip',
  '2026-03-03 09:00:00-05:00',
  '2026-03-03 12:00:00-05:00',
  'Orlando, Fla.',
  'match',
  true,
  false,
  false,
  true,
  'Allegheny College',
  'neutral',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Mar 3: vs Cedarville University
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis vs Cedarville University',
  'Florida Trip',
  '2026-03-03 15:00:00-05:00',
  '2026-03-03 18:00:00-05:00',
  'Orlando, Fla.',
  'match',
  true,
  false,
  false,
  true,
  'Cedarville University',
  'neutral',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Mar 5: vs Wartburg College
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis vs Wartburg College',
  'Florida Trip',
  '2026-03-05 12:00:00-05:00',
  '2026-03-05 15:00:00-05:00',
  'Orlando, Fla.',
  'match',
  true,
  false,
  false,
  true,
  'Wartburg College',
  'neutral',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Mar 14: at Berea College (HCAC)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis at Berea College (Ky.)',
  'HCAC Conference Match',
  '2026-03-14 14:00:00-05:00',
  '2026-03-14 17:00:00-05:00',
  'Berea, Ky.',
  'match',
  true,
  false,
  false,
  true,
  'Berea College (Ky.)',
  'away',
  true,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Mar 18: vs Milwaukee School of Engineering (HOME)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis vs Milwaukee School of Engineering',
  '',
  '2026-03-18 17:30:00-05:00',
  '2026-03-18 20:30:00-05:00',
  'Joy Hulbert Tennis Center, Terre Haute, Ind.',
  'match',
  true,
  false,
  false,
  true,
  'Milwaukee School of Engineering',
  'home',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Mar 21: at Trine University
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis at Trine University',
  '',
  '2026-03-21 11:00:00-05:00',
  '2026-03-21 14:00:00-05:00',
  'Angola, Ind.',
  'match',
  true,
  false,
  false,
  true,
  'Trine University',
  'away',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Mar 22: vs Franklin College (HOME, HCAC)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis vs Franklin College',
  'HCAC Conference Match',
  '2026-03-22 14:00:00-05:00',
  '2026-03-22 17:00:00-05:00',
  'Joy Hulbert Tennis Center, Terre Haute, Ind.',
  'match',
  true,
  false,
  false,
  true,
  'Franklin College',
  'home',
  true,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Mar 28: vs Wabash (HOME) - Tri-Match
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis vs Wabash',
  'Rose-Hulman Tri-Match',
  '2026-03-28 10:00:00-05:00',
  '2026-03-28 13:00:00-05:00',
  'Joy Hulbert Tennis Center, Terre Haute, Ind.',
  'match',
  true,
  false,
  false,
  true,
  'Wabash',
  'home',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Mar 28: vs Principia College (HOME) - Tri-Match
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis vs Principia College',
  'Rose-Hulman Tri-Match',
  '2026-03-28 16:00:00-05:00',
  '2026-03-28 19:00:00-05:00',
  'Joy Hulbert Tennis Center, Terre Haute, Ind.',
  'match',
  true,
  false,
  false,
  true,
  'Principia College',
  'home',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Apr 4: vs Transylvania University (HOME, HCAC)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis vs Transylvania University',
  'HCAC Conference Match',
  '2026-04-04 14:00:00-05:00',
  '2026-04-04 17:00:00-05:00',
  'Joy Hulbert Tennis Center, Terre Haute, Ind.',
  'match',
  true,
  false,
  false,
  true,
  'Transylvania University',
  'home',
  true,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Apr 11: at Earlham College (HCAC)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis at Earlham College',
  'HCAC Conference Match',
  '2026-04-11 14:00:00-05:00',
  '2026-04-11 17:00:00-05:00',
  'Richmond, Ind.',
  'match',
  true,
  false,
  false,
  true,
  'Earlham College',
  'away',
  true,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Apr 15: vs Westminster College (in Greenville, IL)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis vs Westminster College (MO)',
  '',
  '2026-04-15 10:00:00-06:00',
  '2026-04-15 13:00:00-06:00',
  'Greenville, Ill.',
  'match',
  true,
  false,
  false,
  true,
  'Westminster College (MO)',
  'neutral',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Apr 15: at Greenville University
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis at Greenville University',
  '',
  '2026-04-15 13:00:00-06:00',
  '2026-04-15 16:00:00-06:00',
  'Greenville, Ill.',
  'match',
  true,
  false,
  false,
  true,
  'Greenville University',
  'away',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Apr 18: vs Anderson University (HOME, HCAC)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis vs Anderson University (IN)',
  'HCAC Conference Match',
  '2026-04-18 14:00:00-05:00',
  '2026-04-18 17:00:00-05:00',
  'Joy Hulbert Tennis Center, Terre Haute, Ind.',
  'match',
  true,
  false,
  false,
  true,
  'Anderson University (IN)',
  'home',
  true,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Apr 25: at Hanover College (HCAC)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis at Hanover College',
  'HCAC Conference Match',
  '2026-04-25 14:00:00-05:00',
  '2026-04-25 17:00:00-05:00',
  'Hanover, Ind.',
  'match',
  true,
  false,
  false,
  true,
  'Hanover College',
  'away',
  true,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Apr 26: vs Manchester University (HOME, SENIOR DAY, HCAC)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s Tennis vs Manchester University',
  'Senior Day - HCAC Conference Match',
  '2026-04-26 14:00:00-05:00',
  '2026-04-26 17:00:00-05:00',
  'Joy Hulbert Tennis Center, Terre Haute, Ind.',
  'match',
  true,
  false,
  false,
  true,
  'Manchester University',
  'home',
  true,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);


-- ============================================================================
-- MEN'S JV MATCHES (2025-26 Season)
-- ============================================================================

-- Sep 20: vs Wabash (HOME) - L, 5-0
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  match_result,
  is_conference_match,
  created_by
) VALUES (
  'Men''s JV Tennis vs Wabash',
  '',
  '2025-09-20 13:00:00-05:00',
  '2025-09-20 16:00:00-05:00',
  'Joy Hulbert Tennis Center, Terre Haute, Ind.',
  'match',
  true,
  false,
  true,
  false,
  'Wabash',
  'home',
  'L, 5-0',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Oct 8: vs Oakland City (HOME) - L, 6-1
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  match_result,
  is_conference_match,
  created_by
) VALUES (
  'Men''s JV Tennis vs Oakland City',
  '',
  '2025-10-08 17:00:00-05:00',
  '2025-10-08 20:00:00-05:00',
  'Joy Hulbert Tennis Center, Terre Haute, Ind.',
  'match',
  true,
  false,
  true,
  false,
  'Oakland City',
  'home',
  'L, 6-1',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Mar 21: vs Illinois College (HOME)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s JV Tennis vs Illinois College',
  '',
  '2026-03-21 12:00:00-05:00',
  '2026-03-21 15:00:00-05:00',
  'Joy Hulbert Tennis Center, Terre Haute, Ind.',
  'match',
  true,
  false,
  true,
  false,
  'Illinois College',
  'home',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Mar 21: vs Wabash College (HOME)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s JV Tennis vs Wabash College',
  '',
  '2026-03-21 16:00:00-05:00',
  '2026-03-21 19:00:00-05:00',
  'Joy Hulbert Tennis Center, Terre Haute, Ind.',
  'match',
  true,
  false,
  true,
  false,
  'Wabash College',
  'home',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Mar 29: at Anderson
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s JV Tennis at Anderson',
  '',
  '2026-03-29 12:00:00-05:00',
  '2026-03-29 15:00:00-05:00',
  'Anderson, Ind.',
  'match',
  true,
  false,
  true,
  false,
  'Anderson',
  'away',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Apr 12: at Franklin
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s JV Tennis at Franklin',
  '',
  '2026-04-12 12:00:00-05:00',
  '2026-04-12 15:00:00-05:00',
  'Franklin, Ind.',
  'match',
  true,
  false,
  true,
  false,
  'Franklin',
  'away',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);

-- Apr 15: vs Westminster (in Greenville, IL)
INSERT INTO events (
  title,
  description,
  start_datetime,
  end_datetime,
  location,
  event_type,
  applies_to_men,
  applies_to_women,
  applies_to_jv,
  applies_to_varsity,
  opponent,
  home_away,
  is_conference_match,
  created_by
) VALUES (
  'Men''s JV Tennis vs Westminster',
  '',
  '2026-04-15 10:00:00-06:00',
  '2026-04-15 13:00:00-06:00',
  'Greenville, Ill.',
  'match',
  true,
  false,
  true,
  false,
  'Westminster',
  'neutral',
  false,
  (SELECT id FROM users WHERE role = 'coach' LIMIT 1)
);
