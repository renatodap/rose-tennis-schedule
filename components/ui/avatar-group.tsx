'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils/cn';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

const avatarGroupVariants = cva('flex items-center', {
  variants: {
    size: {
      xs: '-space-x-2',
      sm: '-space-x-2',
      default: '-space-x-3',
      lg: '-space-x-3',
      xl: '-space-x-4',
      '2xl': '-space-x-5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface AvatarGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarGroupVariants> {
  /** Maximum number of avatars to show before overflow */
  max?: number;
  /** Avatar children */
  children: React.ReactNode;
}

/**
 * AvatarGroup component
 *
 * Displays a stacked, overlapping group of avatars with overflow handling.
 * Perfect for showing event attendees, team members, or social proof.
 *
 * @example
 * ```tsx
 * <AvatarGroup max={5} size="sm">
 *   {users.map(user => (
 *     <Avatar key={user.id}>
 *       <AvatarImage src={user.avatar} />
 *       <AvatarFallback>{user.initials}</AvatarFallback>
 *     </Avatar>
 *   ))}
 * </AvatarGroup>
 * ```
 */
export function AvatarGroup({
  className,
  size,
  max = 5,
  children,
  ...props
}: AvatarGroupProps) {
  const childArray = React.Children.toArray(children);
  const visibleChildren = childArray.slice(0, max);
  const overflowCount = childArray.length - max;

  // Size mappings for the overflow avatar
  const overflowSizeMap = {
    xs: 'xs',
    sm: 'sm',
    default: 'default',
    lg: 'lg',
    xl: 'xl',
    '2xl': '2xl',
  } as const;

  const overflowSize = overflowSizeMap[size || 'default'];

  return (
    <div
      className={cn(avatarGroupVariants({ size }), className)}
      {...props}
    >
      {visibleChildren.map((child, index) => (
        <div
          key={index}
          className="relative transition-transform duration-200 hover:z-10 hover:scale-105"
          style={{ zIndex: visibleChildren.length - index }}
        >
          {React.isValidElement(child)
            ? React.cloneElement(child, {
                ...child.props,
                size: size || 'default',
                ring: 'default',
              } as any)
            : child}
        </div>
      ))}

      {overflowCount > 0 && (
        <div
          className="relative transition-transform duration-200 hover:z-10 hover:scale-105"
          style={{ zIndex: 0 }}
        >
          <Avatar size={overflowSize} ring="default">
            <AvatarFallback className="bg-neutral-200 text-neutral-700 font-bold">
              +{overflowCount}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
}
