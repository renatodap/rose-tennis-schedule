'use client';

/**
 * Badge & Avatar Component Showcase
 * Demonstrates all variants, styles, and features of the new Badge and Avatar components
 */

import { Check, X, AlertCircle, Calendar, Users, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AvatarGroup } from '@/components/ui/avatar-group';

export default function BadgeAvatarShowcase() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Badge & Avatar Showcase</h1>
        <p className="text-gray-600">
          Premium badge and avatar components for the Rose-Hulman Tennis Team app
        </p>
      </div>

      {/* Badge Variants */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Badge Variants</h2>

        <div className="space-y-6">
          {/* Solid Style */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Solid Style</h3>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="default" badgeStyle="solid">Default</Badge>
              <Badge variant="primary" badgeStyle="solid">Primary</Badge>
              <Badge variant="success" badgeStyle="solid">Success</Badge>
              <Badge variant="warning" badgeStyle="solid">Warning</Badge>
              <Badge variant="danger" badgeStyle="solid">Danger</Badge>
              <Badge variant="info" badgeStyle="solid">Info</Badge>
            </div>
          </div>

          {/* Soft Style */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Soft Style</h3>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="default" badgeStyle="soft">Default</Badge>
              <Badge variant="primary" badgeStyle="soft">Primary</Badge>
              <Badge variant="success" badgeStyle="soft">Success</Badge>
              <Badge variant="warning" badgeStyle="soft">Warning</Badge>
              <Badge variant="danger" badgeStyle="soft">Danger</Badge>
              <Badge variant="info" badgeStyle="soft">Info</Badge>
            </div>
          </div>

          {/* Outline Style */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Outline Style</h3>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="default" badgeStyle="outline">Default</Badge>
              <Badge variant="primary" badgeStyle="outline">Primary</Badge>
              <Badge variant="success" badgeStyle="outline">Success</Badge>
              <Badge variant="warning" badgeStyle="outline">Warning</Badge>
              <Badge variant="danger" badgeStyle="outline">Danger</Badge>
              <Badge variant="info" badgeStyle="outline">Info</Badge>
            </div>
          </div>

          {/* Dot Style */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Dot Style</h3>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="default" badgeStyle="dot">Default</Badge>
              <Badge variant="primary" badgeStyle="dot">Primary</Badge>
              <Badge variant="success" badgeStyle="dot">Success</Badge>
              <Badge variant="warning" badgeStyle="dot">Warning</Badge>
              <Badge variant="danger" badgeStyle="dot">Danger</Badge>
              <Badge variant="info" badgeStyle="dot">Info</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Badge Sizes */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Badge Sizes</h2>
        <div className="flex items-center gap-3">
          <Badge variant="primary" size="xs">Extra Small</Badge>
          <Badge variant="primary" size="sm">Small</Badge>
          <Badge variant="primary" size="default">Default</Badge>
          <Badge variant="primary" size="lg">Large</Badge>
        </div>
      </section>

      {/* Badge with Icons */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Badge with Icons</h2>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="success" badgeStyle="soft" icon={<Check className="w-3 h-3" />}>
            Going
          </Badge>
          <Badge variant="warning" badgeStyle="soft" icon={<AlertCircle className="w-3 h-3" />}>
            Maybe
          </Badge>
          <Badge variant="danger" badgeStyle="soft" icon={<X className="w-3 h-3" />}>
            Not Going
          </Badge>
          <Badge variant="info" badgeStyle="soft" icon={<Calendar className="w-3 h-3" />}>
            Match
          </Badge>
          <Badge variant="primary" badgeStyle="soft" icon={<Trophy className="w-3 h-3" />}>
            Captain
          </Badge>
        </div>
      </section>

      {/* Removable Badges */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Removable Badges (Tags)</h2>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="primary" badgeStyle="soft" removable onRemove={() => alert('Removed!')}>
            Filter: Mandatory
          </Badge>
          <Badge variant="success" badgeStyle="soft" removable onRemove={() => alert('Removed!')}>
            Filter: Going
          </Badge>
          <Badge variant="info" badgeStyle="soft" removable onRemove={() => alert('Removed!')}>
            Filter: Matches
          </Badge>
        </div>
      </section>

      {/* Real-World Examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Event Type Badges</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="danger" badgeStyle="soft">Mandatory</Badge>
            <span className="text-sm text-gray-600">Required attendance</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning" badgeStyle="soft">Recommended</Badge>
            <span className="text-sm text-gray-600">Highly encouraged</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" badgeStyle="soft">Optional</Badge>
            <span className="text-sm text-gray-600">Come if available</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="info" badgeStyle="soft">Match</Badge>
            <span className="text-sm text-gray-600">Competitive event</span>
          </div>
        </div>
      </section>

      {/* Avatar Sizes */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Avatar Sizes</h2>
        <div className="flex items-end gap-4">
          <div className="text-center">
            <Avatar size="xs">
              <AvatarFallback>XS</AvatarFallback>
            </Avatar>
            <p className="text-xs mt-1">xs (24px)</p>
          </div>
          <div className="text-center">
            <Avatar size="sm">
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <p className="text-xs mt-1">sm (32px)</p>
          </div>
          <div className="text-center">
            <Avatar size="default">
              <AvatarFallback>MD</AvatarFallback>
            </Avatar>
            <p className="text-xs mt-1">default (40px)</p>
          </div>
          <div className="text-center">
            <Avatar size="lg">
              <AvatarFallback>LG</AvatarFallback>
            </Avatar>
            <p className="text-xs mt-1">lg (48px)</p>
          </div>
          <div className="text-center">
            <Avatar size="xl">
              <AvatarFallback>XL</AvatarFallback>
            </Avatar>
            <p className="text-xs mt-1">xl (64px)</p>
          </div>
          <div className="text-center">
            <Avatar size="2xl">
              <AvatarFallback>2X</AvatarFallback>
            </Avatar>
            <p className="text-xs mt-1">2xl (96px)</p>
          </div>
        </div>
      </section>

      {/* Avatar with Status */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Avatar with Status Indicator</h2>
        <div className="flex gap-6">
          <div className="text-center">
            <Avatar size="lg" status="online">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <p className="text-xs mt-2">Online</p>
          </div>
          <div className="text-center">
            <Avatar size="lg" status="away">
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <p className="text-xs mt-2">Away</p>
          </div>
          <div className="text-center">
            <Avatar size="lg" status="busy">
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <p className="text-xs mt-2">Busy</p>
          </div>
          <div className="text-center">
            <Avatar size="lg" status="offline">
              <AvatarFallback>CD</AvatarFallback>
            </Avatar>
            <p className="text-xs mt-2">Offline</p>
          </div>
        </div>
      </section>

      {/* Avatar with Rings */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Avatar with Colored Rings</h2>
        <div className="flex gap-4">
          <Avatar size="lg" ring="default">
            <AvatarFallback>DF</AvatarFallback>
          </Avatar>
          <Avatar size="lg" ring="primary">
            <AvatarFallback>PR</AvatarFallback>
          </Avatar>
          <Avatar size="lg" ring="success">
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <Avatar size="lg" ring="warning">
            <AvatarFallback>WN</AvatarFallback>
          </Avatar>
          <Avatar size="lg" ring="danger">
            <AvatarFallback>DG</AvatarFallback>
          </Avatar>
        </div>
      </section>

      {/* Avatar Groups */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Avatar Groups</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-2">Small (max 3)</h3>
            <AvatarGroup max={3} size="sm">
              <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>SM</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>EF</AvatarFallback></Avatar>
            </AvatarGroup>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Default (max 5)</h3>
            <AvatarGroup max={5} size="default">
              <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>SM</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>EF</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>GH</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>IJ</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>KL</AvatarFallback></Avatar>
            </AvatarGroup>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Large (max 4)</h3>
            <AvatarGroup max={4} size="lg">
              <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>SM</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>EF</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>GH</AvatarFallback></Avatar>
            </AvatarGroup>
          </div>
        </div>
      </section>

      {/* Complete Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Complete Example: Event Card</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">Spring Practice Session</h3>
              <p className="text-sm text-gray-600">Saturday, March 15 at 2:00 PM</p>
            </div>
            <Badge variant="danger" badgeStyle="soft" size="sm">
              Mandatory
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <AvatarGroup max={4} size="sm">
                <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
                <Avatar><AvatarFallback>SM</AvatarFallback></Avatar>
                <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
                <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
                <Avatar><AvatarFallback>EF</AvatarFallback></Avatar>
                <Avatar><AvatarFallback>GH</AvatarFallback></Avatar>
                <Avatar><AvatarFallback>IJ</AvatarFallback></Avatar>
              </AvatarGroup>
              <span className="text-sm text-gray-600 font-medium">7 going</span>
            </div>

            <div className="flex gap-2">
              <Badge variant="success" badgeStyle="dot" size="sm" icon={<Check className="w-3 h-3" />}>
                Going
              </Badge>
              <Badge variant="info" badgeStyle="soft" size="sm" icon={<Users className="w-3 h-3" />}>
                Team Practice
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Support */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Legacy Variant Support</h2>
        <p className="text-sm text-gray-600 mb-3">
          Old variants still work for backward compatibility:
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>
    </div>
  );
}
