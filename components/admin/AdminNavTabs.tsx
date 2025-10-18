'use client';

/**
 * AdminNavTabs Component
 * Navigation tabs for admin section with mobile-friendly horizontal scroll
 */

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  Trophy,
  CalendarDays,
  Users,
  FileText,
  BarChart3
} from 'lucide-react';

const adminTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { id: 'matches', label: 'Matches', icon: Trophy, path: '/admin/matches' },
  { id: 'events', label: 'Events', icon: CalendarDays, path: '/admin/events' },
  { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
  { id: 'forms', label: 'Forms', icon: FileText, path: '/admin/forms' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/admin/reports' },
];

export function AdminNavTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const getActiveTab = () => {
    const currentPath = pathname || '';
    if (currentPath === '/admin') return 'dashboard';
    if (currentPath.startsWith('/admin/matches')) return 'matches';
    if (currentPath.startsWith('/admin/events')) return 'events';
    if (currentPath.startsWith('/admin/users')) return 'users';
    if (currentPath.startsWith('/admin/forms')) return 'forms';
    if (currentPath.startsWith('/admin/reports')) return 'reports';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-10 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="overflow-x-auto scrollbar-hide">
        <nav className="flex space-x-1 min-w-max" aria-label="Admin navigation">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.path)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
