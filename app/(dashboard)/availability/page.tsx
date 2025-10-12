'use client';

/**
 * Availability Management Page
 * Allows users to manage practice availability and time blockers
 */

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Ban, Clock } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';
import { AvailabilityList } from '@/components/availability/AvailabilityList';
import { AddAvailabilityDialog } from '@/components/availability/AddAvailabilityDialog';
import { AvailabilityCalendar } from '@/components/availability/AvailabilityCalendar';
import { BlockersList } from '@/components/blockers/BlockersList';
import { AddRecurringBlockerDialog } from '@/components/blockers/AddRecurringBlockerDialog';
import { AddOneTimeBlockerDialog } from '@/components/blockers/AddOneTimeBlockerDialog';

export default function AvailabilityPage() {
  const [activeTab, setActiveTab] = useState('availability');
  const [addAvailabilityOpen, setAddAvailabilityOpen] = useState(false);
  const [addRecurringBlockerOpen, setAddRecurringBlockerOpen] = useState(false);
  const [addOneTimeBlockerOpen, setAddOneTimeBlockerOpen] = useState(false);
  const [defaultDate, setDefaultDate] = useState<string | undefined>(undefined);

  const handleAddAvailabilityFromCalendar = (date: string) => {
    setDefaultDate(date);
    setAddAvailabilityOpen(true);
  };

  const handleAddBlockerFromCalendar = (date: string) => {
    setDefaultDate(date);
    setAddOneTimeBlockerOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl h-full flex flex-col pb-20 sm:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Practice Availability
        </h1>
        <p className="mt-2 text-gray-600">
          Mark your availability for daily practice sessions and manage time blockers
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="availability">
              <Clock className="h-4 w-4 mr-2" />
              My Availability
            </TabsTrigger>
            <TabsTrigger value="blockers">
              <Ban className="h-4 w-4 mr-2" />
              Blockers
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
          </TabsList>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {activeTab === 'availability' && (
              <Button
                onClick={() => setAddAvailabilityOpen(true)}
                style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
                className="text-white hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Availability
              </Button>
            )}
            {activeTab === 'blockers' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setAddRecurringBlockerOpen(true)}
                  className="hidden sm:flex"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Recurring Blocker
                </Button>
                <Button
                  onClick={() => setAddOneTimeBlockerOpen(true)}
                  style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
                  className="text-white hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="sm:hidden">Add Blocker</span>
                  <span className="hidden sm:inline">One-Time Blocker</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Tab Contents */}
        <TabsContent value="availability" className="flex-1 mt-0">
          <Card>
            <CardContent className="p-6">
              <AvailabilityList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockers" className="flex-1 mt-0">
          <Card>
            <CardContent className="p-6">
              <BlockersList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="flex-1 mt-0">
          <AvailabilityCalendar
            onAddAvailability={handleAddAvailabilityFromCalendar}
            onAddBlocker={handleAddBlockerFromCalendar}
          />
        </TabsContent>
      </Tabs>

      {/* Floating Action Button (Mobile) */}
      {activeTab === 'blockers' && (
        <div className="fixed bottom-20 right-4 sm:hidden z-30 flex flex-col gap-2">
          <Button
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg"
            style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
            onClick={() => setAddOneTimeBlockerOpen(true)}
          >
            <Plus className="h-6 w-6 text-white" />
            <span className="sr-only">Add One-Time Blocker</span>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full h-14 w-14 shadow-lg"
            onClick={() => setAddRecurringBlockerOpen(true)}
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add Recurring Blocker</span>
          </Button>
        </div>
      )}

      {activeTab === 'availability' && (
        <div className="fixed bottom-20 right-4 sm:hidden z-30">
          <Button
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg"
            style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
            onClick={() => setAddAvailabilityOpen(true)}
          >
            <Plus className="h-6 w-6 text-white" />
            <span className="sr-only">Add Availability</span>
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <AddAvailabilityDialog
        open={addAvailabilityOpen}
        onOpenChange={setAddAvailabilityOpen}
        defaultDate={defaultDate}
      />
      <AddRecurringBlockerDialog
        open={addRecurringBlockerOpen}
        onOpenChange={setAddRecurringBlockerOpen}
      />
      <AddOneTimeBlockerDialog
        open={addOneTimeBlockerOpen}
        onOpenChange={setAddOneTimeBlockerOpen}
        defaultDate={defaultDate}
      />
    </div>
  );
}
