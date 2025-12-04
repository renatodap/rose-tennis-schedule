'use client';

/**
 * $100M DESIGN SYSTEM - DASHBOARD LAYOUT
 * Premium mobile-first navigation with smooth transitions
 * Always oriented, thumb-reachable, beautifully animated
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUser } from '@/lib/hooks/useUser';
import { CompleteProfileDialog } from '@/components/auth/CompleteProfileDialog';
import NotificationPermissionPrompt from '@/components/notifications/NotificationPermissionPrompt';
import { Sidebar } from '@/components/navigation/Sidebar';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Header } from '@/components/navigation/Header';
import { BRAND_COLORS, UserRole } from '@/lib/constants';
import { colors, motionVariants } from '@/lib/design-tokens';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user: authUser } = useAuth();
  const { profile, loading: profileLoading, refresh } = useUser();

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, authLoading, router]);

  // Show premium loading state
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <motion.div
            className="w-16 h-16 border-4 border-t-transparent rounded-full mx-auto mb-4"
            style={{
              borderColor: `${colors.maroon[700]} transparent ${colors.maroon[700]} ${colors.maroon[700]}`
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            aria-label="Loading"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 font-medium"
          >
            Loading your dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Show profile completion dialog if authenticated but no profile
  if (!profile && authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <CompleteProfileDialog
          isOpen={true}
          userId={authUser.id}
          email={authUser.email || ''}
          onComplete={async () => {
            // Refresh user data after profile creation
            await refresh();
            router.refresh();
          }}
        />
      </div>
    );
  }

  // At this point, profile must exist (TypeScript type guard)
  if (!profile) {
    return null;
  }

  const isAdmin = profile.role === UserRole.COACH || profile.role === UserRole.CAPTAIN;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Desktop sidebar */}
      <Sidebar profile={profile} isAdmin={isAdmin} />

      {/* Main content area */}
      <div className="lg:pl-[280px]">
        {/* Top header bar */}
        <Header profile={profile} isAdmin={isAdmin} />

        {/* Page content with smooth transitions */}
        <AnimatePresence mode="wait">
          <motion.main
            key={typeof window !== 'undefined' ? window.location.pathname : 'main'}
            variants={motionVariants.fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="py-6 px-4 sm:px-6 lg:px-8 pb-24 lg:pb-6"
          >
            {/* Max width container for large screens */}
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </motion.main>
        </AnimatePresence>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav />

      {/* Notification permission prompt */}
      <NotificationPermissionPrompt />
    </div>
  );
}
