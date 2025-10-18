'use client';

/**
 * Admin layout component
 * Protects admin routes and provides sub-navigation
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/useUser';
import { BRAND_COLORS, UserRole } from '@/lib/constants';
import { AdminNavTabs } from '@/components/admin/AdminNavTabs';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
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

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Admin header */}
      <div className="border-b pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="px-3 py-1 rounded-md text-sm font-medium text-white"
            style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
          >
            Admin
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Team Management
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Manage team members, events, and view reports
        </p>
      </div>

      {/* Navigation tabs */}
      <AdminNavTabs />

      {/* Admin content */}
      <div className="pb-8">{children}</div>
    </div>
  );
}
