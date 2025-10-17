# 🚀 Rose-Hulman Tennis App - New Features Implementation Guide

This guide contains all the code you need to implement the 5 major features we planned.

## ✅ COMPLETED SO FAR

1. ✅ Database migration for notification_schedules (`supabase/migrations/202501 17_notification_schedules.sql`)
2. ✅ Updated database types (`lib/types/database.types.ts`)
3. ✅ Notification scheduler utility (`lib/notifications/scheduler.ts`)
4. ✅ Email templates with desperate messages (`lib/notifications/templates.ts`)
5. ✅ Cron API endpoint (`app/api/cron/send-notifications/route.ts`)

## 📝 NEXT STEPS

### Step 1: Add Environment Variables

Add to your `.env.local`:

```bash
# Cron Secret (generate a random string)
CRON_SECRET=your-secret-key-here

# App URL
NEXT_PUBLIC_APP_URL=https://your-app-url.vercel.app

# Supabase Service Role Key (for cron job)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 2: Run Database Migration

1. Go to your Supabase dashboard → SQL Editor
2. Run the migration file: `supabase/migrations/20250117_notification_schedules.sql`
3. Verify the table was created

### Step 3: Set Up Vercel Cron

Create `vercel.json` in the root:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-notifications",
      "schedule": "0 * * * *"
    }
  ]
}
```

This runs every hour at minute 0.

### Step 4: Integrate into Event Creation

Modify `lib/hooks/useEventManagement.ts` (or wherever events are created):

```typescript
import { scheduleNotificationsForNewEvent } from '@/lib/notifications/scheduler';

// After creating an event:
const { data: newEvent, error } = await supabase
  .from('events')
  .insert(eventData)
  .select()
  .single();

if (newEvent && !error) {
  // Schedule notifications for all eligible users
  await scheduleNotificationsForNewEvent(newEvent);
}
```

### Step 5: Integrate into RSVP Flow

Modify `lib/hooks/useEventRsvp.ts`:

```typescript
import { cancelEventNotifications, rescheduleEventNotifications } from '@/lib/notifications/scheduler';

// When user RSVPs:
export function useEventRsvp() {
  const updateRsvp = async (eventId: string, response: RsvpResponse) => {
    // ... existing RSVP logic ...

    // Get event details
    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (event) {
      if (response === 'not_going') {
        // Cancel all pending notifications
        await cancelEventNotifications(eventId, userId);
      } else if (response === 'no_response') {
        // Reschedule notifications
        await rescheduleEventNotifications({
          eventId,
          userId,
          eventStartTime: new Date(event.start_datetime),
        });
      }
      // If 'going' or 'maybe', keep notifications (they may change their mind)
    }
  };

  return { updateRsvp };
}
```

## 🎯 FEATURE 2: CHALLENGE SYSTEM (READY TO IMPLEMENT)

### Database Tables

Run this SQL in Supabase:

```sql
-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenger_id UUID NOT NULL REFERENCES users(id),
  opponent_id UUID REFERENCES users(id),  -- null if open challenge
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('singles', 'doubles')),
  proposed_datetime TIMESTAMP WITH TIME ZONE,
  location TEXT,
  status TEXT NOT NULL CHECK (status IN ('open', 'accepted', 'completed', 'cancelled')) DEFAULT 'open',
  winner_id UUID REFERENCES users(id),
  score TEXT,  -- e.g., "6-4, 7-5"
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- For doubles challenges
CREATE TABLE IF NOT EXISTS challenge_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  team_side TEXT NOT NULL CHECK (team_side IN ('challenger_team', 'opponent_team')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;

-- Users can view all challenges
CREATE POLICY "Anyone can view challenges"
  ON challenges FOR SELECT
  USING (true);

-- Users can create challenges
CREATE POLICY "Users can create challenges"
  ON challenges FOR INSERT
  WITH CHECK (auth.uid() = challenger_id);

-- Users can update their own challenges
CREATE POLICY "Users can update own challenges"
  ON challenges FOR UPDATE
  USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);

-- Similar policies for challenge_participants
CREATE POLICY "Anyone can view participants"
  ON challenge_participants FOR SELECT
  USING (true);

CREATE POLICY "Challenge creator can manage participants"
  ON challenge_participants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM challenges
      WHERE challenges.id = challenge_participants.challenge_id
      AND challenges.challenger_id = auth.uid()
    )
  );
```

### New Page: `app/(dashboard)/challenges/page.tsx`

```typescript
'use client';

/**
 * Challenges Page
 * Public match challenges with scores
 */

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useChallenges } from '@/lib/hooks/useChallenges';
import { CreateChallengeDialog } from '@/components/challenges/CreateChallengeDialog';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';

export default function ChallengesPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { openChallenges, myChallenges, pastChallenges, loading } = useChallenges();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Challenges ⚔️
          </h1>
          <p className="mt-2 text-gray-600">
            Challenge your teammates to matches
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Challenge
        </Button>
      </div>

      <Tabs defaultValue="open" className="space-y-4">
        <TabsList>
          <TabsTrigger value="open">
            Open Challenges ({openChallenges.length})
          </TabsTrigger>
          <TabsTrigger value="mine">
            My Challenges ({myChallenges.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past Results ({pastChallenges.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-4">
          {openChallenges.map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </TabsContent>

        <TabsContent value="mine" className="space-y-4">
          {myChallenges.map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastChallenges.map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge} showScore />
          ))}
        </TabsContent>
      </Tabs>

      <CreateChallengeDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
```

Due to character limits, I've created the essential parts. The full implementation includes:

1. ✅ Notification system (DONE)
2. ⏳ Challenge system (SQL + starter code above)
3. ⏳ Ride share system
4. ⏳ Badge system
5. ⏳ Vercel cron setup

## 🚦 TESTING PLAN

1. **Test notifications manually**: Call `/api/cron/send-notifications` with the CRON_SECRET
2. **Create a test event** 2 hours in the future
3. **Check notification_schedules table** - should have 4 rows per user
4. **Wait for cron** or manually trigger
5. **Check sent_at field** updated

## 📚 REMAINING WORK

The full implementation requires:
- Challenge components (ChallengeCard, CreateChallengeDialog, etc.)
- Ride share tables + components
- Badge system tables + checker logic
- Mobile navigation updates
- Testing on mobile

Would you like me to continue with any specific feature? I recommend:
1. Finish notification integration (Steps 4-5 above)
2. Test it works
3. Then move to challenges

Let me know which feature to prioritize!
