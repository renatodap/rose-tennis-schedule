'use client';

/**
 * Dialog for viewing detailed user information
 * Shows profile, schedule, availability, and event responses
 */

import { useState, useEffect } from 'react';
import { User, ClassSchedule, PracticeAvailability, EventResponse } from '@/lib/types/database.types';
import { TeamLevel, UserRole } from '@/lib/constants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface UserDetailsDialogProps {
  user: User | null;
  userDetails: {
    schedules: ClassSchedule[];
    availability: PracticeAvailability[];
    responses: (EventResponse & { event?: any })[];
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserRole: UserRole;
  onTeamLevelChange: (userId: string, teamLevel: TeamLevel | null) => Promise<void>;
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function UserDetailsDialog({
  user,
  userDetails,
  open,
  onOpenChange,
  currentUserRole,
  onTeamLevelChange,
}: UserDetailsDialogProps) {
  const [selectedTab, setSelectedTab] = useState('profile');

  if (!user) return null;

  const canEditTeamLevel = currentUserRole === UserRole.COACH;

  const getResponseIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'unavailable':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'maybe':
        return <HelpCircle className="h-4 w-4 text-amber-600" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {user.first_name} {user.last_name}
          </DialogTitle>
          <DialogDescription>{user.email}</DialogDescription>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="events">Event Responses</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <div className="text-sm">
                      {user.first_name} {user.last_name}
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="text-sm">{user.email}</div>
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <div className="text-sm capitalize">{user.gender}</div>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <div className="text-sm">
                      <Badge>{user.role}</Badge>
                    </div>
                  </div>
                  {user.phone && (
                    <div>
                      <Label>Phone</Label>
                      <div className="text-sm">{user.phone}</div>
                    </div>
                  )}
                  <div>
                    <Label>Team Level</Label>
                    {canEditTeamLevel ? (
                      <Select
                        value={user.team_level || 'none'}
                        onValueChange={(val) =>
                          onTeamLevelChange(user.id, val === 'none' ? null : (val as TeamLevel))
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value={TeamLevel.JV}>JV</SelectItem>
                          <SelectItem value={TeamLevel.VARSITY}>Varsity</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="text-sm capitalize">{user.team_level || 'None'}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Class Schedule</CardTitle>
                <CardDescription>
                  {userDetails?.schedules.length || 0} class
                  {userDetails?.schedules.length !== 1 ? 'es' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userDetails?.schedules && userDetails.schedules.length > 0 ? (
                  <div className="space-y-3">
                    {userDetails.schedules.map((schedule) => (
                      <div key={schedule.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="p-2 rounded-lg bg-[#80000020]">
                          <Clock className="h-4 w-4 text-[#800000]" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{schedule.class_name || 'Class'}</div>
                          <div className="text-sm text-gray-600">
                            {dayNames[schedule.day_of_week]} • {schedule.start_time} -{' '}
                            {schedule.end_time}
                          </div>
                          {schedule.location && (
                            <div className="text-sm text-gray-500">{schedule.location}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No class schedule added</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Practice Availability</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                {userDetails?.availability && userDetails.availability.length > 0 ? (
                  <div className="space-y-2">
                    {userDetails.availability.map((avail) => (
                      <div key={avail.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{format(parseISO(avail.date), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={avail.status === 'available' ? 'success' : 'destructive'}>
                            {avail.status}
                          </Badge>
                          {avail.notes && (
                            <span className="text-xs text-gray-500">{avail.notes}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No availability data recorded
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Event Responses</CardTitle>
                <CardDescription>Last 10 responses</CardDescription>
              </CardHeader>
              <CardContent>
                {userDetails?.responses && userDetails.responses.length > 0 ? (
                  <div className="space-y-3">
                    {userDetails.responses.map((response) => (
                      <div key={response.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium">
                            {response.event?.title || 'Unknown Event'}
                          </div>
                          <div className="flex items-center gap-1">
                            {getResponseIcon(response.status)}
                            <span className="text-sm capitalize">{response.status}</span>
                          </div>
                        </div>
                        {response.event && (
                          <div className="text-sm text-gray-600">
                            {format(parseISO(response.event.start_datetime), 'MMM d, yyyy h:mm a')}
                          </div>
                        )}
                        {response.notes && (
                          <div className="text-sm text-gray-500 mt-1">{response.notes}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No event responses</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
