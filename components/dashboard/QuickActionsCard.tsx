'use client';

/**
 * QuickActionsCard component
 * Large, tappable action buttons for common tasks
 * Grid layout optimized for mobile (2x2)
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Calendar, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface QuickActionsCardProps {
  onAddClassClick: () => void;
  pendingFormsCount?: number;
}

export function QuickActionsCard({ onAddClassClick, pendingFormsCount = 0 }: QuickActionsCardProps) {
  const actions = [
    {
      icon: GraduationCap,
      label: 'Add Classes',
      description: 'Set up your schedule',
      onClick: onAddClassClick,
      color: 'bg-maroon-700 hover:bg-maroon-800',
    },
    {
      icon: Clock,
      label: 'Mark Availability',
      description: 'Update practice times',
      href: '/availability',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      icon: Calendar,
      label: 'View Events',
      description: 'See upcoming matches',
      href: '/events',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      icon: FileText,
      label: 'Forms',
      description: pendingFormsCount > 0 ? `${pendingFormsCount} pending` : 'View all forms',
      href: '/forms',
      color: 'bg-orange-600 hover:bg-orange-700',
      badge: pendingFormsCount > 0 ? pendingFormsCount : undefined,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {actions.map((action, index) => {
            const ActionIcon = action.icon;
            const content = (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                <Button
                  onClick={action.onClick}
                  className={`
                    h-auto min-h-[120px] w-full
                    flex flex-col items-center justify-center gap-3
                    p-4 sm:p-6
                    text-white shadow-md hover:shadow-lg
                    transition-all duration-200
                    ${action.color}
                  `}
                  asChild={!!action.href}
                >
                  {action.href ? (
                    <Link href={action.href}>
                      <ActionIcon className="h-8 w-8 sm:h-10 sm:w-10" />
                      <div className="text-center space-y-0.5">
                        <div className="font-semibold text-base sm:text-lg">
                          {action.label}
                        </div>
                        <div className="text-xs sm:text-sm opacity-90">
                          {action.description}
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <ActionIcon className="h-8 w-8 sm:h-10 sm:w-10" />
                      <div className="text-center space-y-0.5">
                        <div className="font-semibold text-base sm:text-lg">
                          {action.label}
                        </div>
                        <div className="text-xs sm:text-sm opacity-90">
                          {action.description}
                        </div>
                      </div>
                    </>
                  )}
                </Button>

                {/* Badge for pending items */}
                {action.badge && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
                    {action.badge}
                  </div>
                )}
              </motion.div>
            );

            return <div key={action.label}>{content}</div>;
          })}
        </div>
      </CardContent>
    </Card>
  );
}
