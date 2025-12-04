'use client';

/**
 * BottomNav - Premium mobile bottom navigation
 * Thumb-reachable, beautifully animated, always oriented
 */

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { NavItem } from './NavItem';
import { Home, User } from 'lucide-react';
import { shadows } from '@/lib/design-tokens';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  const isCurrentPath = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Bottom navigation bar */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-gray-200 bg-white/80 backdrop-blur-lg"
        style={{
          boxShadow: shadows.lg,
        }}
      >
        {/* Safe area padding for notched phones */}
        <div className="pb-safe">
          <ul className="flex justify-around items-center h-16 px-2">
            {navItems.map((item) => (
              <li key={item.href} className="flex-1 min-w-0">
                <NavItem
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={isCurrentPath(item.href)}
                  variant="mobile"
                />
              </li>
            ))}
          </ul>
        </div>
      </motion.nav>

      {/* Bottom padding spacer for content */}
      <div className="h-16 lg:hidden pb-safe" aria-hidden="true" />
    </>
  );
}
