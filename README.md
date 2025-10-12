# Rose-Hulman Tennis Team Availability App

A modern, mobile-first web application for managing the Rose-Hulman Tennis team's practice availability, schedules, events, and team communication.

## Features

### For All Users (Players, Captains, Coaches)
- **Authentication**: Secure sign-up, sign-in, and password reset
- **Class Schedule Management**: Set up recurring weekly class schedules per quarter with automatic persistence throughout the quarter
- **Availability Blocking**:
  - Recurring blockers (e.g., "Every Tuesday 7-9pm")
  - One-time blockers for specific dates
- **Practice Availability**: Mark when you're available for practice ("want to hit")
- **Team Events**: View team events, RSVP, and get reminders
- **Custom Forms**: Fill out and submit forms sent by coaches/captains
- **Profile Management**: View and update your profile information

### For Coaches & Captains
- **Availability Dashboard**: View aggregated team availability to find optimal practice times
- **Event Management**: Create and manage team events (optional, recommended, mandatory)
- **Form Builder**: Create custom forms with multiple question types
- **Team Management**: View all team members, assign JV/Varsity levels
- **Analytics**: View form responses and team participation statistics

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom Rose-Hulman theme
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Date/Time**: date-fns with timezone support (America/Indiana/Indianapolis)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- A Vercel account (for deployment)

### Local Development Setup

1. **Clone the repository**
   ```bash
   cd rose-available-tennis
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   a. Create a new project at [supabase.com](https://supabase.com)

   b. Run the database migrations in the Supabase SQL Editor:
      - Execute `supabase/migrations/001_initial_schema.sql`
      - Execute `supabase/migrations/002_rls_policies.sql`

   c. Configure authentication in Supabase Dashboard:
      - Go to Authentication → Settings
      - Enable Email provider
      - Set Site URL to your app URL (e.g., `http://localhost:3000` for local dev)
      - Configure email templates with Rose-Hulman branding

4. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME="Rose-Hulman Tennis"
   ```

   Get your Supabase credentials from:
   - Project URL: Supabase Dashboard → Settings → API
   - Anon Key: Supabase Dashboard → Settings → API
   - Service Role Key: Supabase Dashboard → Settings → API (keep this secret!)

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Setting Up Coaches and Captains

After users sign up through the app, you need to manually update their roles in the database:

```sql
-- Set coaches
UPDATE users SET role = 'coach'
WHERE email IN ('matt.wilson@rose-hulman.edu', 'amanda.lubold@rose-hulman.edu');

-- Set captains
UPDATE users SET role = 'captain'
WHERE email IN (
  'chris.lian@rose-hulman.edu',
  'camille.clark@rose-hulman.edu',
  'renato.prado@rose-hulman.edu'
);
```

Run these queries in the Supabase SQL Editor after the users have signed up.

## Deployment to Vercel

### First-Time Deployment

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/rose-hulman-tennis.git
   git push -u origin main
   ```

