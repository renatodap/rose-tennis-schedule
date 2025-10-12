'use client';

/**
 * Form builder component for adding and editing questions
 * Supports drag-to-reorder, add, edit, and delete operations
 */

import { useState } from 'react';
import { FormQuestion } from '@/lib/types/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, Edit2, Check, X } from 'lucide-react';

interface FormBuilderProps {
  questions: FormQuestion[];
  onChange: (questions: FormQuestion[]) => void;
}

const questionTypes: { value: FormQuestion['type']; label: string }[] = [
  { value: 'text', label: 'Short Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Multiple Choice (Single)' },
  { value: 'checkbox', label: 'Checkboxes (Multiple)' },
  { value: 'multiselect', label: 'Multi-select' },
  { value: 'date', label: 'Date' },
  { value: 'time', label: 'Time' },
];

export function FormBuilder({ questions, onChange }: FormBuilderProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<FormQuestion>>({
    type: 'text',
    required: false,
  });

  const addQuestion = () => {
    if (!newQuestion.question?.trim()) return;

    const question: FormQuestion = {
      id: `q_${Date.now()}`,
      question: newQuestion.question!,
      type: newQuestion.type || 'text',
      required: newQuestion.required || false,
      options: newQuestion.options || undefined,
      placeholder: newQuestion.placeholder || undefined,
    };

    onChange([...questions, question]);
    setNewQuestion({ type: 'text', required: false });
  };

  const updateQuestion = (id: string, updates: Partial<FormQuestion>) => {
    onChange(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const deleteQuestion = (id: string) => {
    onChange(questions.filter((q) => q.id !== id));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newQuestions = [...questions];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;

    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    onChange(newQuestions);
  };

  const needsOptions = (type: FormQuestion['type']) => {
    return ['select', 'radio', 'checkbox', 'multiselect'].includes(type);
  };

  return (
    <div className="space-y-4">
      {/* Existing Questions */}
      <div className="space-y-3">
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardContent className="pt-4">
              {editingId === question.id ? (
                <div className="space-y-3">
                  <div>
                    <Label>Question Text</Label>
                    <Input
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Question Type</Label>
                    <Select
                      value={question.type}
                      onValueChange={(val) => updateQuestion(question.id, { type: val as FormQuestion['type'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {questionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {needsOptions(question.type) && (
                    <div>
                      <Label>Options (one per line)</Label>
                      <textarea
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                        rows={4}
                        value={question.options?.join('\n') || ''}
                        onChange={(e) =>
                          updateQuestion(question.id, {
                            options: e.target.value.split('\n').filter((o) => o.trim()),
                          })
                        }
                      />
                    </div>
                  )}
                  <div>
                    <Label>Placeholder (Optional)</Label>
                    <Input
                      value={question.placeholder || ''}
                      onChange={(e) => updateQuestion(question.id, { placeholder: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`required-${question.id}`}
                      checked={question.required}
                      onCheckedChange={(checked) =>
                        updateQuestion(question.id, { required: checked as boolean })
                      }
                    />
                    <Label htmlFor={`required-${question.id}`}>Required</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setEditingId(null)}>
                      <Check className="h-4 w-4 mr-1" />
                      Done
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 pt-1">
                    <button
                      onClick={() => moveQuestion(index, 'up')}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <GripVertical className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveQuestion(index, 'down')}
                      disabled={index === questions.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <GripVertical className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {index + 1}. {question.question}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Type: {questionTypes.find((t) => t.value === question.type)?.label}
                      {question.options && ` (${question.options.length} options)`}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(question.id)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Question */}
      <Card className="border-dashed">
        <CardContent className="pt-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Add New Question</h4>
            <div>
              <Label>Question Text</Label>
              <Input
                value={newQuestion.question || ''}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                placeholder="Enter your question"
              />
            </div>
            <div>
              <Label>Question Type</Label>
              <Select
                value={newQuestion.type}
                onValueChange={(val) => setNewQuestion({ ...newQuestion, type: val as FormQuestion['type'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {questionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {newQuestion.type && needsOptions(newQuestion.type) && (
              <div>
                <Label>Options (one per line)</Label>
                <textarea
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  rows={4}
                  value={newQuestion.options?.join('\n') || ''}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      options: e.target.value.split('\n').filter((o) => o.trim()),
                    })
                  }
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                />
              </div>
            )}
            <div>
              <Label>Placeholder (Optional)</Label>
              <Input
                value={newQuestion.placeholder || ''}
                onChange={(e) => setNewQuestion({ ...newQuestion, placeholder: e.target.value })}
                placeholder="Optional placeholder text"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="new-required"
                checked={newQuestion.required}
                onCheckedChange={(checked) =>
                  setNewQuestion({ ...newQuestion, required: checked as boolean })
                }
              />
              <Label htmlFor="new-required">Required</Label>
            </div>
            <Button onClick={addQuestion} disabled={!newQuestion.question?.trim()}>
              <Plus className="h-4 w-4 mr-1" />
              Add Question
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
