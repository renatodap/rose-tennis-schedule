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
import { motion, AnimatePresence } from 'framer-motion';

interface MobileRsvpZonesProps {
  eventId: string;
  eventType: 'optional' | 'recommended' | 'mandatory' | 'match';
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

    // Show checkmark animation
    setShowCheckmark(true);
    setTimeout(() => setShowCheckmark(false), 1000);

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
    <div className="space-y-3 relative">
      {/* Giant Tap Zones */}
      <div className="grid grid-rows-2 gap-3 min-h-[240px]">
        {/* TOP HALF - GOING */}
        <motion.button
          onClick={() => handleRsvp('going')}
          disabled={updating}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'bg-gradient-to-br rounded-2xl transition-all duration-300',
            'flex flex-col items-center justify-center gap-2',
            'disabled:opacity-50',
            'border-2 font-bold text-lg shadow-lg',
            'min-h-[110px]',
            isGoing
              ? 'from-green-500 to-green-600 border-green-700 text-white scale-105 shadow-xl'
              : 'from-green-400/90 to-green-500/90 border-green-500 text-white hover:from-green-500 hover:to-green-600'
          )}
        >
          <Check className="h-12 w-12" strokeWidth={3} />
          <span className="text-xl">I'M GOING</span>
          {isGoing && (
            <span className="text-xs opacity-90 font-normal">You're attending!</span>
          )}
        </motion.button>

        {/* BOTTOM HALF - NOT GOING */}
        <motion.button
          onClick={() => handleRsvp('not_going')}
          disabled={updating}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'bg-gradient-to-br rounded-2xl transition-all duration-300',
            'flex flex-col items-center justify-center gap-2',
            'disabled:opacity-50',
            'border-2 font-bold text-lg shadow-lg',
            'min-h-[110px]',
            isNotGoing
              ? 'from-red-500 to-red-600 border-red-700 text-white scale-105 shadow-xl'
              : 'from-red-400/90 to-red-500/90 border-red-500 text-white hover:from-red-500 hover:to-red-600'
          )}
        >
          <X className="h-12 w-12" strokeWidth={3} />
          <span className="text-xl">CAN'T MAKE IT</span>
          {isNotGoing && (
            <span className="text-xs opacity-90 font-normal">You're not attending</span>
          )}
        </motion.button>
      </div>

      {/* MAYBE - Small button */}
      <motion.button
        onClick={() => handleRsvp('maybe')}
        disabled={updating}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'w-full py-4 rounded-xl transition-all duration-300',
          'flex items-center justify-center gap-2',
          'disabled:opacity-50',
          'border-2 font-semibold shadow-md',
          'min-h-[52px]',
          isMaybe
            ? 'bg-amber-500 border-amber-600 text-white shadow-lg'
            : 'bg-amber-50 border-amber-400 text-amber-700 hover:bg-amber-100'
        )}
      >
        <HelpCircle className="h-5 w-5" />
        <span className="text-base">{isMaybe ? 'You marked Maybe' : 'Maybe / Not Sure'}</span>
      </motion.button>

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
