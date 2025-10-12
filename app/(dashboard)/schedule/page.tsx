'use client';

/**
 * Schedule Management Page
 * Allows users to manage their quarterly class schedule with a visual calendar
 */

import { useState } from 'react';
import { QuarterSelector } from '@/components/calendar/QuarterSelector';
import { WeekView, CalendarEvent } from '@/components/calendar/WeekView';
import { AddClassDialog } from '@/components/schedule/AddClassDialog';
import { EditClassDialog, ClassSchedule as EditClassSchedule } from '@/components/schedule/EditClassDialog';
import { useClassSchedule } from '@/lib/hooks/useClassSchedule';
import { useToast } from '@/lib/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Calendar, Copy, Loader2 } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SchedulePage() {
  const [selectedQuarter, setSelectedQuarter] = useState('fall_2025');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<EditClassSchedule | null>(null);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [copyFromQuarter, setCopyFromQuarter] = useState('');
  const [copyLoading, setCopyLoading] = useState(false);
  const [initialDay, setInitialDay] = useState(1);
  const [initialTime, setInitialTime] = useState('09:00');

  const { toast } = useToast();

  // Parse quarter and year from selectedQuarter
  const parseQuarter = (quarterStr: string): { quarter: 'fall' | 'winter' | 'spring' | 'summer'; year: number } => {
    if (quarterStr === 'fall_2025') return { quarter: 'fall', year: 2025 };
    if (quarterStr === 'winter_2025_26') return { quarter: 'winter', year: 2025 };
    if (quarterStr === 'spring_2026') return { quarter: 'spring', year: 2026 };
    if (quarterStr === 'summer_2026') return { quarter: 'summer', year: 2026 };
    return { quarter: 'fall', year: 2025 };
  };

  const { quarter, year } = parseQuarter(selectedQuarter);
  const { schedules, loading, error, addSchedule, updateSchedule, deleteSchedule, copyFromPreviousQuarter } =
    useClassSchedule({ quarter, year });

  // Convert schedules to calendar events
  const calendarEvents: CalendarEvent[] = schedules.map((schedule) => ({
    id: schedule.id,
    title: schedule.course_name || 'Class',
    dayOfWeek: schedule.day_of_week,
    startTime: schedule.start_time,
    endTime: schedule.end_time,
    type: 'class',
    location: schedule.location,
  }));

  // Handle slot click (add new class)
  const handleSlotClick = (dayOfWeek: number, hour: number) => {
    setInitialDay(dayOfWeek);
    setInitialTime(`${hour.toString().padStart(2, '0')}:00`);
    setAddDialogOpen(true);
  };

  // Handle event click (edit class)
  const handleEventClick = (event: CalendarEvent) => {
    const schedule = schedules.find((s) => s.id === event.id);
    if (schedule) {
      setSelectedClass({
        id: schedule.id,
        dayOfWeek: schedule.day_of_week,
        startTime: schedule.start_time,
        endTime: schedule.end_time,
        courseName: schedule.course_name,
        location: schedule.location,
      });
      setEditDialogOpen(true);
    }
  };

  // Handle add class
  const handleAddClass = async (classData: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    courseName?: string;
    location?: string;
  }) => {
    try {
      await addSchedule({
        day_of_week: classData.dayOfWeek,
        start_time: classData.startTime,
        end_time: classData.endTime,
        course_name: classData.courseName,
        location: classData.location,
      });

      toast({
        title: 'Class added',
        description: 'Your class has been added to the schedule.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to add class',
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Handle update class
  const handleUpdateClass = async (
    id: string,
    classData: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      courseName?: string;
      location?: string;
    }
  ) => {
    try {
      await updateSchedule(id, {
        day_of_week: classData.dayOfWeek,
        start_time: classData.startTime,
        end_time: classData.endTime,
        course_name: classData.courseName,
        location: classData.location,
      });

      toast({
        title: 'Class updated',
        description: 'Your class has been updated.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update class',
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Handle delete class
  const handleDeleteClass = async (id: string) => {
    try {
      await deleteSchedule(id);

      toast({
        title: 'Class deleted',
        description: 'Your class has been removed from the schedule.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete class',
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Handle copy from previous quarter
  const handleCopyFromQuarter = async () => {
    if (!copyFromQuarter) return;

    const { quarter: fromQuarter, year: fromYear } = parseQuarter(copyFromQuarter);

    try {
      setCopyLoading(true);
      await copyFromPreviousQuarter(fromQuarter, fromYear);

      toast({
        title: 'Schedule copied',
        description: 'Your schedule has been copied from the previous quarter.',
      });

      setCopyDialogOpen(false);
      setCopyFromQuarter('');
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to copy schedule',
        variant: 'destructive',
      });
    } finally {
      setCopyLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col pb-20 sm:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Class Schedule</h1>
        <p className="mt-2 text-gray-600">Manage your quarter class schedule for practice planning</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <QuarterSelector value={selectedQuarter} onValueChange={setSelectedQuarter} />

        <Button
          variant="outline"
          onClick={() => setCopyDialogOpen(true)}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy from Previous Quarter
        </Button>
      </div>

      {/* Calendar */}
      {loading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: BRAND_COLORS.PRIMARY }} />
              <p className="mt-4 text-gray-600">Loading schedule...</p>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-red-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      ) : schedules.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div
                className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${BRAND_COLORS.PRIMARY}10` }}
              >
                <Calendar className="h-12 w-12" style={{ color: BRAND_COLORS.PRIMARY }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No classes scheduled</h3>
              <p className="text-gray-600 mb-4">
                Add your class schedule for {quarter} {year} to help coordinate practice times.
              </p>
              <Button
                onClick={() => setAddDialogOpen(true)}
                style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
                className="text-white hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Class
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex-1 min-h-[500px]">
          <WeekView
            events={calendarEvents}
            selectedDate={new Date()}
            onSlotClick={handleSlotClick}
            onEventClick={handleEventClick}
          />
        </div>
      )}

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-20 right-4 sm:hidden z-30">
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg"
          style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
          onClick={() => setAddDialogOpen(true)}
        >
          <Plus className="h-6 w-6 text-white" />
          <span className="sr-only">Add Class</span>
        </Button>
      </div>

      {/* Add Class Button (Desktop) */}
      {schedules.length > 0 && (
        <div className="hidden sm:block">
          <Button
            onClick={() => setAddDialogOpen(true)}
            style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
            className="text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <AddClassDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleAddClass}
        initialDayOfWeek={initialDay}
        initialStartTime={initialTime}
      />

      <EditClassDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        classData={selectedClass}
        onUpdate={handleUpdateClass}
        onDelete={handleDeleteClass}
      />

      {/* Copy From Quarter Dialog */}
      <Dialog open={copyDialogOpen} onOpenChange={setCopyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy Schedule from Previous Quarter</DialogTitle>
            <DialogDescription>
              Select a quarter to copy your class schedule from. This will add all classes from that quarter to the
              current quarter.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={copyFromQuarter} onValueChange={setCopyFromQuarter}>
              <SelectTrigger>
                <SelectValue placeholder="Select a quarter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fall_2025">Fall 2025</SelectItem>
                <SelectItem value="winter_2025_26">Winter 2025-26</SelectItem>
                <SelectItem value="spring_2026">Spring 2026</SelectItem>
                <SelectItem value="summer_2026">Summer 2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCopyDialogOpen(false)} disabled={copyLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleCopyFromQuarter}
              disabled={!copyFromQuarter || copyLoading}
              style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
              className="text-white hover:opacity-90"
            >
              {copyLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Copying...
                </>
              ) : (
                'Copy Schedule'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
