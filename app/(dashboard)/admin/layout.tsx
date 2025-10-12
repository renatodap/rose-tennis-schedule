'use client';

/**
 * Admin layout component
 * Protects admin routes and provides sub-navigation
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/lib/hooks/useUser';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BRAND_COLORS, UserRole } from '@/lib/constants';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, loading } = useUser();

  // Redirect if not admin
  useEffect(() => {
    if (!loading && profile) {
      const isAdmin = profile.role === UserRole.COACH || profile.role === UserRole.CAPTAIN;
      if (!isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [profile, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div
          className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: `${BRAND_COLORS.PRIMARY} transparent ${BRAND_COLORS.PRIMARY} ${BRAND_COLORS.PRIMARY}` }}
          aria-label="Loading"
        />
      </div>
    );
  }

  // Don't render if not admin
  if (!profile || (profile.role !== UserRole.COACH && profile.role !== UserRole.CAPTAIN)) {
    return null;
  }

  const adminTabs = [
    { name: 'Overview', href: '/admin' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Events', href: '/admin/events' },
    { name: 'Forms', href: '/admin/forms' },
    { name: 'Reports', href: '/admin/reports' },
  ];

  const getCurrentTab = () => {
    if (pathname === '/admin') return '/admin';
    const matchingTab = adminTabs.find(tab =>
      tab.href !== '/admin' && pathname.startsWith(tab.href)
    );
    return matchingTab?.href || '/admin';
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Admin header */}
      <div className="border-b pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="px-3 py-1 rounded-md text-sm font-medium text-white"
            style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
          >
            Admin
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Team Management
          </h1>
        </div>
        <p className="text-gray-600">
          Manage team members, events, and view reports
        </p>
      </div>

      {/* Sub-navigation tabs */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Admin navigation">
          {adminTabs.map((tab) => {
            const isActive = getCurrentTab() === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`
                  whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'border-current'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }
                `}
                style={isActive ? { color: BRAND_COLORS.PRIMARY } : {}}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin content */}
      <div>{children}</div>
    </div>
  );
}
