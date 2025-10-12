'use client';

/**
 * Dashboard layout component
 * Provides protected routes, navigation, and layout structure
 */

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUser } from '@/lib/hooks/useUser';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BRAND_COLORS, UserRole } from '@/lib/constants';
import {
  Home,
  Calendar,
  Clock,
  CalendarDays,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading state
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: `${BRAND_COLORS.PRIMARY} transparent ${BRAND_COLORS.PRIMARY} ${BRAND_COLORS.PRIMARY}` }}
            aria-label="Loading"
          />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated || !profile) {
    return null;
  }

  const isAdmin = profile.role === UserRole.COACH || profile.role === UserRole.CAPTAIN;

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'Availability', href: '/availability', icon: Clock },
    { name: 'Events', href: '/events', icon: CalendarDays },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  if (isAdmin) {
    navigation.push({ name: 'Admin', href: '/admin', icon: Settings });
  }

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

  const isCurrentPath = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div
          className="flex grow flex-col gap-y-5 overflow-y-auto px-6 py-4"
          style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
        >
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-white">
              Rose-Hulman Tennis
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = isCurrentPath(item.href);
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                            isActive
                              ? 'bg-white/10 text-white'
                              : 'text-white/80 hover:text-white hover:bg-white/5'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 lg:hidden">
        <div
          className="flex items-center justify-between px-4 py-4 shadow-sm"
          style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
        >
          <h1 className="text-lg font-bold text-white">RH Tennis</h1>
          <button
            type="button"
            className="text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="px-4 py-4 border-b"
            style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
          >
            <nav>
              <ul className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = isCurrentPath(item.href);
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold ${
                          isActive
                            ? 'bg-white/10 text-white'
                            : 'text-white/80 hover:text-white hover:bg-white/5'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Top header bar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Welcome, {profile.first_name}!
              </h2>
            </div>

            {/* User menu */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                    aria-label="User menu"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback style={{ backgroundColor: `${BRAND_COLORS.PRIMARY}20`, color: BRAND_COLORS.PRIMARY }}>
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
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
                      <User className="mr-2 h-4 w-4" />
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
          </div>
        </header>

        {/* Page content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t bg-white">
        <ul className="flex justify-around">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = isCurrentPath(item.href);
            return (
              <li key={item.name} className="flex-1">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center justify-center py-2 px-3 text-xs ${
                    isActive
                      ? 'font-semibold'
                      : 'text-gray-600'
                  }`}
                  style={isActive ? { color: BRAND_COLORS.PRIMARY } : {}}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-6 w-6 mb-1" aria-hidden="true" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </div>
  );
}
