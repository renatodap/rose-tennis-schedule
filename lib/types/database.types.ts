/**
 * TypeScript type definitions for database tables
 * These types mirror the Supabase database schema
 */

import { UserRole, Gender, TeamLevel, EventType, ResponseStatus, AvailabilityStatus, HomeAwayType } from '../constants';

/**
 * User profile information
 */
export interface User {
  id: string; // UUID from auth.users
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  gender?: Gender; // Nullable - coaches may not have specific gender
  team_level?: TeamLevel; // Nullable - coaches may not have specific level
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
  // Match-specific fields
  opponent?: string; // Opposing team name (for match events)
  home_away?: HomeAwayType; // Home/away/neutral (for match events)
  match_result?: string; // Match result (e.g., "W, 4-3" or "L, 5-0")
  is_conference_match?: boolean; // HCAC conference match flag
  external_url?: string; // Link to live video, box score, etc.
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
 * Team entity (actual teams: JV Men's, Varsity Men's, Varsity Women's)
 */
export interface Team {
  id: string; // UUID
  name: string;
  gender: Gender;
  team_level: TeamLevel;
  is_active: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * User-Team membership (many-to-many)
 */
export interface UserTeam {
  id: string; // UUID
  user_id: string; // References User.id
  team_id: string; // References Team.id
  created_at: string; // ISO timestamp
}

/**
 * Event-Team targeting (many-to-many)
 */
export interface EventTeam {
  id: string; // UUID
  event_id: string; // References Event.id
  team_id: string; // References Team.id
  created_at: string; // ISO timestamp
}

/**
 * Form-Team targeting (many-to-many)
 */
export interface FormTeam {
  id: string; // UUID
  form_id: string; // References Form.id
  team_id: string; // References Team.id
  created_at: string; // ISO timestamp
}

/**
 * Scheduled notification for an event
 */
export interface NotificationSchedule {
  id: string; // UUID
  event_id: string; // References Event.id
  user_id: string; // References User.id
  notification_type: '24hr' | '7hr' | '2hr' | '1hr';
  scheduled_for: string; // ISO timestamp
  sent_at?: string; // ISO timestamp (null if not sent yet)
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * PWA Push notification subscription
 */
export interface PushSubscription {
  id: string; // UUID
  user_id: string; // References User.id
  endpoint: string; // Push service endpoint URL
  p256dh: string; // Encryption key
  auth: string; // Authentication secret
  user_agent?: string; // Browser/device info
  last_used_at: string; // ISO timestamp
  created_at: string; // ISO timestamp
}

/**
 * Match challenge between players
 */
export interface Challenge {
  id: string; // UUID
  challenger_id: string; // References User.id
  opponent_id?: string; // References User.id (null if open challenge)
  challenge_type: 'singles' | 'doubles';
  proposed_datetime?: string; // ISO datetime
  location?: string;
  status: 'open' | 'accepted' | 'completed' | 'cancelled';
  winner_id?: string; // References User.id
  score?: string; // e.g., "6-4, 7-5"
  notes?: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Participants in doubles challenges
 */
export interface ChallengeParticipant {
  id: string; // UUID
  challenge_id: string; // References Challenge.id
  user_id: string; // References User.id
  team_side: 'challenger_team' | 'opponent_team';
  created_at: string; // ISO timestamp
}

/**
 * Ride offer for an event
 */
export interface RideOffer {
  id: string; // UUID
  event_id: string; // References Event.id
  driver_id: string; // References User.id
  capacity: number;
  departure_location: string;
  departure_time: string; // ISO datetime
  return_time?: string; // ISO datetime
  notes?: string;
  status: 'active' | 'full' | 'cancelled';
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Ride request from a passenger
 */
export interface RideRequest {
  id: string; // UUID
  ride_offer_id: string; // References RideOffer.id
  passenger_id: string; // References User.id
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Badge definition
 */
export interface BadgeDefinition {
  id: string; // e.g., 'perfect-attendance'
  name: string;
  description: string;
  icon: string; // emoji or icon name
  category: 'serious' | 'funny' | 'milestone';
  rarity: 'common' | 'rare' | 'legendary';
  criteria: Record<string, any>; // Flexible criteria object
  is_active: boolean;
  created_at: string; // ISO timestamp
}

/**
 * Badge awarded to a user
 */
export interface UserBadge {
  id: string; // UUID
  user_id: string; // References User.id
  badge_id: string; // References BadgeDefinition.id
  awarded_at: string; // ISO timestamp
  progress_data?: Record<string, any>; // Progress tracking
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
      teams: {
        Row: Team;
        Insert: Omit<Team, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Team, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_teams: {
        Row: UserTeam;
        Insert: Omit<UserTeam, 'id' | 'created_at'>;
        Update: Partial<Omit<UserTeam, 'id' | 'created_at'>>;
      };
      event_teams: {
        Row: EventTeam;
        Insert: Omit<EventTeam, 'id' | 'created_at'>;
        Update: Partial<Omit<EventTeam, 'id' | 'created_at'>>;
      };
      form_teams: {
        Row: FormTeam;
        Insert: Omit<FormTeam, 'id' | 'created_at'>;
        Update: Partial<Omit<FormTeam, 'id' | 'created_at'>>;
      };
      notification_schedules: {
        Row: NotificationSchedule;
        Insert: Omit<NotificationSchedule, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NotificationSchedule, 'id' | 'created_at' | 'updated_at'>>;
      };
      push_subscriptions: {
        Row: PushSubscription;
        Insert: Omit<PushSubscription, 'id' | 'created_at'>;
        Update: Partial<Omit<PushSubscription, 'id' | 'created_at'>>;
      };
      challenges: {
        Row: Challenge;
        Insert: Omit<Challenge, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Challenge, 'id' | 'created_at' | 'updated_at'>>;
      };
      challenge_participants: {
        Row: ChallengeParticipant;
        Insert: Omit<ChallengeParticipant, 'id' | 'created_at'>;
        Update: Partial<Omit<ChallengeParticipant, 'id' | 'created_at'>>;
      };
      ride_offers: {
        Row: RideOffer;
        Insert: Omit<RideOffer, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<RideOffer, 'id' | 'created_at' | 'updated_at'>>;
      };
      ride_requests: {
        Row: RideRequest;
        Insert: Omit<RideRequest, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<RideRequest, 'id' | 'created_at' | 'updated_at'>>;
      };
      badge_definitions: {
        Row: BadgeDefinition;
        Insert: Omit<BadgeDefinition, 'created_at'>;
        Update: Partial<Omit<BadgeDefinition, 'created_at'>>;
      };
      user_badges: {
        Row: UserBadge;
        Insert: Omit<UserBadge, 'id' | 'awarded_at'>;
        Update: Partial<Omit<UserBadge, 'id' | 'awarded_at'>>;
      };
    };
  };
}
