/**
 * Schedule Parser for Rose-Hulman Tennis Schedules
 *
 * Parses tennis match schedules from Rose-Hulman athletics website
 * and converts them into Event objects for database import.
 */

import { format, parse, parseISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { APP_TIMEZONE } from '../constants';
import type { Event } from '../types/database.types';
import { EventType, HomeAwayType, Gender, TeamLevel } from '../constants';

export interface ParsedMatch {
  date: string; // Date portion (e.g., "Oct 4" or "Oct 4 (Sat)")
  time?: string; // Time portion (e.g., "12 PM" or "TBA")
  opponent: string; // Opponent name
  location?: string; // Location description
  homeAway: HomeAwayType; // Home, away, or neutral
  isConference: boolean; // HCAC conference match
  result?: string; // Match result (e.g., "W, 4-3")
  liveVideoUrl?: string; // URL to live video
  boxScoreUrl?: string; // URL to box score
  notes?: string; // Additional notes (e.g., "Homecoming", "Senior Day")
}

export interface ScheduleImportData {
  matches: ParsedMatch[];
  gender: Gender;
  teamLevel: TeamLevel;
  season: string; // e.g., "2025-26"
}

/**
 * Parse a single match row from the schedule
 */
export function parseMatchRow(row: string): ParsedMatch | null {
  try {
    // Match patterns:
    // "Oct 4 (Sat) 12 PM vs Greenville University HCAC Ring Ceremony | Homecoming W, 4-3"
    // "Feb 6 (Fri) TBA at Case Western Reserve University"
    // "Mar 1 (Sun) TBA Adrian College Scrimmage Orlando, Fla."

    // Extract date pattern (Month Day or Month Day (DayOfWeek))
    const dateMatch = row.match(/^([A-Z][a-z]{2}\s+\d{1,2}(?:\s+\([A-Za-z]+\))?)/);
    if (!dateMatch) return null;

    const dateStr = dateMatch[1];
    let remaining = row.substring(dateMatch[0].length).trim();

    // Extract time (could be "TBA" or "12 PM" or "8 AM" or "10 AM CT")
    const timeMatch = remaining.match(/^(TBA|\d{1,2}(?::\d{2})?\s*(?:AM|PM)(?:\s+CT)?)/i);
    const time = timeMatch ? timeMatch[1] : undefined;
    if (timeMatch) {
      remaining = remaining.substring(timeMatch[0].length).trim();
    }

    // Determine home/away based on "vs" (home), "at" (away), or neither (neutral/tournament)
    let homeAway: HomeAwayType = HomeAwayType.NEUTRAL;
    let opponent = '';

    if (remaining.startsWith('vs ')) {
      homeAway = HomeAwayType.HOME;
      remaining = remaining.substring(3).trim();
    } else if (remaining.startsWith('at ')) {
      homeAway = HomeAwayType.AWAY;
      remaining = remaining.substring(3).trim();
    }

    // Extract opponent (everything until first capital word that looks like a location or note)
    // Look for patterns like: "Greenville University", "Case Western Reserve University"
    const opponentMatch = remaining.match(/^([A-Z][^A-Z]*(?:[A-Z][a-z]+(?:\s+\([A-Z][a-z]+\.\))?)*)/);
    if (opponentMatch) {
      opponent = opponentMatch[1].trim();
      remaining = remaining.substring(opponentMatch[0].length).trim();
    }

    // Check for HCAC conference indicator
    const isConference = remaining.includes('HCAC') || remaining.includes('Heartland');

    // Extract result (W, X-Y or L, X-Y)
    const resultMatch = remaining.match(/([WL]),\s*\d+-\d+/);
    const result = resultMatch ? resultMatch[0] : undefined;

    // Extract location (city, state pattern)
    const locationMatch = remaining.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?,\s*(?:[A-Z][a-z]+\.?|Ind\.|Mich\.|Fla\.))/);
    const location = locationMatch ? locationMatch[1] : undefined;

    // Extract notes (anything that's not a URL or standard field)
    let notes = remaining
      .replace(/HCAC/g, '')
      .replace(/Heartland/g, '')
      .replace(/Live Video/g, '')
      .replace(/Box Score/g, '')
      .replace(/Recap/g, '')
      .replace(result || '', '')
      .replace(location || '', '')
      .trim();

    // Clean up notes
    if (notes.match(/^[\s|,]+$/)) notes = '';
    notes = notes.replace(/^\|+\s*/, '').replace(/\s*\|+$/, '').trim();

    return {
      date: dateStr,
      time,
      opponent,
      location,
      homeAway,
      isConference,
      result,
      notes: notes || undefined
    };
  } catch (error) {
    console.error('Error parsing match row:', row, error);
    return null;
  }
}

/**
 * Parse a time string to 24-hour format
 */
function parseTime(timeStr: string | undefined): { hour: number; minute: number } | null {
  if (!timeStr || timeStr === 'TBA') return null;

  // Handle formats like "12 PM", "8 AM", "10 AM CT", "1:30 PM"
  const match = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!match) return null;

  let hour = parseInt(match[1], 10);
  const minute = match[2] ? parseInt(match[2], 10) : 0;
  const meridiem = match[3].toUpperCase();

  if (meridiem === 'PM' && hour !== 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;

  return { hour, minute };
}

