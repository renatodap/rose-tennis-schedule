'use client';

/**
 * UserMenu - User profile menu for sidebar and header
 * Shows user info and quick actions
 */

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User as UserIcon, Settings, LogOut } from 'lucide-react';
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
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full rounded-lg p-3 hover:bg-white/5 transition-colors duration-200 text-left">
            <div className="flex items-center gap-x-3">
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
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">
                {profile.first_name} {profile.last_name}
              </p>
              <p className="text-xs text-gray-500">{profile.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link href="/admin" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Header variant (mobile + desktop header)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-offset-2 transition-all duration-200" style={{ '--tw-ring-color': colors.maroon[700] } as React.CSSProperties}>
        <Avatar className="h-10 w-10">
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
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">
            {profile.first_name} {profile.last_name}
          </p>
          <p className="text-xs text-gray-500">{profile.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
