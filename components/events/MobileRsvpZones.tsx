'use client';

/**
 * MobileRsvpZones component
 * Giant tap zones for easy mobile RSVP
 * Top half = Going, Bottom half = Not Going
 * Ultra-intuitive, one-tap interaction
 */

import { useState } from 'react';
import { Check, X, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useEventRsvp, RsvpResponse } from '@/lib/hooks/useEventRsvp';
import { triggerQuickConfetti, triggerHaptic } from '@/lib/utils/confetti';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileRsvpZonesProps {
  eventId: string;
  eventType: 'optional' | 'recommended' | 'mandatory';
  currentResponse?: RsvpResponse;
  onResponseChange?: () => void;
}

export function MobileRsvpZones({
  eventId,
  eventType,
  currentResponse = 'no_response',
  onResponseChange,
}: MobileRsvpZonesProps) {
  const { updateRsvp, updating } = useEventRsvp();
  const [optimisticResponse, setOptimisticResponse] = useState<RsvpResponse>(currentResponse);
  const [showCheckmark, setShowCheckmark] = useState(false);

  const handleRsvp = async (response: RsvpResponse) => {
    // Optimistic update
    setOptimisticResponse(response);

    // Haptic feedback
    triggerHaptic('medium');

    // Show checkmark animation
    setShowCheckmark(true);
    setTimeout(() => setShowCheckmark(false), 1000);

    // Confetti for going to mandatory events
    if (response === 'going' && eventType === 'mandatory') {
      triggerQuickConfetti();
    }

    const success = await updateRsvp(eventId, response);

    if (success) {
      onResponseChange?.();
    } else {
      // Revert on failure
      setOptimisticResponse(currentResponse);
    }
  };

  const isGoing = optimisticResponse === 'going';
  const isNotGoing = optimisticResponse === 'not_going';
  const isMaybe = optimisticResponse === 'maybe';

  return (
    <div className="space-y-2 relative">
      {/* Giant Tap Zones */}
      <div className="grid grid-rows-2 gap-2 min-h-[220px]">
        {/* TOP HALF - GOING */}
        <button
          onClick={() => handleRsvp('going')}
          disabled={updating}
          className={cn(
            'bg-gradient-to-br rounded-xl transition-all duration-300',
            'flex flex-col items-center justify-center gap-2',
            'active:scale-95 disabled:opacity-50',
            'border-2 font-bold text-lg shadow-md',
            isGoing
              ? 'from-green-500 to-green-600 border-green-700 text-white scale-105 shadow-lg'
              : 'from-green-400/80 to-green-500/80 border-green-500/50 text-white hover:from-green-500 hover:to-green-600'
          )}
        >
          <Check className="h-10 w-10" />
          <span>I'M GOING</span>
          {isGoing && (
            <span className="text-xs opacity-90 font-normal">You're attending!</span>
          )}
        </button>

        {/* BOTTOM HALF - NOT GOING */}
        <button
          onClick={() => handleRsvp('not_going')}
          disabled={updating}
          className={cn(
            'bg-gradient-to-br rounded-xl transition-all duration-300',
            'flex flex-col items-center justify-center gap-2',
            'active:scale-95 disabled:opacity-50',
            'border-2 font-bold text-lg shadow-md',
            isNotGoing
              ? 'from-red-500 to-red-600 border-red-700 text-white scale-105 shadow-lg'
              : 'from-red-400/80 to-red-500/80 border-red-500/50 text-white hover:from-red-500 hover:to-red-600'
          )}
        >
          <X className="h-10 w-10" />
          <span>CAN'T MAKE IT</span>
          {isNotGoing && (
            <span className="text-xs opacity-90 font-normal">You're not attending</span>
          )}
        </button>
      </div>

      {/* MAYBE - Small button */}
      <button
        onClick={() => handleRsvp('maybe')}
        disabled={updating}
        className={cn(
          'w-full py-3 rounded-lg transition-all duration-300',
          'flex items-center justify-center gap-2',
          'active:scale-95 disabled:opacity-50',
          'border-2 text-sm font-medium shadow-sm',
          isMaybe
            ? 'bg-yellow-500 border-yellow-600 text-white'
            : 'bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100'
        )}
      >
        <HelpCircle className="h-4 w-4" />
        <span>{isMaybe ? 'You marked Maybe' : 'Maybe / Not Sure'}</span>
      </button>

      {/* Animated Checkmark Overlay */}
      <AnimatePresence>
        {showCheckmark && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center">
              <Check className="h-16 w-16 text-green-600" strokeWidth={3} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
