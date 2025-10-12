'use client';

/**
 * List component displaying user's time blockers (recurring and one-time)
 */

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBlockers } from '@/lib/hooks/useBlockers';
import { RecurringBlocker, OneTimeBlocker } from '@/lib/types/database.types';
import { Calendar, Clock, FileText, Edit2, Trash2, Loader2, Ban } from 'lucide-react';
import { BRAND_COLORS, QUARTERS } from '@/lib/constants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function BlockersList() {
  const {
    recurringBlockers,
    oneTimeBlockers,
    loading,
    deleteRecurringBlocker,
    deleteOneTimeBlocker,
  } = useBlockers();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'recurring' | 'onetime';
    id: string;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (type: 'recurring' | 'onetime', id: string, title: string) => {
    setDeleteTarget({ type, id, title });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      if (deleteTarget.type === 'recurring') {
        await deleteRecurringBlocker(deleteTarget.id);
      } else {
        await deleteOneTimeBlocker(deleteTarget.id);
      }
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: BRAND_COLORS.PRIMARY }} />
      </div>
    );
  }

  const hasBlockers = recurringBlockers.length > 0 || oneTimeBlockers.length > 0;

  if (!hasBlockers) {
    return (
      <div className="text-center py-12">
        <div
          className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: `${BRAND_COLORS.PRIMARY}20` }}
        >
          <Ban className="h-8 w-8" style={{ color: BRAND_COLORS.PRIMARY }} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Blockers Set</h3>
        <p className="text-gray-600 max-w-sm mx-auto">
          You haven't added any time blockers yet. Add blockers to mark times when you're unavailable for practice.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Recurring Blockers Section */}
        {recurringBlockers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recurring Blockers</h3>
            <div className="space-y-3">
              {recurringBlockers.map((blocker) => (
                <Card
                  key={blocker.id}
                  className="hover:shadow-md transition-shadow border-l-4 border-l-orange-500"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        {/* Title */}
                        <h4 className="font-semibold text-gray-900">{blocker.title}</h4>

                        {/* Day and Time */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{DAYS[blocker.day_of_week]}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {format(parseISO(`2000-01-01T${blocker.start_time}`), 'h:mm a')} -{' '}
                              {format(parseISO(`2000-01-01T${blocker.end_time}`), 'h:mm a')}
                            </span>
                          </div>
                        </div>

                        {/* Quarter */}
                        <div className="text-xs text-gray-500">
                          {QUARTERS[blocker.quarter as keyof typeof QUARTERS]?.name || blocker.quarter}
                        </div>

                        {/* Description */}
                        {blocker.description && (
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                            <p className="text-sm text-gray-600">{blocker.description}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick('recurring', blocker.id, blocker.title)}
                        className="flex-shrink-0 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* One-Time Blockers Section */}
        {oneTimeBlockers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">One-Time Blockers</h3>
            <div className="space-y-3">
              {oneTimeBlockers.map((blocker) => {
                const startDate = parseISO(blocker.start_datetime);
                const endDate = parseISO(blocker.end_datetime);

                return (
                  <Card
                    key={blocker.id}
                    className="hover:shadow-md transition-shadow border-l-4 border-l-red-500"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          {/* Title */}
                          <h4 className="font-semibold text-gray-900">{blocker.title}</h4>

                          {/* Date and Time */}
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{format(startDate, 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                              </span>
                            </div>
                          </div>

                          {/* Description */}
                          {blocker.description && (
                            <div className="flex items-start gap-2">
                              <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                              <p className="text-sm text-gray-600">{blocker.description}</p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick('onetime', blocker.id, blocker.title)}
                          className="flex-shrink-0 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Blocker</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteTarget?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteTarget(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
