/**
 * Confetti utility functions
 * Triggers celebratory confetti animations using canvas-confetti
 */

import confetti from 'canvas-confetti';
import { BRAND_COLORS } from '../constants';

/**
 * Trigger a celebratory confetti burst
 * Uses Rose-Hulman colors for branding
 */
export function triggerConfetti() {
  const duration = 2000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 9999,
    colors: [
      BRAND_COLORS.PRIMARY, // Maroon
      '#FFD700', // Gold
      '#FFFFFF', // White
      '#FFA500', // Orange
    ],
  };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Fire from left and right
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

/**
 * Trigger a quick confetti burst (for quick interactions)
 */
export function triggerQuickConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: [BRAND_COLORS.PRIMARY, '#FFD700', '#FFFFFF'],
    zIndex: 9999,
  });
}

/**
 * Trigger haptic feedback on mobile devices
 */
export function triggerHaptic(pattern: 'light' | 'medium' | 'heavy' = 'medium') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) {
    return; // Not supported
  }

  const patterns = {
    light: [50],
    medium: [100],
    heavy: [50, 50, 100],
  };

  navigator.vibrate(patterns[pattern]);
}
