'use client';

/**
 * ChallengeCard Component
 * Displays a single challenge with actions
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, MapPin, Users, Swords, Check, X } from 'lucide-react';
import { ChallengeWithPlayers } from '@/lib/hooks/useChallenges';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { RecordScoreDialog } from './RecordScoreDialog';
import { formatDistanceToNow } from 'date-fns';

interface ChallengeCardProps {
  challenge: ChallengeWithPlayers;
  onAccept?: (id: string) => Promise<void>;
  onCancel?: (id: string) => Promise<void>;
  showScore?: boolean;
}

export function ChallengeCard({
  challenge,
  onAccept,
  onCancel,
  showScore = false,
}: ChallengeCardProps) {
  const { user } = useAuth();
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const isChallenger = challenge.challenger_id === user?.id;
  const isOpponent = challenge.opponent_id === user?.id;
  const isParticipant = isChallenger || isOpponent;

  const handleAccept = async () => {
    if (!onAccept) return;
    setIsAccepting(true);
    await onAccept(challenge.id);
    setIsAccepting(false);
  };

  const handleCancel = async () => {
    if (!onCancel) return;
    setIsCancelling(true);
    await onCancel(challenge.id);
    setIsCancelling(false);
  };

  const getStatusBadge = () => {
    switch (challenge.status) {
      case 'open':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Open
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Accepted
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelled
          </span>
        );
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
              <Swords className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {challenge.challenger.first_name} {challenge.challenger.last_name}
                {challenge.opponent && (
                  <>
                    {' vs '}
                    {challenge.opponent.first_name} {challenge.opponent.last_name}
                  </>
                )}
              </h3>
              <p className="text-sm text-gray-500 capitalize">
                {challenge.challenge_type}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {challenge.proposed_datetime && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(challenge.proposed_datetime).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}

          {challenge.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{challenge.location}</span>
            </div>
          )}

          {challenge.notes && (
            <p className="text-sm text-gray-600 mt-2">{challenge.notes}</p>
          )}

          {showScore && challenge.score && challenge.winner && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-amber-900">
                  {challenge.winner.first_name} {challenge.winner.last_name} won!
                </span>
              </div>
              <p className="text-sm text-amber-800">Score: {challenge.score}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          {/* Open challenge - can accept */}
          {challenge.status === 'open' && !isChallenger && onAccept && (
            <Button
              onClick={handleAccept}
              disabled={isAccepting}
              className="flex-1"
              size="sm"
            >
              <Check className="w-4 h-4 mr-2" />
              {isAccepting ? 'Accepting...' : 'Accept Challenge'}
            </Button>
          )}

          {/* Accepted challenge - can record score */}
          {challenge.status === 'accepted' && isParticipant && (
            <Button
              onClick={() => setShowScoreDialog(true)}
              className="flex-1"
              size="sm"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Record Score
            </Button>
          )}

          {/* Can cancel own open challenges */}
          {challenge.status === 'open' && isChallenger && onCancel && (
            <Button
              onClick={handleCancel}
              disabled={isCancelling}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              {isCancelling ? 'Cancelling...' : 'Cancel'}
            </Button>
          )}
        </div>

        {/* Time ago */}
        <p className="text-xs text-gray-400 mt-3">
          {formatDistanceToNow(new Date(challenge.created_at), { addSuffix: true })}
        </p>
      </motion.div>

      {showScoreDialog && (
        <RecordScoreDialog
          challenge={challenge}
          open={showScoreDialog}
          onOpenChange={setShowScoreDialog}
        />
      )}
    </>
  );
}
