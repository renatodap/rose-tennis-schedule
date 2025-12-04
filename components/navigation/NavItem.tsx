'use client';

/**
 * NavItem - Reusable navigation item with active states
 * Used in both mobile bottom nav and desktop sidebar
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { colors } from '@/lib/design-tokens';

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  variant?: 'mobile' | 'desktop';
}

export function NavItem({
  href,
  icon: Icon,
  label,
  isActive,
  onClick,
  variant = 'mobile',
}: NavItemProps) {
  if (variant === 'mobile') {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="flex flex-col items-center justify-center relative py-2 px-1 touch-manipulation"
        aria-current={isActive ? 'page' : undefined}
      >
        {/* Active indicator pill */}
        {isActive && (
          <motion.div
            layoutId="mobile-active-pill"
            className="absolute inset-0 rounded-xl"
            style={{ backgroundColor: `${colors.maroon[700]}10` }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}

        {/* Icon with scale animation */}
        <motion.div
          animate={{
            scale: isActive ? 1.05 : 1,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="relative z-10"
        >
          <Icon
            className="h-6 w-6 mb-1"
            style={{
              color: isActive ? colors.maroon[700] : colors.neutral[600],
              strokeWidth: isActive ? 2.5 : 2,
            }}
            aria-hidden="true"
          />
        </motion.div>

        {/* Label */}
        <span
          className="text-[10px] leading-tight relative z-10 transition-all duration-200"
          style={{
            color: isActive ? colors.maroon[700] : colors.neutral[600],
            fontWeight: isActive ? 600 : 500,
          }}
        >
          {label}
        </span>
      </Link>
    );
  }

  // Desktop variant
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative flex items-center gap-x-3 rounded-lg p-3 text-sm leading-6 font-semibold transition-all duration-200"
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Active indicator bar */}
      {isActive && (
        <motion.div
          layoutId="desktop-active-indicator"
          className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
          style={{ backgroundColor: colors.accent[400] }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}

      {/* Background */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        }}
        whileHover={{
          backgroundColor: isActive
            ? 'rgba(255, 255, 255, 0.15)'
            : 'rgba(255, 255, 255, 0.05)',
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Icon */}
      <Icon
        className="h-6 w-6 shrink-0 relative z-10"
        style={{
          color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
        }}
        aria-hidden="true"
      />

      {/* Label */}
      <span
        className="relative z-10"
        style={{
          color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
        }}
      >
        {label}
      </span>
    </Link>
  );
}
