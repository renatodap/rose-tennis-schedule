'use client';

/**
 * Challenges Page
 * Public match challenges with scores
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Swords } from 'lucide-react';
import { useChallenges } from '@/lib/hooks/useChallenges';
import { CreateChallengeDialog } from '@/components/challenges/CreateChallengeDialog';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { BRAND_COLORS } from '@/lib/constants';

export default function ChallengesPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const {
    openChallenges,
    myChallenges,
    pastChallenges,
    loading,
    acceptChallenge,
    cancelChallenge,
  } = useChallenges();

  const handleAccept = async (id: string) => {
    await acceptChallenge(id);
  };

  const handleCancel = async (id: string) => {
    await cancelChallenge(id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: BRAND_COLORS.PRIMARY }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Swords className="w-8 h-8" style={{ color: BRAND_COLORS.PRIMARY }} />
            Challenges
          </h1>
          <p className="mt-2 text-gray-600">
            Challenge your teammates to matches and track scores
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="shrink-0"
          style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Challenge
        </Button>
      </div>

      {/* Stats Cards (Mobile-first) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Open Challenges</div>
          <div className="text-3xl font-bold mt-1" style={{ color: BRAND_COLORS.PRIMARY }}>
            {openChallenges.length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">My Active</div>
          <div className="text-3xl font-bold mt-1" style={{ color: BRAND_COLORS.PRIMARY }}>
            {myChallenges.length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-3xl font-bold mt-1 text-gray-700">
            {pastChallenges.length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="open" className="space-y-4">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="open">
            Open <span className="ml-1">({openChallenges.length})</span>
          </TabsTrigger>
          <TabsTrigger value="mine">
            Mine <span className="ml-1">({myChallenges.length})</span>
          </TabsTrigger>
          <TabsTrigger value="past">
            Past <span className="ml-1">({pastChallenges.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Open Challenges */}
        <TabsContent value="open" className="space-y-4">
          {openChallenges.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Swords className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                No Open Challenges
              </h3>
              <p className="text-gray-500 mb-4">
                Be the first to create a challenge!
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                Create Challenge
              </Button>
            </div>
          ) : (
            openChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onAccept={handleAccept}
              />
            ))
          )}
        </TabsContent>

        {/* My Challenges */}
        <TabsContent value="mine" className="space-y-4">
          {myChallenges.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Swords className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                No Active Challenges
              </h3>
              <p className="text-gray-500 mb-4">
                Create or accept a challenge to get started
              </p>
            </div>
          ) : (
            myChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onCancel={challenge.status === 'open' ? handleCancel : undefined}
              />
            ))
          )}
        </TabsContent>

        {/* Past Challenges */}
        <TabsContent value="past" className="space-y-4">
          {pastChallenges.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Swords className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                No Completed Matches
              </h3>
              <p className="text-gray-500">
                Complete a challenge to see results here
              </p>
            </div>
          ) : (
            pastChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                showScore
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Create Challenge Dialog */}
      <CreateChallengeDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
