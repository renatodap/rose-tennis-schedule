'use client';

/**
 * Notification Permission Prompt Component
 * Prompts users to enable push notifications on first visit
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, X } from 'lucide-react';
import {
  isPushNotificationSupported,
  getNotificationPermission,
  subscribeToPushNotifications,
  isSubscribedToPush,
} from '@/lib/notifications/push';
import { useAuth } from '@/lib/hooks/useAuth';

const DISMISSED_KEY = 'notification-prompt-dismissed';

export default function NotificationPermissionPrompt() {
  const { user } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    // Check if we should show the prompt
    const checkPromptStatus = async () => {
      // Don't show if user is not logged in
      if (!user) {
        setShowPrompt(false);
        return;
      }

      // Don't show if push notifications not supported
      if (!isPushNotificationSupported()) {
        setShowPrompt(false);
        return;
      }

      // Don't show if user previously dismissed
      const dismissed = localStorage.getItem(DISMISSED_KEY);
      if (dismissed === 'true') {
        setShowPrompt(false);
        return;
      }

      // Don't show if permission already granted or denied
      const permission = getNotificationPermission();
      if (permission !== 'default') {
        setShowPrompt(false);
        return;
      }

      // Don't show if already subscribed
      const subscribed = await isSubscribedToPush();
      if (subscribed) {
        setShowPrompt(false);
        return;
      }

      // Show the prompt after a short delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
    };

    checkPromptStatus();
  }, [user]);

  const handleEnable = async () => {
    if (!user) return;

    setIsSubscribing(true);

    try {
      const subscription = await subscribeToPushNotifications(user.id);

      if (subscription) {
        console.log('Push notifications enabled successfully');
        setShowPrompt(false);
      } else {
        console.error('Failed to enable push notifications');
        // User might have denied permission
        localStorage.setItem(DISMISSED_KEY, 'true');
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('Error enabling push notifications:', error);
      setShowPrompt(false);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Stay in the loop!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Get instant notifications for upcoming practices, matches, and events.
                  We'll send you reminders so you never miss a thing.
                </p>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleEnable}
                    disabled={isSubscribing}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                  >
                    {isSubscribing ? 'Enabling...' : 'Enable Notifications'}
                  </button>
                  <button
                    onClick={handleDismiss}
                    disabled={isSubscribing}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors disabled:cursor-not-allowed"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
