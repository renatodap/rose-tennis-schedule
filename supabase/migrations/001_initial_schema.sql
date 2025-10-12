-- Rose-Hulman Tennis Team Availability App - Database Schema
-- Migration 001: Initial Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE user_gender AS ENUM ('men', 'women');
CREATE TYPE user_role AS ENUM ('player', 'captain', 'coach');
CREATE TYPE team_level AS ENUM ('jv', 'varsity');
CREATE TYPE quarter AS ENUM ('fall', 'winter', 'spring', 'summer');
CREATE TYPE event_type AS ENUM ('optional', 'recommended', 'mandatory');
CREATE TYPE rsvp_response AS ENUM ('going', 'not_going', 'maybe', 'no_response');

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender user_gender NOT NULL,
    role user_role NOT NULL DEFAULT 'player',
    team_level team_level,
    phone_number VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Class schedules table
CREATE TABLE class_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quarter quarter NOT NULL,
    year INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    course_name VARCHAR(255),
    location VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, quarter, year, day_of_week, start_time),
    CHECK (end_time > start_time)
);

-- Recurring blockers table
CREATE TABLE recurring_blockers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    title VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (end_time > start_time),
    CHECK (end_date IS NULL OR end_date >= start_date)
);

-- One-time blockers table
CREATE TABLE one_time_blockers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (end_datetime > start_datetime)
);

-- Practice availability table
CREATE TABLE practice_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (end_datetime > start_datetime)
);

-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    location VARCHAR(255),
    event_type event_type NOT NULL,
    applies_to_men BOOLEAN NOT NULL DEFAULT TRUE,
    applies_to_women BOOLEAN NOT NULL DEFAULT TRUE,
    applies_to_jv BOOLEAN NOT NULL DEFAULT TRUE,
    applies_to_varsity BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (end_datetime > start_datetime)
);

-- Event responses table
CREATE TABLE event_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    response rsvp_response NOT NULL DEFAULT 'no_response',
    response_datetime TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Forms table
CREATE TABLE forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    questions JSONB NOT NULL,
    applies_to_men BOOLEAN NOT NULL DEFAULT TRUE,
    applies_to_women BOOLEAN NOT NULL DEFAULT TRUE,
    applies_to_jv BOOLEAN NOT NULL DEFAULT TRUE,
    applies_to_varsity BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Form responses table
CREATE TABLE form_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    responses JSONB NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(form_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_gender ON users(gender);
CREATE INDEX idx_users_team_level ON users(team_level);

CREATE INDEX idx_class_schedules_user_id ON class_schedules(user_id);
CREATE INDEX idx_class_schedules_quarter_year ON class_schedules(quarter, year);
CREATE INDEX idx_class_schedules_day_of_week ON class_schedules(day_of_week);

CREATE INDEX idx_recurring_blockers_user_id ON recurring_blockers(user_id);
CREATE INDEX idx_recurring_blockers_day_of_week ON recurring_blockers(day_of_week);
CREATE INDEX idx_recurring_blockers_dates ON recurring_blockers(start_date, end_date);

CREATE INDEX idx_one_time_blockers_user_id ON one_time_blockers(user_id);
CREATE INDEX idx_one_time_blockers_datetime ON one_time_blockers(start_datetime, end_datetime);

CREATE INDEX idx_practice_availability_user_id ON practice_availability(user_id);
CREATE INDEX idx_practice_availability_datetime ON practice_availability(start_datetime, end_datetime);

CREATE INDEX idx_events_datetime ON events(start_datetime, end_datetime);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_filters ON events(applies_to_men, applies_to_women, applies_to_jv, applies_to_varsity);

CREATE INDEX idx_event_responses_event_id ON event_responses(event_id);
CREATE INDEX idx_event_responses_user_id ON event_responses(user_id);
CREATE INDEX idx_event_responses_response ON event_responses(response);

CREATE INDEX idx_forms_active ON forms(is_active);
CREATE INDEX idx_forms_due_date ON forms(due_date);

CREATE INDEX idx_form_responses_form_id ON form_responses(form_id);
CREATE INDEX idx_form_responses_user_id ON form_responses(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_schedules_updated_at BEFORE UPDATE ON class_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_blockers_updated_at BEFORE UPDATE ON recurring_blockers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_one_time_blockers_updated_at BEFORE UPDATE ON one_time_blockers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practice_availability_updated_at BEFORE UPDATE ON practice_availability
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_responses_updated_at BEFORE UPDATE ON event_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forms_updated_at BEFORE UPDATE ON forms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_form_responses_updated_at BEFORE UPDATE ON form_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
