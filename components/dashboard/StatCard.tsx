'use client';

/**
 * StatCard component
 * Displays a key metric with icon, value, label, and optional trend
 * Premium design with bold numbers and subtle icons
 */

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StatCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  trend?: string;
  color?: 'maroon' | 'green' | 'blue' | 'orange' | 'neutral';
  loading?: boolean;
  onClick?: () => void;
}

const colorStyles = {
  maroon: {
    icon: 'text-maroon-600 bg-maroon-50',
    value: 'text-maroon-900',
    trend: 'text-maroon-600',
  },
  green: {
    icon: 'text-green-600 bg-green-50',
    value: 'text-green-900',
    trend: 'text-green-600',
  },
  blue: {
    icon: 'text-blue-600 bg-blue-50',
    value: 'text-blue-900',
    trend: 'text-blue-600',
  },
  orange: {
    icon: 'text-orange-600 bg-orange-50',
    value: 'text-orange-900',
    trend: 'text-orange-600',
  },
  neutral: {
    icon: 'text-neutral-600 bg-neutral-50',
    value: 'text-neutral-900',
    trend: 'text-neutral-600',
  },
};

export function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  color = 'neutral',
  loading = false,
  onClick,
}: StatCardProps) {
  const styles = colorStyles[color];
  const isClickable = !!onClick;

  const content = (
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className={cn('p-3 rounded-xl', styles.icon)}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>

      {/* Value and Label */}
      <div className="mt-4 space-y-1">
        <div className={cn('text-4xl font-bold tracking-tight', styles.value)}>
          {loading ? (
            <div className="h-10 w-20 bg-neutral-200 animate-pulse rounded" />
          ) : (
            value
          )}
        </div>
        <p className="text-sm font-medium text-neutral-600">{label}</p>
      </div>

      {/* Trend */}
      {trend && !loading && (
        <p className={cn('text-xs mt-2 font-medium', styles.trend)}>{trend}</p>
      )}
    </CardContent>
  );

  if (isClickable) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          onClick={onClick}
          className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
        >
          {content}
        </Card>
      </motion.div>
    );
  }

  return <Card>{content}</Card>;
}
