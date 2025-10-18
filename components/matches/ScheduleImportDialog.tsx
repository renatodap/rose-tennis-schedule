'use client';

/**
 * Schedule Import Dialog for importing tennis match schedules
 * Allows coaches to paste schedule data and preview before importing
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { parseScheduleText, parseScheduleCSV } from '@/lib/utils/schedule-parser';
import { Gender, TeamLevel } from '@/lib/constants';
import { useEventManagement } from '@/lib/hooks/useEventManagement';
import { getClient } from '@/lib/supabase/client';
import { Team } from '@/lib/types/database.types';

interface ScheduleImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete?: () => void;
}

export function ScheduleImportDialog({
  open,
  onOpenChange,
  onImportComplete,
}: ScheduleImportDialogProps) {
  const { createEvent, loading: eventLoading } = useEventManagement();
  const supabase = getClient();

  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [season, setSeason] = useState('2025-26');
  const [format, setFormat] = useState<'text' | 'csv'>('text');
  const [scheduleData, setScheduleData] = useState('');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        if (data.length > 0) {
          setSelectedTeamId(data[0].id);
        }
      }
    };

    if (open) {
      fetchTeams();
    }
  }, [open, supabase]);

  // Get current user ID for created_by
  const [userId, setUserId] = useState<string>('');
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUser();
  }, [supabase]);

  const handleParse = () => {
    try {
      const selectedTeam = teams.find(t => t.id === selectedTeamId);
      if (!selectedTeam) {
        setError('Please select a team');
        return;
      }

      const parsedEvents = format === 'csv'
        ? parseScheduleCSV(scheduleData, selectedTeam.gender as Gender, selectedTeam.team_level as TeamLevel, season, userId)
        : parseScheduleText(scheduleData, selectedTeam.gender as Gender, selectedTeam.team_level as TeamLevel, season, userId);

      setPreviewData(parsedEvents);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse schedule data');
      setPreviewData([]);
    }
  };

  const handleImport = async () => {
    if (previewData.length === 0) {
      setError('No matches to import. Please parse the schedule first.');
      return;
    }

    const selectedTeam = teams.find(t => t.id === selectedTeamId);
    if (!selectedTeam) {
      setError('Please select a team');
      return;
    }

    setImporting(true);
    setError(null);

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const event of previewData) {
        const result = await createEvent(event, [selectedTeamId]);
        if (result) {
          successCount++;
        } else {
          errorCount++;
        }
      }

      if (errorCount === 0) {
        setImported(true);
        setTimeout(() => {
          onOpenChange(false);
          onImportComplete?.();
          // Reset state
          setScheduleData('');
          setPreviewData([]);
          setImported(false);
        }, 2000);
      } else {
        setError(`Imported ${successCount} matches, ${errorCount} failed`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import matches');
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    if (!importing) {
      setScheduleData('');
      setPreviewData([]);
      setError(null);
      setImported(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Tennis Match Schedule</DialogTitle>
          <DialogDescription>
            Import matches from Rose-Hulman athletics schedule. Paste the schedule data and preview before importing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Team Selection */}
          <div className="space-y-2">
            <Label htmlFor="team">
              Team <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Season */}
          <div className="space-y-2">
            <Label htmlFor="season">
              Season <span className="text-red-500">*</span>
            </Label>
            <Select value={season} onValueChange={setSeason}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-26">2025-26</SelectItem>
                <SelectItem value="2026-27">2026-27</SelectItem>
                <SelectItem value="2027-28">2027-28</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <Label>Format</Label>
            <RadioGroup value={format} onValueChange={(value) => setFormat(value as 'text' | 'csv')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text" className="font-normal cursor-pointer">
                  Text (One match per line)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="font-normal cursor-pointer">
                  CSV (Date,Time,Opponent,Location,Home/Away,Conference,Result)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Schedule Data Input */}
          <div className="space-y-2">
            <Label htmlFor="schedule">
              Schedule Data <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="schedule"
              value={scheduleData}
              onChange={(e) => setScheduleData(e.target.value)}
              placeholder={
                format === 'text'
                  ? 'Paste schedule here (one match per line):\nOct 4 (Sat) 12 PM vs Greenville University W, 4-3\nFeb 6 (Fri) TBA at Case Western Reserve University'
                  : 'Paste CSV data here:\nOct 4,12 PM,Greenville University,Terre Haute,home,yes,W 4-3'
              }
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          {/* Parse Button */}
          <Button onClick={handleParse} disabled={!scheduleData || importing} className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Parse Schedule
          </Button>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Success Display */}
          {imported && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">Successfully imported {previewData.length} matches!</p>
            </div>
          )}

          {/* Preview */}
          {previewData.length > 0 && (
            <div className="space-y-2">
              <Label>Preview ({previewData.length} matches)</Label>
              <div className="border rounded-md max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Opponent</th>
                      <th className="px-4 py-2 text-left">Location</th>
                      <th className="px-4 py-2 text-left">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((event, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">
                          {new Date(event.start_datetime).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-2">{event.opponent}</td>
                        <td className="px-4 py-2">{event.location || '—'}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            event.home_away === 'home' ? 'bg-green-100 text-green-700' :
                            event.home_away === 'away' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {event.home_away}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={importing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={previewData.length === 0 || importing || imported}
            >
              {importing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {imported ? 'Imported!' : `Import ${previewData.length} Matches`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
