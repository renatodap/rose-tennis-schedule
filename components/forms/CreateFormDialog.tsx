'use client';

/**
 * Multi-step dialog for creating new forms
 * Steps: Basic Info -> Questions -> Target Audience
 */

import { useState } from 'react';
import { FormQuestion } from '@/lib/types/database.types';
import { Gender, TeamLevel } from '@/lib/constants';
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
  }) => Promise<void>;
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

  const resetForm = () => {
    setStep(1);
    setTitle('');
    setDescription('');
    setDueDate('');
    setQuestions([]);
    setGender('all');
    setTeamLevel('all');
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
      });
      resetForm();
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in parent
    } finally {
      setSubmitting(false);
    }
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
            <div>
              <Label htmlFor="gender">Target Gender</Label>
              <Select value={gender} onValueChange={(val) => setGender(val as Gender | 'all')}>
                <SelectTrigger id="gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value={Gender.MEN}>Men's Team</SelectItem>
                  <SelectItem value={Gender.WOMEN}>Women's Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="team_level">Target Team Level</Label>
              <Select value={teamLevel} onValueChange={(val) => setTeamLevel(val as TeamLevel | 'all')}>
                <SelectTrigger id="team_level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value={TeamLevel.JV}>JV</SelectItem>
                  <SelectItem value={TeamLevel.VARSITY}>Varsity</SelectItem>
                </SelectContent>
              </Select>
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
                  <span className="font-medium">Target:</span>{' '}
                  {gender === 'all' ? 'All Genders' : gender} |{' '}
                  {teamLevel === 'all' ? 'All Levels' : teamLevel}
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
