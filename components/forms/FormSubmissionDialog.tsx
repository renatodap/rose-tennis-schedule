'use client';

/**
 * Dialog for submitting or viewing form responses
 * Dynamically renders form questions based on their type
 */

import { useState, useEffect } from 'react';
import { Form, FormResponse, FormQuestion, FormAnswer } from '@/lib/types/database.types';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Star } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';

interface FormSubmissionDialogProps {
  form: Form;
  existingResponse?: FormResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (answers: FormAnswer[]) => Promise<void>;
  readOnly?: boolean;
}

export function FormSubmissionDialog({
  form,
  existingResponse,
  open,
  onOpenChange,
  onSubmit,
  readOnly = false,
}: FormSubmissionDialogProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Initialize answers from existing response
  useEffect(() => {
    if (existingResponse) {
      const answerMap: Record<string, string | string[]> = {};
      existingResponse.answers.forEach(answer => {
        answerMap[answer.question_id] = answer.answer;
      });
      setAnswers(answerMap);
    } else {
      setAnswers({});
    }
  }, [existingResponse, open]);

  const handleSubmit = async () => {
    // Validate required fields
    const missingRequired = form.questions
      .filter(q => q.required)
      .find(q => !answers[q.id] || (Array.isArray(answers[q.id]) && answers[q.id].length === 0));

    if (missingRequired) {
      toast({
        title: 'Missing Required Field',
        description: `Please answer: ${missingRequired.question}`,
        variant: 'destructive',
      });
      return;
    }

    // Convert answers to FormAnswer format
    const formAnswers: FormAnswer[] = form.questions.map(q => ({
      question_id: q.id,
      answer: answers[q.id] || '',
    }));

    try {
      setSubmitting(true);
      await onSubmit(formAnswers);
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: FormQuestion) => {
    const value = answers[question.id];

    switch (question.type) {
      case 'text':
        return (
          <Input
            value={(value as string) || ''}
            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
            placeholder={question.placeholder}
            disabled={readOnly}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={(value as string) || ''}
            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
            placeholder={question.placeholder}
            disabled={readOnly}
            rows={4}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            value={(value as string) || ''}
            onValueChange={(val) => setAnswers({ ...answers, [question.id]: val })}
            disabled={readOnly}
          >
            {question.options?.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${idx}`} />
                <Label htmlFor={`${question.id}-${idx}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
      case 'multiselect':
        const selectedValues = (value as string[]) || [];
        return (
          <div className="space-y-2">
            {question.options?.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${idx}`}
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setAnswers({
                        ...answers,
                        [question.id]: [...selectedValues, option],
                      });
                    } else {
                      setAnswers({
                        ...answers,
                        [question.id]: selectedValues.filter(v => v !== option),
                      });
                    }
                  }}
                  disabled={readOnly}
                />
                <Label htmlFor={`${question.id}-${idx}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'select':
        return (
          <select
            value={(value as string) || ''}
            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800000] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={readOnly}
          >
            <option value="">Select an option</option>
            {question.options?.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={(value as string) || ''}
            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
            disabled={readOnly}
          />
        );

      case 'time':
        return (
          <Input
            type="time"
            value={(value as string) || ''}
            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
            disabled={readOnly}
          />
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{form.title}</DialogTitle>
          {form.description && <DialogDescription>{form.description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-6 py-4">
          {form.questions.map((question, idx) => (
            <div key={question.id} className="space-y-2">
              <Label>
                {idx + 1}. {question.question}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {renderQuestion(question)}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {!readOnly && (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
