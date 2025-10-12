/**
 * TypeScript type definitions for database tables
 * These types mirror the Supabase database schema
 */

import { UserRole, Gender, TeamLevel, EventType, ResponseStatus, AvailabilityStatus } from '../constants';

/**
 * User profile information
 */
export interface User {
  id: string; // UUID from auth.users
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  gender: Gender;
  team_level: TeamLevel;
  phone?: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Class schedule entry for a user
 */
export interface ClassSchedule {
  id: string; // UUID
  user_id: string; // References User.id
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string; // HH:MM format (e.g., "09:00")
  end_time: string; // HH:MM format (e.g., "10:50")
  class_name?: string;
  location?: string;
  quarter: string; // Reference to quarter key (e.g., "FALL_2025")
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Recurring time blocker (e.g., weekly commitments)
 */
export interface RecurringBlocker {
  id: string; // UUID
  user_id: string; // References User.id
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  title: string;
  description?: string;
  quarter: string; // Reference to quarter key
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * One-time blocker for specific dates
 */
export interface OneTimeBlocker {
  id: string; // UUID
  user_id: string; // References User.id
  start_datetime: string; // ISO datetime
  end_datetime: string; // ISO datetime
  title: string;
  description?: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Exception for a recurring class schedule
 * Marks specific dates when a recurring class doesn't apply
 */
export interface ClassScheduleException {
  id: string; // UUID
  user_id: string; // References User.id
  class_schedule_id: string; // References ClassSchedule.id
  exception_date: string; // ISO date (YYYY-MM-DD)
  reason?: string;
  created_at: string; // ISO timestamp
}

/**
 * Daily practice availability for a user
 */
export interface PracticeAvailability {
  id: string; // UUID
  user_id: string; // References User.id
  date: string; // ISO date (YYYY-MM-DD)
  status: AvailabilityStatus;
  notes?: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Team event (practice, match, meeting, etc.)
 */
export interface Event {
  id: string; // UUID
  title: string;
  description?: string;
  event_type: EventType;
  start_datetime: string; // ISO datetime
  end_datetime: string; // ISO datetime
  location?: string;
  gender?: Gender; // null means all genders
  team_level?: TeamLevel; // null means all levels
  created_by: string; // References User.id
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * User response to an event
 */
export interface EventResponse {
  id: string; // UUID
  event_id: string; // References Event.id
  user_id: string; // References User.id
  status: ResponseStatus;
  notes?: string;
  responded_at: string; // ISO timestamp
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Custom form created by coaches/captains
 */
export interface Form {
  id: string; // UUID
  title: string;
  description?: string;
  questions: FormQuestion[]; // JSON array of questions
  gender?: Gender; // null means all genders
  team_level?: TeamLevel; // null means all levels
  is_active: boolean;
  created_by: string; // References User.id
  due_date?: string; // ISO datetime
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Question structure within a form
 */
export interface FormQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'date' | 'time';
  required: boolean;
  options?: string[]; // For select, multiselect, radio, checkbox types
  placeholder?: string;
}

/**
 * User response to a form
 */
export interface FormResponse {
  id: string; // UUID
  form_id: string; // References Form.id
  user_id: string; // References User.id
  answers: FormAnswer[]; // JSON array of answers
  submitted_at: string; // ISO timestamp
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Answer structure within a form response
 */
export interface FormAnswer {
  question_id: string;
  answer: string | string[]; // Single value or array for multi-select
}

/**
 * Database tables type map
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      class_schedules: {
        Row: ClassSchedule;
        Insert: Omit<ClassSchedule, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ClassSchedule, 'id' | 'created_at' | 'updated_at'>>;
      };
      recurring_blockers: {
        Row: RecurringBlocker;
        Insert: Omit<RecurringBlocker, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<RecurringBlocker, 'id' | 'created_at' | 'updated_at'>>;
      };
      one_time_blockers: {
        Row: OneTimeBlocker;
        Insert: Omit<OneTimeBlocker, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<OneTimeBlocker, 'id' | 'created_at' | 'updated_at'>>;
      };
      class_schedule_exceptions: {
        Row: ClassScheduleException;
        Insert: Omit<ClassScheduleException, 'id' | 'created_at'>;
        Update: Partial<Omit<ClassScheduleException, 'id' | 'created_at'>>;
      };
      practice_availability: {
        Row: PracticeAvailability;
        Insert: Omit<PracticeAvailability, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PracticeAvailability, 'id' | 'created_at' | 'updated_at'>>;
      };
      events: {
        Row: Event;
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>;
      };
      event_responses: {
        Row: EventResponse;
        Insert: Omit<EventResponse, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<EventResponse, 'id' | 'created_at' | 'updated_at'>>;
      };
      forms: {
        Row: Form;
        Insert: Omit<Form, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Form, 'id' | 'created_at' | 'updated_at'>>;
      };
      form_responses: {
        Row: FormResponse;
        Insert: Omit<FormResponse, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<FormResponse, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
