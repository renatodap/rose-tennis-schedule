'use client';

import { useAttendance } from '@/lib/hooks/useAttendance';
import { useUser } from '@/lib/hooks/useUser';
import { PracticeDateCard } from '@/components/attendance/PracticeDateCard';
import { PRACTICE_DATES, PRACTICE_TIME, PLAYER_LOCATIONS } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';
import { PracticeDateCardSkeleton } from '@/components/attendance/PracticeDateCardSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gender } from '@/lib/constants';

export default function HomePage() {
  const { profile, loading: userLoading } = useUser();
  const {
    getDateCounts,
    getMyStatus,
    toggleAttendance,
    loading: attendanceLoading,
    error,
    refresh
  } = useAttendance();
  const router = useRouter();
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Determine user's assigned location based on name
  const getUserLocation = (): 'bubble' | 'src' => {
    if (!profile) return 'bubble';

    const firstName = profile.first_name;
    const gender = profile.gender || Gender.MEN;

    // Check if user is in bubble group
    const bubbleGroup = PLAYER_LOCATIONS.bubble[gender as keyof typeof PLAYER_LOCATIONS.bubble] || [];
    if (bubbleGroup.some(name => firstName.toLowerCase().includes(name.toLowerCase()))) {
      return 'bubble';
    }

    // Check if user is in SRC group
    const srcGroup = PLAYER_LOCATIONS.src[gender as keyof typeof PLAYER_LOCATIONS.src] || [];
    if (srcGroup.some(name => firstName.toLowerCase().includes(name.toLowerCase()))) {
      return 'src';
    }

    return 'bubble'; // Default
  };

  const handleToggle = async (date: string, status: 'confirmed' | 'declined') => {
    setActionLoading(date);
    try {
      await toggleAttendance(date, status, getUserLocation());
      toast({
        title: status === 'confirmed' ? 'Confirmed!' : 'Declined',
        description: `Your attendance has been ${status === 'confirmed' ? 'confirmed' : 'marked as not going'}.`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update attendance';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (userLoading || attendanceLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto pb-12">
        <div className="text-center space-y-2">
          <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse mx-auto" />
          <div className="h-5 w-32 bg-neutral-200 rounded animate-pulse mx-auto" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <PracticeDateCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card variant="outlined" className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <div>
              <h3 className="font-semibold text-lg text-neutral-900">Failed to load</h3>
              <p className="text-sm text-neutral-600 mt-1">
                {error.message || 'Something went wrong. Please try again.'}
              </p>
            </div>
            <Button onClick={refresh} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const location = getUserLocation();

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Winter Practice
        </h1>
        <p className="text-neutral-600">
          {PRACTICE_TIME} at {location === 'bubble' ? 'Bubble' : 'SRC'}
        </p>
        <Badge variant={location === 'bubble' ? 'primary' : 'secondary'} size="lg">
          You're assigned to {location === 'bubble' ? 'Bubble' : 'SRC'}
        </Badge>
      </div>

      {/* Practice dates list */}
      <div className="space-y-3">
        {PRACTICE_DATES.map(date => {
          const counts = getDateCounts(date);
          const myStatus = getMyStatus(date);

          return (
            <PracticeDateCard
              key={date}
              date={date}
              confirmedCount={counts.confirmed}
              declinedCount={counts.declined}
              myStatus={myStatus}
              onConfirm={() => handleToggle(date, 'confirmed')}
              onDecline={() => handleToggle(date, 'declined')}
              loading={actionLoading === date}
              onClick={() => router.push(`/practice/${date}`)}
            />
          );
        })}
      </div>
    </div>
  );
}
