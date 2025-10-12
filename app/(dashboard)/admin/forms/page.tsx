'use client';

/**
 * Admin forms management page
 * Allows coaches to create, edit, and view form responses
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreateFormDialog } from '@/components/forms/CreateFormDialog';
import { EditFormDialog } from '@/components/forms/EditFormDialog';
import { FormResponsesView } from '@/components/forms/FormResponsesView';
import { useFormManagement } from '@/lib/hooks/useFormManagement';
import { useUser } from '@/lib/hooks/useUser';
import { Form } from '@/lib/types/database.types';
import { FileText, Plus, Eye, Edit, Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminFormsPage() {
  const { profile } = useUser();
  const {
    forms,
    loading,
    createForm,
    updateForm,
    deleteForm,
    getResponses,
    getResponseCount,
    exportResponses,
    toggleFormStatus,
  } = useFormManagement();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [editingForm, setEditingForm] = useState<Form | null>(null);
  const [viewResponsesDialogOpen, setViewResponsesDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<Form | null>(null);
  const [responsesData, setResponsesData] = useState<any[]>([]);
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // Fetch response counts for all forms
    const fetchCounts = async () => {
      const counts: Record<string, number> = {};
      for (const form of forms) {
        const count = await getResponseCount(form.id);
        counts[form.id] = count;
      }
      setResponseCounts(counts);
    };

    if (forms.length > 0) {
      fetchCounts();
    }
  }, [forms, getResponseCount]);

  const handleCreateForm = async (formData: any) => {
    if (!profile) return;
    await createForm({
      ...formData,
      created_by: profile.id,
    });
  };

  const handleViewResponses = async (form: Form) => {
    setSelectedForm(form);
    const responses = await getResponses(form.id);
    setResponsesData(responses);
    setViewResponsesDialogOpen(true);
  };

  const handleToggleStatus = async (form: Form) => {
    await toggleFormStatus(form.id, !form.is_active);
  };

  const handleDeleteClick = (form: Form) => {
    setFormToDelete(form);
    setDeleteDialogOpen(true);
  };

  const handleEditForm = (form: Form) => {
    setEditingForm(form);
    setEditDialogOpen(true);
  };

  const handleUpdateForm = async (formId: string, updates: Partial<Form>) => {
    await updateForm(formId, updates);
    setEditDialogOpen(false);
    setEditingForm(null);
  };

  const handleDeleteConfirm = async () => {
    if (formToDelete) {
      await deleteForm(formToDelete.id);
      setDeleteDialogOpen(false);
      setFormToDelete(null);
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Form Management</h1>
          <p className="text-gray-600 mt-1">Create and manage team forms and surveys</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Form
        </Button>
      </div>

      <div className="space-y-4">
        {forms.length > 0 ? (
          forms.map((form) => (
            <Card key={form.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-[#80000020]">
                      <FileText className="h-5 w-5 text-[#800000]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{form.title}</CardTitle>
                        <Badge variant={form.is_active ? 'success' : 'secondary'}>
                          {form.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      {form.description && (
                        <CardDescription className="mt-1">{form.description}</CardDescription>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        {form.due_date && (
                          <span>Due: {format(parseISO(form.due_date), 'MMM d, yyyy')}</span>
                        )}
                        <span>{form.questions.length} questions</span>
                        <span>
                          {responseCounts[form.id] || 0} response
                          {responseCounts[form.id] !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {form.gender && (
                          <Badge variant="outline" className="text-xs">
                            {form.gender}
                          </Badge>
                        )}
                        {form.team_level && (
                          <Badge variant="outline" className="text-xs">
                            {form.team_level}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewResponses(form)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Responses
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditForm(form)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(form)}
                  >
                    {form.is_active ? (
                      <>
                        <XCircle className="h-4 w-4 mr-1" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(form)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="inline-flex p-3 rounded-full bg-gray-100 mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Forms Yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first form to collect feedback from your team.
                </p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Form
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <CreateFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateForm}
      />

      <EditFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        form={editingForm}
        onSubmit={handleUpdateForm}
      />

      <Dialog open={viewResponsesDialogOpen} onOpenChange={setViewResponsesDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedForm && (
            <FormResponsesView
              form={selectedForm}
              responses={responsesData}
              onExport={() => exportResponses(selectedForm.id)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Form</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{formToDelete?.title}"? This action cannot be undone
              and will also delete all responses.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
