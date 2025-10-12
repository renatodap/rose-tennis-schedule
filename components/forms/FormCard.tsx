'use client';

/**
 * Card component for displaying form information
 * Shows form title, description, due date, and status
 */

import { Form } from '@/lib/types/database.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';

interface FormCardProps {
  form: Form;
  hasResponded: boolean;
  onComplete: () => void;
  onViewResponse: () => void;
}

export function FormCard({ form, hasResponded, onComplete, onViewResponse }: FormCardProps) {
  const isOverdue = form.due_date ? isPast(parseISO(form.due_date)) : false;
  const canEdit = form.due_date ? !isPast(parseISO(form.due_date)) : true;

  const getStatusBadge = () => {
    if (hasResponded) {
      return <Badge variant="success">Completed</Badge>;
    }
    if (isOverdue) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    return <Badge variant="warning">Not Started</Badge>;
  };

  return (
    <Card className={isOverdue && !hasResponded ? 'border-red-500 border-2' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-lg bg-[#80000020]">
              <FileText className="h-5 w-5 text-[#800000]" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{form.title}</CardTitle>
              {form.description && (
                <CardDescription className="mt-1">{form.description}</CardDescription>
              )}
              {form.due_date && (
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {format(parseISO(form.due_date), 'MMM d, yyyy h:mm a')}</span>
                </div>
              )}
            </div>
          </div>
          <div>{getStatusBadge()}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          {hasResponded ? (
            <>
              <Button onClick={onViewResponse} variant="outline">
                View Response
              </Button>
              {canEdit && (
                <Button onClick={onComplete}>
                  Edit Response
                </Button>
              )}
            </>
          ) : (
            <Button onClick={onComplete}>
              Complete Form
            </Button>
          )}
        </div>
        <div className="mt-3 text-xs text-gray-500">
          {form.questions.length} question{form.questions.length !== 1 ? 's' : ''}
        </div>
      </CardContent>
    </Card>
  );
}
