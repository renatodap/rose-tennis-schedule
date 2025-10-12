'use client';

/**
 * Component for viewing form responses
 * Shows aggregated statistics and individual responses
 */

import { useState, useEffect } from 'react';
import { Form, FormResponse } from '@/lib/types/database.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface FormResponsesViewProps {
  form: Form;
  responses: (FormResponse & { users?: any })[];
  onExport: () => void;
}

export function FormResponsesView({ form, responses, onExport }: FormResponsesViewProps) {
  const [selectedTab, setSelectedTab] = useState<string>('summary');

  const getAnswerForQuestion = (response: FormResponse, questionId: string) => {
    const answer = response.answers.find(a => a.question_id === questionId);
    if (!answer) return 'No answer';
    if (Array.isArray(answer.answer)) {
      return answer.answer.join(', ');
    }
    return String(answer.answer);
  };

  const getAggregatedStats = (questionId: string) => {
    const question = form.questions.find(q => q.id === questionId);
    if (!question) return null;

    const answers = responses
      .map(r => r.answers.find(a => a.question_id === questionId))
      .filter(a => a !== undefined);

    if (question.type === 'radio' || question.type === 'select') {
      // Count occurrences of each option
      const counts: Record<string, number> = {};
      answers.forEach(answer => {
        const value = String(answer!.answer);
        counts[value] = (counts[value] || 0) + 1;
      });

      return (
        <div className="space-y-2">
          {Object.entries(counts).map(([option, count]) => (
            <div key={option} className="flex items-center justify-between">
              <span className="text-sm">{option}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#800000]"
                    style={{ width: `${(count / responses.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">
                  {count} ({Math.round((count / responses.length) * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (question.type === 'checkbox' || question.type === 'multiselect') {
      // Count occurrences of each option
      const counts: Record<string, number> = {};
      answers.forEach(answer => {
        const values = Array.isArray(answer!.answer) ? answer!.answer : [answer!.answer];
        values.forEach(value => {
          const strValue = String(value);
          counts[strValue] = (counts[strValue] || 0) + 1;
        });
      });

      return (
        <div className="space-y-2">
          {Object.entries(counts).map(([option, count]) => (
            <div key={option} className="flex items-center justify-between">
              <span className="text-sm">{option}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#800000]"
                    style={{ width: `${(count / responses.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">
                  {count} ({Math.round((count / responses.length) * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // For text/textarea, show all responses
    return (
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {answers.map((answer, idx) => (
          <div key={idx} className="text-sm p-2 bg-gray-50 rounded border">
            {String(answer!.answer)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{form.title}</CardTitle>
              <CardDescription>
                {responses.length} response{responses.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <Button onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="individual">Individual Responses</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-6 mt-4">
              {form.questions.map((question, idx) => (
                <Card key={question.id}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {idx + 1}. {question.question}
                    </CardTitle>
                    <CardDescription>
                      {responses.length} response{responses.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>{getAggregatedStats(question.id)}</CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="individual" className="mt-4">
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Submitted At</TableHead>
                      {form.questions.map((q) => (
                        <TableHead key={q.id}>{q.question}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map((response) => (
                      <TableRow key={response.id}>
                        <TableCell>
                          {response.users
                            ? `${response.users.first_name} ${response.users.last_name}`
                            : 'Unknown User'}
                        </TableCell>
                        <TableCell>
                          {new Date(response.submitted_at).toLocaleString()}
                        </TableCell>
                        {form.questions.map((q) => (
                          <TableCell key={q.id} className="max-w-xs truncate">
                            {getAnswerForQuestion(response, q.id)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
