'use client';

/**
 * CreateChallengeDialog Component
 * Form to create a new challenge
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import { Textarea } from '@/components/ui/textarea';
import { useChallenges } from '@/lib/hooks/useChallenges';
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@/lib/types/database.types';
import { useAuth } from '@/lib/hooks/useAuth';
import confetti from 'canvas-confetti';

interface CreateChallengeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateChallengeDialog({
  open,
  onOpenChange,
}: CreateChallengeDialogProps) {
  const { user } = useAuth();
  const { createChallenge } = useChallenges();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const [formData, setFormData] = useState({
    challenge_type: 'singles' as 'singles' | 'doubles',
    opponent_id: '',
    proposed_datetime: '',
    location: '',
    notes: '',
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Load users for opponent selection
  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .neq('id', user?.id)
        .order('first_name');

      if (data) setUsers(data);
    };

    if (open) fetchUsers();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const challengeData = {
      ...formData,
      opponent_id: formData.opponent_id || undefined,
      proposed_datetime: formData.proposed_datetime || undefined,
      location: formData.location || undefined,
      notes: formData.notes || undefined,
    };

    const { error } = await createChallenge(challengeData);

    if (!error) {
      // Success confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Reset form
      setFormData({
        challenge_type: 'singles',
        opponent_id: '',
        proposed_datetime: '',
        location: '',
        notes: '',
      });

      onOpenChange(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Challenge ⚔️</DialogTitle>
          <DialogDescription>
            Challenge a teammate to a match or post an open challenge
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Challenge Type */}
          <div>
            <Label>Match Type</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, challenge_type: 'singles' })
                }
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.challenge_type === 'singles'
                    ? 'border-rose-600 bg-rose-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">🎾</div>
                <div className="font-semibold">Singles</div>
                <div className="text-xs text-gray-500">1v1</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, challenge_type: 'doubles' })
                }
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.challenge_type === 'doubles'
                    ? 'border-rose-600 bg-rose-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">👥</div>
                <div className="font-semibold">Doubles</div>
                <div className="text-xs text-gray-500">2v2</div>
              </button>
            </div>
          </div>

          {/* Opponent Selection */}
          <div>
            <Label htmlFor="opponent">Opponent (Optional)</Label>
            <select
              id="opponent"
              value={formData.opponent_id}
              onChange={(e) =>
                setFormData({ ...formData, opponent_id: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 p-2 border"
            >
              <option value="">Open Challenge (anyone can accept)</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.first_name} {u.last_name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to let anyone accept your challenge
            </p>
          </div>

          {/* Date/Time */}
          <div>
            <Label htmlFor="datetime">Proposed Date & Time (Optional)</Label>
            <Input
              id="datetime"
              type="datetime-local"
              value={formData.proposed_datetime}
              onChange={(e) =>
                setFormData({ ...formData, proposed_datetime: e.target.value })
              }
              className="mt-1"
            />
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g., Court 1, Rose-Hulman"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="mt-1"
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any details about the challenge..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="mt-1"
            />
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
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Creating...' : 'Create Challenge'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
