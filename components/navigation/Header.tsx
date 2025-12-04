'use client';

/**
 * Header - Context-aware top header bar
 * Sticky with backdrop blur, shows page title and user menu
 */

import { motion } from 'framer-motion';
import { UserMenu } from './UserMenu';
import { shadows } from '@/lib/design-tokens';
import type { User } from '@/lib/types/database.types';

interface HeaderProps {
  profile: User;
  isAdmin: boolean;
  title?: string;
}

export function Header({ profile, isAdmin, title }: HeaderProps) {
  const displayTitle = title || `Welcome, ${profile.first_name}!`;

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/80 backdrop-blur-lg px-4 sm:px-6 lg:px-8"
      style={{
        boxShadow: shadows.sm,
      }}
    >
      <div className="flex flex-1 gap-x-4 self-stretch">
        {/* Page title */}
        <div className="flex flex-1 items-center">
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg font-semibold text-gray-900"
          >
            {displayTitle}
          </motion.h2>
        </div>

        {/* User menu */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-x-4"
        >
          <UserMenu profile={profile} isAdmin={isAdmin} variant="header" />
        </motion.div>
      </div>
    </motion.header>
  );
}
