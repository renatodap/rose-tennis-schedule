'use client';

/**
 * Hook for managing forms from an admin perspective
 * Handles creating, updating, deleting forms and viewing responses
 */

import { useEffect, useState, useCallback } from 'react';
import { getClient } from '../supabase/client';
import { Form, FormResponse, User } from '../types/database.types';
import { useToast } from './use-toast';

export function useFormManagement() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const supabase = getClient();

  /**
   * Fetch all forms
   */
  const fetchForms = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setForms(data || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast({
        title: 'Error',
        description: 'Failed to load forms. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [supabase, toast]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  /**
   * Create a new form
   */
  const createForm = async (formData: Omit<Form, 'id' | 'created_at' | 'updated_at'>, teamIds?: string[]) => {
    try {
      const { data, error } = await supabase
        .from('forms')
        .insert(formData)
        .select()
        .single();

      if (error) throw error;

      // Create form_teams entries if teamIds provided
      if (teamIds && teamIds.length > 0) {
        const formTeams = teamIds.map(teamId => ({
          form_id: data.id,
          team_id: teamId,
        }));

        const { error: teamsError } = await supabase
          .from('form_teams')
          .insert(formTeams);

        if (teamsError) {
          console.error('Error creating form teams:', teamsError);
          // Don't fail the whole operation
        }
      }

      // Send email notifications to eligible users
      try {
        const response = await fetch('/api/email/send-form-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ formId: data.id }),
        });

        if (response.ok) {
          const result = await response.json();
          toast({
            title: 'Success',
            description: `Form created successfully. ${result.emailsSent || 0} notification(s) sent.`,
          });
        } else {
          toast({
            title: 'Success',
            description: 'Form created successfully (email notifications may have failed).',
          });
        }
      } catch (emailError) {
        console.error('Error sending email notifications:', emailError);
        toast({
          title: 'Success',
          description: 'Form created successfully (email notifications failed).',
        });
      }

      await fetchForms();
      return data;
    } catch (error) {
      console.error('Error creating form:', error);
      toast({
        title: 'Error',
        description: 'Failed to create form. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  /**
   * Update an existing form
   */
  const updateForm = async (formId: string, updates: Partial<Form>) => {
    try {
      const { error } = await supabase
        .from('forms')
        .update(updates)
        .eq('id', formId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Form updated successfully.',
      });

      await fetchForms();
    } catch (error) {
      console.error('Error updating form:', error);
      toast({
        title: 'Error',
        description: 'Failed to update form. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  /**
   * Delete a form
   */
  const deleteForm = async (formId: string) => {
    try {
      const { error } = await supabase
        .from('forms')
        .delete()
        .eq('id', formId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Form deleted successfully.',
      });

      await fetchForms();
    } catch (error) {
      console.error('Error deleting form:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete form. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  /**
   * Get all responses for a specific form
   */
  const getResponses = async (formId: string) => {
    try {
      const { data, error } = await supabase
        .from('form_responses')
        .select(`
          *,
          users:user_id (
            id,
            first_name,
            last_name,
            email,
            gender,
            team_level
          )
        `)
        .eq('form_id', formId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching responses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load responses. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  /**
   * Get response count for a form
   */
  const getResponseCount = async (formId: string) => {
    try {
      const { count, error } = await supabase
        .from('form_responses')
        .select('*', { count: 'exact', head: true })
        .eq('form_id', formId);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      console.error('Error fetching response count:', error);
      return 0;
    }
  };

  /**
   * Export responses to CSV format
   */
  const exportResponses = async (formId: string) => {
    try {
      const responses = await getResponses(formId);
      const form = forms.find(f => f.id === formId);

      if (!form || !responses.length) {
        toast({
          title: 'No Data',
          description: 'No responses to export.',
          variant: 'destructive',
        });
        return;
      }

      // Build CSV header
      const headers = ['User', 'Email', 'Gender', 'Team Level', 'Submitted At'];
      form.questions.forEach(q => {
        headers.push(q.question);
      });

      // Build CSV rows
      const rows = responses.map(response => {
        const row: string[] = [
          `${(response as any).users.first_name} ${(response as any).users.last_name}`,
          (response as any).users.email,
          (response as any).users.gender,
          (response as any).users.team_level,
          new Date(response.submitted_at).toLocaleString(),
        ];

        // Add answers
        form.questions.forEach(q => {
          const answer = response.answers.find((a: any) => a.question_id === q.id);
          if (answer) {
            row.push(Array.isArray((answer as any).answer) ? (answer as any).answer.join('; ') : String((answer as any).answer));
          } else {
            row.push('');
          }
        });

        return row;
      });

      // Convert to CSV string
      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${form.title.replace(/[^a-z0-9]/gi, '_')}_responses.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Responses exported successfully.',
      });
    } catch (error) {
      console.error('Error exporting responses:', error);
      toast({
        title: 'Error',
        description: 'Failed to export responses. Please try again.',
        variant: 'destructive',
      });
    }
  };

  /**
   * Toggle form active status
   */
  const toggleFormStatus = async (formId: string, isActive: boolean) => {
    await updateForm(formId, { is_active: isActive });
  };

  return {
    forms,
    loading,
    createForm,
    updateForm,
    deleteForm,
    getResponses,
    getResponseCount,
    exportResponses,
    toggleFormStatus,
    refresh: fetchForms,
  };
}