2. **Deploy to Vercel**

   a. Go to [vercel.com](https://vercel.com) and sign in

   b. Click "Add New Project"

   c. Import your GitHub repository

   d. Configure the project:
      - Framework Preset: Next.js
      - Root Directory: `./`
      - Build Command: `npm run build`
      - Output Directory: `.next`

   e. Add environment variables (same as `.env.local` but use production Supabase URL):
      ```
      NEXT_PUBLIC_SUPABASE_URL
      NEXT_PUBLIC_SUPABASE_ANON_KEY
      SUPABASE_SERVICE_ROLE_KEY
      NEXT_PUBLIC_APP_URL (set to your Vercel domain)
      NEXT_PUBLIC_APP_NAME
      ```

   f. Click "Deploy"

3. **Update Supabase Site URL**

   After deployment, go to Supabase Dashboard → Authentication → Settings and add your Vercel domain to the Site URL and Redirect URLs list.

### Continuous Deployment

After the initial setup, Vercel will automatically deploy:
- **Production**: When you push to the `main` branch
- **Preview**: When you create a pull request

## Project Structure

```
rose-available-tennis/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   └── forgot-password/
│   ├── (dashboard)/              # Protected dashboard pages
│   │   ├── dashboard/            # Main dashboard
│   │   ├── schedule/             # Class schedule management
│   │   ├── availability/         # Practice availability
│   │   ├── events/               # Team events
│   │   ├── profile/              # User profile
│   │   └── admin/                # Admin pages (coaches/captains)
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── auth/                     # Authentication components
│   ├── schedule/                 # Schedule components
│   ├── availability/             # Availability components
│   ├── events/                   # Event components
│   ├── forms/                    # Form components
│   ├── calendar/                 # Calendar components
│   └── navigation/               # Navigation components
├── lib/
│   ├── supabase/                 # Supabase client configuration
│   ├── utils/                    # Utility functions
│   ├── hooks/                    # React hooks
│   ├── types/                    # TypeScript types
│   └── constants.ts              # App constants
├── supabase/
│   ├── migrations/               # Database migrations
│   └── seed.sql                  # Seed data
├── public/                       # Static assets
├── .env.example                  # Environment variables template
└── README.md                     # This file
```

## Database Schema

### Core Tables

- **users**: User profiles (extends Supabase auth.users)
- **class_schedules**: Recurring weekly class schedules per quarter
- **recurring_blockers**: Weekly recurring unavailable times
- **one_time_blockers**: Specific date/time unavailability
- **practice_availability**: When players want to practice
- **events**: Team events (practices, matches, meetings)
- **event_responses**: RSVP tracking for events
- **forms**: Custom forms created by coaches/captains
- **form_responses**: User responses to forms

### Security

All tables use Row Level Security (RLS) policies to ensure:
- Users can only view/edit their own data
- Coaches and captains have read access to all data
- Only coaches can modify team levels (JV/Varsity)
- Only coaches and captains can create/manage events and forms

## Quarter System

The app uses an academic quarter system:

- **Fall 2025**: Sept 4 - Nov 24 (with Fall Break Oct 9-10)
- **Winter 2025-26**: Dec 1 - Mar 2 (with Holiday Break & MLK Day)
- **Spring 2026**: Mar 9 - Jun 2 (with Spring Break & Memorial Day)
- **Summer 2026**: Jun 4 - Aug 26 (with Independence Day & Summer Break)

Class schedules automatically apply to all weeks in the quarter (excluding breaks).

## Timezone

All times are handled in **America/Indiana/Indianapolis** timezone (Eastern Time, Terre Haute local time).

## Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow Next.js 14 App Router patterns
- Server Components by default, Client Components only when necessary
- Use shadcn/ui components for consistency
- Follow mobile-first responsive design principles

### Adding New Features

1. Create database migrations in `supabase/migrations/`
2. Update TypeScript types in `lib/types/database.types.ts`
3. Add RLS policies for new tables
4. Create UI components in `components/`
5. Add page routes in `app/`
6. Test on mobile devices (320px minimum width)

## Support & Maintenance

### Common Tasks

**Reset a User's Password:**
- User clicks "Forgot Password" on sign-in page
- Or admin can send reset link via Supabase Dashboard → Authentication → Users

**Promote User to Captain:**
```sql
UPDATE users SET role = 'captain' WHERE email = 'user@rose-hulman.edu';
```

**Assign JV/Varsity Level:**
- Coaches can do this in the Admin → Team Management page
- Or via SQL:
```sql
UPDATE users SET team_level = 'varsity' WHERE email = 'user@rose-hulman.edu';
```

### Monitoring

- **Vercel Dashboard**: Monitor deployments, errors, and performance
- **Supabase Dashboard**: Monitor database usage, API calls, and auth
- Check logs for errors and user activity

## Contributing

This is an internal Rose-Hulman Tennis team application. For feature requests or bug reports:

1. Create an issue in the GitHub repository
2. Contact the team administrator
3. For urgent issues, contact the development team directly

## License

Internal use only - Rose-Hulman Institute of Technology Tennis Team

## Credits

Built with modern web technologies for the Rose-Hulman Tennis team.

**Coaches:**
- Matt Wilson (Men's Coach)
- Amanda Lubold (Women's Coach)

**Captains:**
- Chris Lian
- Camille Clark
- Renato Prado

---

**Last Updated**: October 2025
