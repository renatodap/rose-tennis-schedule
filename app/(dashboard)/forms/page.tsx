'use client';

/**
 * Player forms page
 * Shows active and completed forms for the current user
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormCard } from '@/components/forms/FormCard';
import { FormSubmissionDialog } from '@/components/forms/FormSubmissionDialog';
import { useForms } from '@/lib/hooks/useForms';
import { useUser } from '@/lib/hooks/useUser';
import { Form } from '@/lib/types/database.types';
import { FileText, Loader2 } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

export default function FormsPage() {
  const { profile } = useUser();
  const { forms, loading, submitResponse, getResponse, getActiveForms, getCompletedForms } = useForms(profile);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'view'>('edit');

  const activeForms = getActiveForms();
  const completedForms = getCompletedForms();

  const handleCompleteForm = (form: Form) => {
    setSelectedForm(form);
    setViewMode('edit');
    setDialogOpen(true);
  };

  const handleViewResponse = (form: Form) => {
    setSelectedForm(form);
    setViewMode('view');
    setDialogOpen(true);
  };

  const handleSubmit = async (answers: any[]) => {
    if (!selectedForm) return;
    await submitResponse(selectedForm.id, answers);
    setDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#800000]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
        <p className="text-gray-600 mt-1">Complete team forms and surveys</p>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active Forms
            {activeForms.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-[#800000] text-white rounded-full">
                {activeForms.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeForms.length > 0 ? (
            activeForms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                hasResponded={false}
                onComplete={() => handleCompleteForm(form)}
                onViewResponse={() => handleViewResponse(form)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="inline-flex p-3 rounded-full bg-gray-100 mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Active Forms</h3>
                  <p className="text-gray-600">
                    You have completed all available forms. Check back later for new forms.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedForms.length > 0 ? (
            completedForms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                hasResponded={true}
                onComplete={() => handleCompleteForm(form)}
                onViewResponse={() => handleViewResponse(form)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="inline-flex p-3 rounded-full bg-gray-100 mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Completed Forms</h3>
                  <p className="text-gray-600">
                    You have not completed any forms yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {selectedForm && (
        <FormSubmissionDialog
          form={selectedForm}
          existingResponse={getResponse(selectedForm.id)}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          readOnly={viewMode === 'view'}
        />
      )}
    </div>
  );
}
