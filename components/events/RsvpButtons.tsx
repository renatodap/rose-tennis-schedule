'use client';

/**
 * RSVP Button Group - $100M DESIGN SYSTEM
 * One-tap RSVP with instant visual feedback, success animations, and loading states
 * Touch-optimized (44px min height) with clear visual states
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, HelpCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useEventRsvp, RsvpResponse } from '@/lib/hooks/useEventRsvp';
import { motion, AnimatePresence } from 'framer-motion';

interface RsvpButtonsProps {
  eventId: string;
  currentResponse?: RsvpResponse;
  onResponseChange?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function RsvpButtons({
  eventId,
  currentResponse = 'no_response',
  onResponseChange,
  disabled = false,
  fullWidth = false,
}: RsvpButtonsProps) {
  const { updateRsvp, updating } = useEventRsvp();
  const [optimisticResponse, setOptimisticResponse] = useState<RsvpResponse>(currentResponse);
  const [showSuccessCheck, setShowSuccessCheck] = useState(false);

  // Sync with prop changes
  useEffect(() => {
    setOptimisticResponse(currentResponse);
  }, [currentResponse]);

  const handleRsvp = async (response: RsvpResponse) => {
    // Optimistic update
    setOptimisticResponse(response);

    const success = await updateRsvp(eventId, response);

    if (success) {
      // Show success animation
      setShowSuccessCheck(true);
      setTimeout(() => setShowSuccessCheck(false), 1500);
      onResponseChange?.();
    } else {
      // Revert on failure
      setOptimisticResponse(currentResponse);
    }
  };

  const isDisabled = disabled || updating;

  return (
    <div className={cn('relative flex gap-2', fullWidth && 'w-full')}>
      {/* Going Button */}
      <Button
        size="default"
        variant={optimisticResponse === 'going' ? 'success' : 'outline'}
        onClick={() => handleRsvp('going')}
        disabled={isDisabled}
        fullWidth={fullWidth}
        className={cn(
          'flex-1 min-h-[44px] font-semibold transition-all duration-200',
          optimisticResponse === 'going' && 'shadow-md'
        )}
        iconLeft={<Check className="h-5 w-5" />}
      >
        {updating && optimisticResponse === 'going' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          'Going'
        )}
      </Button>

      {/* Maybe Button */}
      <Button
        size="default"
        variant={optimisticResponse === 'maybe' ? 'warning' : 'outline'}
        onClick={() => handleRsvp('maybe')}
        disabled={isDisabled}
        fullWidth={fullWidth}
        className={cn(
          'flex-1 min-h-[44px] font-semibold transition-all duration-200',
          optimisticResponse === 'maybe' && 'shadow-md'
        )}
        iconLeft={<HelpCircle className="h-5 w-5" />}
      >
        {updating && optimisticResponse === 'maybe' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          'Maybe'
        )}
      </Button>

      {/* Not Going Button */}
      <Button
        size="default"
        variant={optimisticResponse === 'not_going' ? 'destructive' : 'outline'}
        onClick={() => handleRsvp('not_going')}
        disabled={isDisabled}
        fullWidth={fullWidth}
        className={cn(
          'flex-1 min-h-[44px] font-semibold transition-all duration-200',
          optimisticResponse === 'not_going' && 'shadow-md'
        )}
        iconLeft={<X className="h-5 w-5" />}
      >
        {updating && optimisticResponse === 'not_going' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          "Can't Go"
        )}
      </Button>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccessCheck && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-green-500">
              <Check className="h-10 w-10 text-green-600" strokeWidth={3} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
