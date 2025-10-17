'use client';

/**
 * RSVP button group for event responses
 * Shows three buttons: Going, Maybe, Not Going
 * Highlights current selection and handles optimistic updates
 * Enhanced with haptic feedback and visual animations
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useEventRsvp, RsvpResponse } from '@/lib/hooks/useEventRsvp';
import { triggerHaptic } from '@/lib/utils/confetti';

interface RsvpButtonsProps {
  eventId: string;
  currentResponse?: RsvpResponse;
  onResponseChange?: () => void;
  disabled?: boolean;
}

export function RsvpButtons({
  eventId,
  currentResponse = 'no_response',
  onResponseChange,
  disabled = false,
}: RsvpButtonsProps) {
  const { updateRsvp, updating } = useEventRsvp();
  const [optimisticResponse, setOptimisticResponse] = useState<RsvpResponse>(currentResponse);

  const handleRsvp = async (response: RsvpResponse) => {
    // Optimistic update
    setOptimisticResponse(response);

    // Haptic feedback
    triggerHaptic('light');

    const success = await updateRsvp(eventId, response);

    if (success) {
      onResponseChange?.();
    } else {
      // Revert on failure
      setOptimisticResponse(currentResponse);
    }
  };

  const isDisabled = disabled || updating;

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant={optimisticResponse === 'going' ? 'default' : 'outline'}
        onClick={() => handleRsvp('going')}
        disabled={isDisabled}
        className={cn(
          'flex items-center gap-1',
          optimisticResponse === 'going' && 'bg-green-600 hover:bg-green-700 border-green-600'
        )}
      >
        <Check className="h-4 w-4" />
        Going
      </Button>

      <Button
        size="sm"
        variant={optimisticResponse === 'maybe' ? 'default' : 'outline'}
        onClick={() => handleRsvp('maybe')}
        disabled={isDisabled}
        className={cn(
          'flex items-center gap-1',
          optimisticResponse === 'maybe' && 'bg-yellow-600 hover:bg-yellow-700 border-yellow-600'
        )}
      >
        <HelpCircle className="h-4 w-4" />
        Maybe
      </Button>

      <Button
        size="sm"
        variant={optimisticResponse === 'not_going' ? 'default' : 'outline'}
        onClick={() => handleRsvp('not_going')}
        disabled={isDisabled}
        className={cn(
          'flex items-center gap-1',
          optimisticResponse === 'not_going' && 'bg-red-600 hover:bg-red-700 border-red-600'
        )}
      >
        <X className="h-4 w-4" />
        Not Going
      </Button>
    </div>
  );
}
