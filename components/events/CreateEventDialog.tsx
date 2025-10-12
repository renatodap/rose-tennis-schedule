'use client';

/**
 * Create Event Dialog for coaches and captains
 * Form to create new team events with all necessary fields
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useEventManagement, CreateEventData } from '@/lib/hooks/useEventManagement';
import { Loader2 } from 'lucide-react';
import { dateTimeLocalToISO } from '@/lib/utils/time';
import { getClient } from '@/lib/supabase/client';
import { Team } from '@/lib/types/database.types';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventCreated?: () => void;
}

export function CreateEventDialog({
  open,
  onOpenChange,
  onEventCreated,
}: CreateEventDialogProps) {
  const { createEvent, loading } = useEventManagement();
  const supabase = getClient();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    start_datetime: '',
    end_datetime: '',
    location: '',
    event_type: 'optional',
    applies_to_men: true,
    applies_to_women: true,
    applies_to_jv: true,
    applies_to_varsity: true,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least one team is selected
    if (selectedTeamIds.length === 0) {
      alert('Please select at least one team');
      return;
    }

    // Convert datetime-local to ISO for storage
    const eventDataForSubmit: CreateEventData = {
      ...formData,
      start_datetime: dateTimeLocalToISO(formData.start_datetime),
      end_datetime: dateTimeLocalToISO(formData.end_datetime),
    };

    const result = await createEvent(eventDataForSubmit, selectedTeamIds);

    if (result) {
      // Reset form
      setFormData({
        title: '',
        description: '',
        start_datetime: '',
        end_datetime: '',
        location: '',
        event_type: 'optional',
        applies_to_men: true,
        applies_to_women: true,
        applies_to_jv: true,
        applies_to_varsity: true,
      });
      setSelectedTeamIds([]);
      onOpenChange(false);
      onEventCreated?.();
    }
  };

  const toggleTeam = (teamId: string) => {
    setSelectedTeamIds(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Create a new team event. Select which teams this event applies to.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Event Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Team Practice, Match vs. DePauw"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional event details..."
              rows={4}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_datetime">
                Start Date & Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="start_datetime"
                type="datetime-local"
                value={formData.start_datetime}
                onChange={(e) => setFormData({ ...formData, start_datetime: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_datetime">
                End Date & Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="end_datetime"
                type="datetime-local"
                value={formData.end_datetime}
                onChange={(e) => setFormData({ ...formData, end_datetime: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Indoor Tennis Center, Court 1"
            />
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label>
              Event Type <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={formData.event_type}
              onValueChange={(value) =>
                setFormData({ ...formData, event_type: value as 'optional' | 'recommended' | 'mandatory' })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mandatory" id="mandatory" />
                <Label htmlFor="mandatory" className="font-normal cursor-pointer">
                  Mandatory - Required attendance
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recommended" id="recommended" />
                <Label htmlFor="recommended" className="font-normal cursor-pointer">
                  Recommended - Strongly encouraged
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="optional" id="optional" />
                <Label htmlFor="optional" className="font-normal cursor-pointer">
                  Optional - Not required
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Team Selection */}
          <div className="space-y-2">
            <Label>
              Target Teams <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              Select which team(s) this event is for
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

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
