'use client';

/**
 * RecordScoreDialog Component
 * Form to record match score and winner
 */

import { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useChallenges, ChallengeWithPlayers } from '@/lib/hooks/useChallenges';

interface RecordScoreDialogProps {
  challenge: ChallengeWithPlayers;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecordScoreDialog({
  challenge,
  open,
  onOpenChange,
}: RecordScoreDialogProps) {
  const { recordScore } = useChallenges();
  const [loading, setLoading] = useState(false);
  const [winnerId, setWinnerId] = useState('');
  const [score, setScore] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!winnerId || !score) return;

    setLoading(true);
    const { error } = await recordScore(challenge.id, winnerId, score);

    if (!error) {
      // Victory confetti!
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FF0000', '#00FF00', '#0000FF', '#FFD700'],
      });

      onOpenChange(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Match Score 🏆</DialogTitle>
          <DialogDescription>
            Who won the match between {challenge.challenger.first_name} and{' '}
            {challenge.opponent?.first_name}?
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Winner Selection */}
          <div>
            <Label>Winner</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={() => setWinnerId(challenge.challenger_id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  winnerId === challenge.challenger_id
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">
                  {winnerId === challenge.challenger_id ? '🏆' : '🎾'}
                </div>
                <div className="font-semibold">
                  {challenge.challenger.first_name}
                </div>
                <div className="text-xs text-gray-500">Challenger</div>
              </button>

              {challenge.opponent && (
                <button
                  type="button"
                  onClick={() => setWinnerId(challenge.opponent!.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    winnerId === challenge.opponent.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">
                    {winnerId === challenge.opponent.id ? '🏆' : '🎾'}
                  </div>
                  <div className="font-semibold">
                    {challenge.opponent.first_name}
                  </div>
                  <div className="text-xs text-gray-500">Opponent</div>
                </button>
              )}
            </div>
          </div>

          {/* Score Input */}
          <div>
            <Label htmlFor="score">Final Score</Label>
            <Input
              id="score"
              type="text"
              placeholder="e.g., 6-4, 7-5 or 6-3, 4-6, 10-8"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the score in standard tennis format
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !winnerId || !score}
              className="flex-1"
            >
              {loading ? 'Recording...' : 'Record Score'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