/**
 * Convert parsed match to Event object
 */
export function matchToEvent(
  match: ParsedMatch,
  season: string,
  gender: Gender,
  teamLevel: TeamLevel,
  createdBy: string
): Omit<Event, 'id' | 'created_at' | 'updated_at'> {
  // Parse the season year (e.g., "2025-26" -> start year 2025)
  const seasonYear = parseInt(season.split('-')[0], 10);

  // Parse the date (e.g., "Oct 4 (Sat)" -> October 4, 2025)
  // Remove day of week if present
  const cleanDate = match.date.replace(/\s*\([^)]+\)/, '');

  // Determine the full year based on month and season
  // Fall months (Sep-Nov) use first year, Spring months (Jan-May) use second year
  const monthName = cleanDate.split(' ')[0];
  const monthNum = parse(monthName, 'MMM', new Date()).getMonth();
  const fullYear = (monthNum >= 8) ? seasonYear : seasonYear + 1; // Sep=8, so Aug+ uses first year

  const fullDateStr = `${cleanDate} ${fullYear}`;
  let startDate = parse(fullDateStr, 'MMM d yyyy', new Date());

  // Parse time if available
  const timeInfo = parseTime(match.time);
  if (timeInfo) {
    startDate.setHours(timeInfo.hour, timeInfo.minute, 0, 0);
  } else {
    // Default to TBA matches at noon
    startDate.setHours(12, 0, 0, 0);
  }

  // Convert to UTC from Indianapolis timezone
  const startDatetimeUTC = zonedTimeToUtc(startDate, APP_TIMEZONE);

  // Assume 3-hour duration for matches (can be adjusted)
  const endDatetimeUTC = new Date(startDatetimeUTC);
  endDatetimeUTC.setHours(endDatetimeUTC.getHours() + 3);

  // Build title
  const homeAwayPrefix = match.homeAway === HomeAwayType.HOME ? 'vs' :
                         match.homeAway === HomeAwayType.AWAY ? 'at' : '';
  const title = homeAwayPrefix ? `${homeAwayPrefix} ${match.opponent}` : match.opponent;

  // Build description
  const descriptionParts: string[] = [];
  if (match.notes) descriptionParts.push(match.notes);
  if (match.isConference) descriptionParts.push('HCAC Conference Match');
  if (match.result) descriptionParts.push(`Result: ${match.result}`);
  const description = descriptionParts.length > 0 ? descriptionParts.join(' | ') : undefined;

  return {
    title,
    description,
    event_type: EventType.MATCH,
    start_datetime: startDatetimeUTC.toISOString(),
    end_datetime: endDatetimeUTC.toISOString(),
    location: match.location,
    gender,
    team_level: teamLevel,
    created_by: createdBy,
    opponent: match.opponent,
    home_away: match.homeAway,
    match_result: match.result,
    is_conference_match: match.isConference,
    external_url: match.liveVideoUrl || match.boxScoreUrl
  };
}

/**
 * Parse multiple lines of schedule text
 */
export function parseScheduleText(
  text: string,
  gender: Gender,
  teamLevel: TeamLevel,
  season: string,
  createdBy: string
): Array<Omit<Event, 'id' | 'created_at' | 'updated_at'>> {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const events: Array<Omit<Event, 'id' | 'created_at' | 'updated_at'>> = [];

  for (const line of lines) {
    const match = parseMatchRow(line);
    if (match) {
      const event = matchToEvent(match, season, gender, teamLevel, createdBy);
      events.push(event);
    }
  }

  return events;
}

/**
 * Simple CSV parser for schedule data
 * Expected format: Date,Time,Opponent,Location,Home/Away,Conference,Result
 */
export function parseScheduleCSV(
  csv: string,
  gender: Gender,
  teamLevel: TeamLevel,
  season: string,
  createdBy: string
): Array<Omit<Event, 'id' | 'created_at' | 'updated_at'>> {
  const lines = csv.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const events: Array<Omit<Event, 'id' | 'created_at' | 'updated_at'>> = [];

  // Skip header row if present
  const startIndex = lines[0].toLowerCase().includes('date') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const parts = lines[i].split(',').map(p => p.trim());
    if (parts.length < 3) continue;

    const match: ParsedMatch = {
      date: parts[0],
      time: parts[1] || undefined,
      opponent: parts[2],
      location: parts[3] || undefined,
      homeAway: (parts[4]?.toLowerCase() === 'home' ? HomeAwayType.HOME :
                 parts[4]?.toLowerCase() === 'away' ? HomeAwayType.AWAY :
                 HomeAwayType.NEUTRAL),
      isConference: parts[5]?.toLowerCase() === 'yes' || parts[5]?.toLowerCase() === 'true',
      result: parts[6] || undefined
    };

    const event = matchToEvent(match, season, gender, teamLevel, createdBy);
    events.push(event);
  }

  return events;
}
