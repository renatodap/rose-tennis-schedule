'use client';

/**
 * Card Component Showcase
 * Demonstrates all card variants, patterns, and interactive states
 * For testing and design review purposes
 */

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardMedia,
  CardBadge,
  CardSkeleton,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Trophy, Users, TrendingUp } from 'lucide-react';

export default function CardShowcasePage() {
  return (
    <div className="container mx-auto py-10 space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-maroon-700">Card Component Showcase</h1>
        <p className="text-neutral-600">
          Premium card system for the Rose-Hulman Tennis Team app
        </p>
      </div>

      {/* Card Variants */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Card Variants</h2>
          <p className="text-sm text-neutral-600">
            Six visual variants for different use cases
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card variant="default">
            <CardHeader>
              <CardTitle className="text-base">Default</CardTitle>
              <CardDescription>Subtle border, light shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Standard content container</p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-base">Elevated</CardTitle>
              <CardDescription>Raised with shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Premium feel for important content</p>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardHeader>
              <CardTitle className="text-base">Outlined</CardTitle>
              <CardDescription>Border-only, minimal</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Clean and lightweight</p>
            </CardContent>
          </Card>

          <Card variant="filled">
            <CardHeader>
              <CardTitle className="text-base">Filled</CardTitle>
              <CardDescription>Solid background</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">For emphasis and contrast</p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-base">Glass</CardTitle>
              <CardDescription>Blur and transparency</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Modern glass morphism effect</p>
            </CardContent>
          </Card>

          <Card variant="interactive">
            <CardHeader>
              <CardTitle className="text-base">Interactive</CardTitle>
              <CardDescription>Hover for effect</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Lifts on hover, clickable</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive States */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Interactive States</h2>
          <p className="text-sm text-neutral-600">
            Hover and selection states with micro-interactions
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card variant="interactive" onClick={() => console.log('Clicked!')}>
            <CardHeader>
              <CardTitle className="text-base">Hover Me</CardTitle>
              <CardDescription>Interactive card with lift</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Hover to see subtle lift animation</p>
            </CardContent>
          </Card>

          <Card selected>
            <CardHeader>
              <CardTitle className="text-base">Selected</CardTitle>
              <CardDescription>Active selection state</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Maroon ring and border highlight</p>
            </CardContent>
          </Card>

          <Card loading>
            <CardHeader>
              <CardTitle className="text-base">Loading</CardTitle>
              <CardDescription>Disabled state</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Pulse animation, pointer events disabled</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Card Badges */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Card Badges</h2>
          <p className="text-sm text-neutral-600">
            Positioned status indicators for events and matches
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardBadge variant="mandatory" position="top-right">
              Mandatory
            </CardBadge>
            <CardHeader>
              <CardTitle className="text-base">Required Event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Red badge for mandatory attendance</p>
            </CardContent>
          </Card>

          <Card>
            <CardBadge variant="recommended" position="top-right">
              Recommended
            </CardBadge>
            <CardHeader>
              <CardTitle className="text-base">Suggested Event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Orange badge for recommendations</p>
            </CardContent>
          </Card>

          <Card>
            <CardBadge variant="optional" position="top-right">
              Optional
            </CardBadge>
            <CardHeader>
              <CardTitle className="text-base">Optional Event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Green badge for optional attendance</p>
            </CardContent>
          </Card>

          <Card>
            <CardBadge variant="match" position="top-right">
              Match
            </CardBadge>
            <CardHeader>
              <CardTitle className="text-base">Tennis Match</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Maroon badge for competitive matches</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Card Patterns */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Card Patterns</h2>
          <p className="text-sm text-neutral-600">
            Common patterns used throughout the app
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Event Card Pattern */}
          <Card variant="interactive" className="group">
            <CardBadge variant="mandatory">Mandatory</CardBadge>
            <CardHeader>
              <CardTitle>Team Practice</CardTitle>
              <CardDescription>Indoor Courts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Calendar className="h-4 w-4" />
                <span>Friday, December 6, 2024</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Clock className="h-4 w-4" />
                <span>4:00 PM - 6:00 PM</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <MapPin className="h-4 w-4" />
                <span>Rose-Hulman Tennis Complex</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm">RSVP</Button>
              <Button size="sm" variant="outline">
                Details
              </Button>
            </CardFooter>
          </Card>

          {/* Match Card Pattern */}
          <Card variant="elevated">
            <CardBadge variant="match" position="top-left">
              Match
            </CardBadge>
            <CardContent className="pt-8">
              <div className="flex items-center justify-between text-center">
                <div className="flex-1">
                  <p className="font-semibold text-lg">Rose-Hulman</p>
                  <p className="text-4xl font-bold text-maroon-700 my-2">6</p>
                </div>
                <div className="text-neutral-400 text-xl font-bold px-4">VS</div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">Opponents</p>
                  <p className="text-4xl font-bold text-neutral-600 my-2">2</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <div className="text-center">
                <p className="text-sm font-medium">Saturday, December 7</p>
                <p className="text-xs text-neutral-600">2:00 PM • Home Court</p>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card variant="filled" className="text-center">
            <CardContent className="py-6">
              <Trophy className="h-8 w-8 text-maroon-700 mx-auto mb-2" />
              <p className="text-3xl font-bold text-maroon-700">12</p>
              <p className="text-sm text-neutral-600 mt-1">Upcoming Events</p>
            </CardContent>
          </Card>

          <Card variant="filled" className="text-center">
            <CardContent className="py-6">
              <Users className="h-8 w-8 text-maroon-700 mx-auto mb-2" />
              <p className="text-3xl font-bold text-maroon-700">24</p>
              <p className="text-sm text-neutral-600 mt-1">Active Players</p>
            </CardContent>
          </Card>

          <Card variant="filled" className="text-center">
            <CardContent className="py-6">
              <TrendingUp className="h-8 w-8 text-success-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-success-600">89%</p>
              <p className="text-sm text-neutral-600 mt-1">Attendance Rate</p>
            </CardContent>
          </Card>

          <Card variant="filled" className="text-center">
            <CardContent className="py-6">
              <Calendar className="h-8 w-8 text-maroon-700 mx-auto mb-2" />
              <p className="text-3xl font-bold text-maroon-700">5</p>
              <p className="text-sm text-neutral-600 mt-1">Matches This Week</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Loading States */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Loading States</h2>
          <p className="text-sm text-neutral-600">
            Skeleton components for perceived performance
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton showHeader showFooter lines={3} />
          <CardSkeleton showHeader showMedia showFooter lines={2} />
          <CardSkeleton showHeader={false} showFooter={false} lines={4} />
        </div>
      </section>

      {/* Size Variants */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Size Variants</h2>
          <p className="text-sm text-neutral-600">
            Different padding options for different contexts
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <Card variant="outlined" size="sm">
            <CardHeader>
              <CardTitle className="text-base">Small</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Compact padding (p-4)</p>
            </CardContent>
          </Card>

          <Card variant="outlined" size="default">
            <CardHeader>
              <CardTitle className="text-base">Default</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Standard padding (p-6)</p>
            </CardContent>
          </Card>

          <Card variant="outlined" size="lg">
            <CardHeader>
              <CardTitle className="text-base">Large</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Spacious padding (p-8)</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Responsive Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Responsive Grid</h2>
          <p className="text-sm text-neutral-600">
            Mobile-first: stacked → 2-col → 3-col
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} variant="elevated">
              <CardHeader>
                <CardTitle className="text-base">Card {i + 1}</CardTitle>
                <CardDescription>Responsive grid item</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Resize browser to see grid adaptation</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
