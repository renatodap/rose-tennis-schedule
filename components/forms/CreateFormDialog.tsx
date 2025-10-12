'use client';

/**
 * Multi-step dialog for creating new forms
 * Steps: Basic Info -> Questions -> Target Audience
 */

import { useState, useEffect } from 'react';
import { FormQuestion, Team } from '@/lib/types/database.types';
import { Gender, TeamLevel } from '@/lib/constants';
import { getClient } from '@/lib/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormBuilder } from './FormBuilder';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';
import { dateTimeLocalToISO } from '@/lib/utils/time';
import { Checkbox } from '@/components/ui/checkbox';

interface CreateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: {
    title: string;
    description: string;
    due_date: string;
    questions: FormQuestion[];
    gender: Gender | null;
    team_level: TeamLevel | null;
    is_active: boolean;
  }, teamIds?: string[]) => Promise<void>;
}

export function CreateFormDialog({ open, onOpenChange, onSubmit }: CreateFormDialogProps) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [gender, setGender] = useState<Gender | 'all'>('all');
  const [teamLevel, setTeamLevel] = useState<TeamLevel | 'all'>('all');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const supabase = getClient();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);

  // Fetch available teams
  useEffect(() => {
    const fetchTeams = async () => {
      const { data } = await supabase
        .from('teams')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (data) {
        setTeams(data);
        // Select all teams by default
        setSelectedTeamIds(data.map(t => t.id));
      }
    };

    if (open) {
      fetchTeams();
    }
  }, [open, supabase]);

  const resetForm = () => {
    setStep(1);
    setTitle('');
    setDescription('');
    setDueDate('');
    setQuestions([]);
    setGender('all');
    setTeamLevel('all');
    setSelectedTeamIds([]);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!title.trim()) {
        toast({
          title: 'Missing Title',
          description: 'Please enter a form title.',
          variant: 'destructive',
        });
        return;
      }
    } else if (step === 2) {
      if (questions.length === 0) {
        toast({
          title: 'No Questions',
          description: 'Please add at least one question.',
          variant: 'destructive',
        });
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (isActive: boolean) => {
    // Validate that at least one team is selected
    if (selectedTeamIds.length === 0) {
      toast({
        title: 'Team selection required',
        description: 'Please select at least one team.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        title,
        description,
        due_date: dueDate ? dateTimeLocalToISO(dueDate) : '',
        questions,
        gender: gender === 'all' ? null : gender,
        team_level: teamLevel === 'all' ? null : teamLevel,
        is_active: isActive,
      }, selectedTeamIds);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in parent
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTeam = (teamId: string) => {
    setSelectedTeamIds(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Form Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., End of Season Feedback"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description of the form"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="due_date">Due Date (Optional)</Label>
              <Input
                id="due_date"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <FormBuilder questions={questions} onChange={setQuestions} />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            {/* Team Selection */}
            <div className="space-y-2">
              <Label>
                Target Teams <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Select which team(s) this form is for
              </p>
              <div className="space-y-2 p-3 border rounded-md">
                {teams.map((team) => (
                  <div key={team.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`team-${team.id}`}
                      checked={selectedTeamIds.includes(team.id)}
                      onCheckedChange={() => toggleTeam(team.id)}
                    />
                    <Label htmlFor={`team-${team.id}`} className="font-normal cursor-pointer">
                      {team.name}
                    </Label>
                  </div>
                ))}
                {teams.length === 0 && (
                  <p className="text-sm text-gray-500 italic">Loading teams...</p>
                )}
              </div>
              {selectedTeamIds.length === 0 && (
                <p className="text-sm text-red-600">
                  Please select at least one team
                </p>
              )}
            </div>

            <div className="border-t pt-4 mt-6">
              <h4 className="font-semibold mb-2">Preview</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div>
                  <span className="font-medium">Title:</span> {title}
                </div>
                {description && (
                  <div>
                    <span className="font-medium">Description:</span> {description}
                  </div>
                )}
                {dueDate && (
                  <div>
                    <span className="font-medium">Due Date:</span>{' '}
                    {new Date(dueDate).toLocaleString()}
                  </div>
                )}
                <div>
                  <span className="font-medium">Questions:</span> {questions.length}
                </div>
                <div>
                  <span className="font-medium">Target Teams:</span>{' '}
                  {selectedTeamIds.length === teams.length
                    ? 'All Teams'
                    : teams
                        .filter(t => selectedTeamIds.includes(t.id))
                        .map(t => t.name)
                        .join(', ')}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Form</DialogTitle>
          <DialogDescription>
            Step {step} of 3:{' '}
            {step === 1 ? 'Basic Information' : step === 2 ? 'Add Questions' : 'Target Audience'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">{renderStep()}</div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {step < 3 ? (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                >
                  Save as Draft
                </Button>
                <Button onClick={() => handleSubmit(true)} disabled={submitting}>
                  {submitting ? 'Publishing...' : 'Publish'}
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
