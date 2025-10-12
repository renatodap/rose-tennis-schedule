'use client';

/**
 * List component displaying user's practice availability entries
 */

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAvailability } from '@/lib/hooks/useAvailability';
import { EditAvailabilityDialog } from './EditAvailabilityDialog';
import { PracticeAvailability } from '@/lib/types/database.types';
import { Calendar, Clock, FileText, Edit2, Loader2 } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

export function AvailabilityList() {
  const { availability, loading } = useAvailability();
  const [selectedAvailability, setSelectedAvailability] = useState<PracticeAvailability | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEdit = (item: PracticeAvailability) => {
    setSelectedAvailability(item);
    setEditDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: BRAND_COLORS.PRIMARY }} />
      </div>
    );
  }

  if (availability.length === 0) {
    return (
      <div className="text-center py-12">
        <div
          className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: `${BRAND_COLORS.PRIMARY}20` }}
        >
          <Calendar className="h-8 w-8" style={{ color: BRAND_COLORS.PRIMARY }} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Availability Set</h3>
        <p className="text-gray-600 max-w-sm mx-auto">
          You haven't added any availability yet. Click "Add Availability" to mark when you're available for practice.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {availability.map((item) => (
          <Card
            key={item.id}
            className="hover:shadow-md transition-shadow cursor-pointer border-l-4"
            style={{ borderLeftColor: BRAND_COLORS.PRIMARY }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {format(parseISO(item.date), 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>

                  {/* Notes */}
                  {item.notes && (
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                      <p className="text-sm text-gray-600">{item.notes}</p>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Added {format(parseISO(item.created_at), 'MMM d')}</span>
                    {item.updated_at !== item.created_at && (
                      <span>Updated {format(parseISO(item.updated_at), 'MMM d')}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                  className="flex-shrink-0"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EditAvailabilityDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        availability={selectedAvailability}
      />
    </>
  );
}
