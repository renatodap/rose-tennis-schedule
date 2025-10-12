'use client';

/**
 * Hook for managing forms from a player perspective
 * Handles fetching applicable forms and submitting responses
 */

import { useEffect, useState, useCallback } from 'react';
import { getClient } from '../supabase/client';
import { Form, FormResponse, User } from '../types/database.types';
import { useToast } from './use-toast';
import { getCurrentDateTimeISO } from '@/lib/utils/time';

export function useForms(user?: User | null) {
  const [forms, setForms] = useState<Form[]>([]);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const supabase = getClient();

  /**
   * Fetch forms applicable to the current user
   */
  const fetchForms = useCallback(async () => {
    if (!user) {
      setForms([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch all active forms and filter client-side
      // This avoids complex OR query issues with Supabase
      const { data: allFormsData, error: formsError } = await supabase
        .from('forms')
        .select('*')
        .eq('is_active', true)
        .order('due_date', { ascending: true, nullsFirst: false });

      if (formsError) throw formsError;

      // Filter forms that match user's gender and team level (or are open to all)
      const formsData = allFormsData?.filter(form => {
        const genderMatch = !form.gender || form.gender === user.gender;
        const teamLevelMatch = !form.team_level || form.team_level === user.team_level;
        return genderMatch && teamLevelMatch;
      });

      // Fetch user's responses
      const { data: responsesData, error: responsesError } = await supabase
        .from('form_responses')
        .select('*')
        .eq('user_id', user.id);

      if (responsesError) throw responsesError;

      setForms(formsData || []);
      setResponses(responsesData || []);
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
  }, [user, supabase, toast]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  /**
   * Submit a response to a form
   */
  const submitResponse = async (formId: string, answers: any[]) => {
    if (!user) return;

    try {
      // Check if user already has a response for this form
      const existingResponse = responses.find(r => r.form_id === formId);

      if (existingResponse) {
        // Update existing response
        const { error } = await supabase
          .from('form_responses')
          .update({
            answers,
            submitted_at: getCurrentDateTimeISO(),
          })
          .eq('id', existingResponse.id);

        if (error) throw error;
      } else {
        // Create new response
        const { error } = await supabase
          .from('form_responses')
          .insert({
            form_id: formId,
            user_id: user.id,
            answers,
            submitted_at: getCurrentDateTimeISO(),
          });

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Your response has been submitted.',
      });

      // Refresh responses
      await fetchForms();
    } catch (error) {
      console.error('Error submitting response:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit response. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  /**
   * Get response for a specific form
   */
  const getResponse = (formId: string) => {
    return responses.find(r => r.form_id === formId);
  };

  /**
   * Check if user has responded to a form
   */
  const hasResponded = (formId: string) => {
    return responses.some(r => r.form_id === formId);
  };

  /**
   * Get active forms (not yet completed)
   */
  const getActiveForms = () => {
    return forms.filter(form => !hasResponded(form.id));
  };

  /**
   * Get completed forms
   */
  const getCompletedForms = () => {
    return forms.filter(form => hasResponded(form.id));
  };

  return {
    forms,
    responses,
    loading,
    submitResponse,
    getResponse,
    hasResponded,
    getActiveForms,
    getCompletedForms,
    refresh: fetchForms,
  };
}
