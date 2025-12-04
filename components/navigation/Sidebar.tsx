'use client';

/**
 * Sidebar - Premium desktop sidebar navigation
 * Fixed position, brand-focused, user context at bottom
 */

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { NavItem } from './NavItem';
import { UserMenu } from './UserMenu';
import { Home, User as UserIcon } from 'lucide-react';
import { colors } from '@/lib/design-tokens';
import type { User } from '@/lib/types/database.types';

interface SidebarProps {
  profile: User;
  isAdmin: boolean;
}

export function Sidebar({ profile, isAdmin }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  const isCurrentPath = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-[280px] lg:flex-col"
    >
      <div
        className="flex grow flex-col gap-y-5 overflow-y-auto px-6 py-6"
        style={{
          background: `linear-gradient(180deg, ${colors.maroon[700]} 0%, ${colors.maroon[800]} 100%)`,
        }}
      >
        {/* Logo/Brand Header */}
        <div className="flex h-16 shrink-0 items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-xl font-bold text-white tracking-tight">
              Rose-Hulman Tennis
            </h1>
            <p className="text-xs text-white/60 mt-0.5">Team Portal</p>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            role="list"
            className="flex flex-1 flex-col gap-y-1"
          >
            {navigation.map((item, index) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <NavItem
                  href={item.href}
                  icon={item.icon}
                  label={item.name}
                  isActive={isCurrentPath(item.href)}
                  variant="desktop"
                />
              </motion.li>
            ))}
          </motion.ul>

          {/* User Menu at Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-auto"
          >
            <UserMenu profile={profile} isAdmin={isAdmin} />
          </motion.div>
        </nav>
      </div>
    </motion.aside>
  );
}
