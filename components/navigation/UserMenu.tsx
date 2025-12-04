'use client';

/**
 * UserMenu - Simple user profile menu
 * Shows user info with profile link and sign out button
 */

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User as UserIcon, LogOut } from 'lucide-react';
import { colors } from '@/lib/design-tokens';
import type { User } from '@/lib/types/database.types';

interface UserMenuProps {
  profile: User;
  isAdmin: boolean;
  variant?: 'sidebar' | 'header';
}

export function UserMenu({ profile, isAdmin, variant = 'sidebar' }: UserMenuProps) {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getInitials = () => {
    return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
  };

  if (variant === 'sidebar') {
    return (
      <div className="border-t border-white/10 pt-4 mt-4">
        <div className="flex items-center gap-x-3 p-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback
              style={{
                backgroundColor: colors.accent[400],
                color: colors.maroon[900],
                fontWeight: 600,
              }}
            >
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {profile.first_name} {profile.last_name}
            </p>
            <p className="text-xs text-white/60 truncate">{profile.email}</p>
          </div>
        </div>
        <div className="flex gap-2 px-3 mt-2">
          <Link href="/profile" className="flex-1">
            <Button variant="ghost" size="sm" className="w-full text-white/80 hover:text-white hover:bg-white/10">
              <UserIcon className="h-4 w-4 mr-1.5" />
              Profile
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Header variant (mobile + desktop header)
  return (
    <div className="flex items-center gap-2">
      <Link href="/profile">
        <Avatar className="h-10 w-10 hover:ring-2 hover:ring-offset-2 transition-all duration-200 cursor-pointer" style={{ '--tw-ring-color': colors.maroon[700] } as React.CSSProperties}>
          <AvatarFallback
            style={{
              backgroundColor: `${colors.maroon[700]}20`,
              color: colors.maroon[700],
              fontWeight: 600,
            }}
          >
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSignOut}
        className="text-gray-500 hover:text-gray-700"
        title="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
