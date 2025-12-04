'use client';

import { useAttendance } from '@/lib/hooks/useAttendance';
import { useUser } from '@/lib/hooks/useUser';
import { AttendanceList } from '@/components/attendance/AttendanceList';
import { ConfirmButton } from '@/components/attendance/ConfirmButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PRACTICE_TIME, PLAYER_LOCATIONS, Gender } from '@/lib/constants';
import { format, parseISO, startOfDay, isBefore, isEqual } from 'date-fns';
import { ArrowLeft, Clock, MapPin, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface PageProps {
  params: { date: string };
}

export default function PracticeDateDetailPage({ params }: PageProps) {
  const { date } = params;
  const { profile } = useUser();
  const {
    getDateAttendance,
    getMyStatus,
    getDateCounts,
    toggleAttendance,
    loading
  } = useAttendance();
  const [actionLoading, setActionLoading] = useState(false);

  const dateObj = parseISO(date);
  const todayStart = startOfDay(new Date());
  const dateStart = startOfDay(dateObj);
  const past = isBefore(dateStart, todayStart);
  const today = isEqual(dateStart, todayStart);
  const myStatus = getMyStatus(date);
  const counts = getDateCounts(date);
  const attendance = getDateAttendance(date);

  // Get user's location assignment
  const getUserLocation = (): 'bubble' | 'src' => {
    if (!profile) return 'bubble';
    const firstName = profile.first_name;
    const gender = profile.gender || Gender.MEN;

    const bubbleGroup = PLAYER_LOCATIONS.bubble[gender as keyof typeof PLAYER_LOCATIONS.bubble] || [];
    if (bubbleGroup.some(name => firstName.toLowerCase().includes(name.toLowerCase()))) {
      return 'bubble';
    }

    const srcGroup = PLAYER_LOCATIONS.src[gender as keyof typeof PLAYER_LOCATIONS.src] || [];
    if (srcGroup.some(name => firstName.toLowerCase().includes(name.toLowerCase()))) {
      return 'src';
    }

    return 'bubble';
  };

  const handleToggle = async (status: 'confirmed' | 'declined') => {
    setActionLoading(true);
    try {
      await toggleAttendance(date, status, getUserLocation());
    } catch (err) {
      console.error('Failed to update attendance:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Transform attendance data for AttendanceList
  const attendeeInfo = attendance.map(a => ({
    id: a.user.id,
    first_name: a.user.first_name,
    last_name: a.user.last_name,
    gender: a.user.gender,
    status: a.status,
    location: a.location
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-maroon-700" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* Back button */}
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to All Dates
        </Button>
      </Link>

      {/* Date header card */}
      <Card variant="elevated" className={today ? 'ring-2 ring-maroon-600' : ''}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">
                {format(dateObj, 'EEEE, MMMM d, yyyy')}
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                {today && <Badge variant="primary">Today</Badge>}
                {past && <Badge variant="secondary">Past</Badge>}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-neutral-600">
              <Clock className="h-4 w-4" />
              <span>{PRACTICE_TIME}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600">
              <MapPin className="h-4 w-4" />
              <span>Bubble / SRC</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600 col-span-2">
              <Users className="h-4 w-4" />
              <span className="font-medium text-green-700">{counts.confirmed} confirmed</span>
              {counts.declined > 0 && (
                <span className="text-neutral-500">| {counts.declined} not going</span>
              )}
            </div>
          </div>

          {/* My status & toggle */}
          {!past && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-neutral-700 mb-3">
                Your Response:
              </p>
              <ConfirmButton
                status={myStatus}
                onConfirm={() => handleToggle('confirmed')}
                onDecline={() => handleToggle('declined')}
                loading={actionLoading}
                size="lg"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance list */}
      <Card variant="outlined">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceList attendees={attendeeInfo} />
        </CardContent>
      </Card>
    </div>
  );
}
