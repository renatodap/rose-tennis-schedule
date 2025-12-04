'use client';

/**
 * Profile completion dialog for OAuth users
 * Collects required information not provided by OAuth provider
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { getClient } from '@/lib/supabase/client';
import { useToast } from '@/lib/hooks/use-toast';
import { Gender, UserRole, TeamLevel } from '@/lib/constants';
import { Team } from '@/lib/types/database.types';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum([UserRole.PLAYER, UserRole.CAPTAIN, UserRole.COACH], {
    required_error: 'Please select your role',
  }),
  teamIds: z.array(z.string()).optional(),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface CompleteProfileDialogProps {
  isOpen: boolean;
  userId: string;
  email: string;
  onComplete: () => void;
}

export function CompleteProfileDialog({ isOpen, userId, email, onComplete }: CompleteProfileDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const supabase = getClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
    },
  });

  const selectedRole = watch('role');

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
      }
    };

    fetchTeams();
  }, [supabase]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);

    try {
      // Validate team selection for players and captains
      if ((data.role === UserRole.PLAYER || data.role === UserRole.CAPTAIN) && selectedTeamIds.length === 0) {
        toast({
          title: 'Team selection required',
          description: 'Please select at least one team.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Get the first selected team to populate legacy gender/team_level fields
      const firstTeam = teams.find(t => t.id === selectedTeamIds[0]);

      // Create user profile
      const { error: profileError } = await supabase.from('users').upsert({
        id: userId,
        email,
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role,
        // Set gender/team_level for backward compatibility (nullable for coaches)
        gender: firstTeam?.gender || null,
        team_level: firstTeam?.team_level || null,
        phone_number: data.phone || null,
      }, {
        onConflict: 'id'
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        toast({
          title: 'Profile creation failed',
          description: 'Please try again or contact support.',
          variant: 'destructive',
        });
        return;
      }

      // Create team memberships for players and captains
      if (data.role !== UserRole.COACH && selectedTeamIds.length > 0) {
        const userTeams = selectedTeamIds.map(teamId => ({
          user_id: userId,
          team_id: teamId,
        }));

        const { error: teamsError } = await supabase
          .from('user_teams')
          .insert(userTeams);

        if (teamsError) {
          console.error('Team assignment error:', teamsError);
          // Don't fail the whole process, just warn
        }
      }

      toast({
        title: 'Profile completed!',
        description: 'Welcome to Rose-Hulman Tennis.',
      });

      // Trigger refresh
      onComplete();
      router.refresh();
    } catch (error) {
      console.error('Profile completion error:', error);
      toast({
        title: 'An error occurred',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to Rose-Hulman Tennis!</DialogTitle>
          <DialogDescription className="text-base">
            Let&apos;s complete your profile to get you started. This will only take a moment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-neutral-700 font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="bg-neutral-50 h-11"
            />
          </div>

          {/* First and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-neutral-700 font-medium">
                First Name *
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                disabled={isLoading}
                aria-invalid={errors.firstName ? 'true' : 'false'}
                className="h-11"
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600 font-medium" role="alert">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-neutral-700 font-medium">
                Last Name *
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                disabled={isLoading}
                aria-invalid={errors.lastName ? 'true' : 'false'}
                className="h-11"
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600 font-medium" role="alert">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Role selection */}
          <div className="space-y-3">
            <Label className="text-neutral-700 font-medium">Your Role *</Label>
            <RadioGroup
              value={selectedRole || ''}
              onValueChange={(value) => setValue('role', value as UserRole)}
              disabled={isLoading}
              aria-invalid={errors.role ? 'true' : 'false'}
              className="space-y-2"
            >
              <div className="flex items-center space-x-3 border-2 border-neutral-200 rounded-lg p-3 hover:border-maroon-700 transition-colors cursor-pointer has-[:checked]:border-maroon-700 has-[:checked]:bg-maroon-50">
                <RadioGroupItem value={UserRole.PLAYER} id="player" />
                <Label htmlFor="player" className="font-medium cursor-pointer flex-1">
                  Player
                </Label>
              </div>
              <div className="flex items-center space-x-3 border-2 border-neutral-200 rounded-lg p-3 hover:border-maroon-700 transition-colors cursor-pointer has-[:checked]:border-maroon-700 has-[:checked]:bg-maroon-50">
                <RadioGroupItem value={UserRole.CAPTAIN} id="captain" />
                <Label htmlFor="captain" className="font-medium cursor-pointer flex-1">
                  Captain
                </Label>
              </div>
              <div className="flex items-center space-x-3 border-2 border-neutral-200 rounded-lg p-3 hover:border-maroon-700 transition-colors cursor-pointer has-[:checked]:border-maroon-700 has-[:checked]:bg-maroon-50">
                <RadioGroupItem value={UserRole.COACH} id="coach" />
                <Label htmlFor="coach" className="font-medium cursor-pointer flex-1">
                  Coach
                </Label>
              </div>
            </RadioGroup>
            {errors.role && (
              <p className="text-sm text-red-600 font-medium" role="alert">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Team selection (for players and captains only) */}
          {selectedRole && selectedRole !== UserRole.COACH && (
            <div className="space-y-3">
              <Label className="text-neutral-700 font-medium">Select Team(s) *</Label>
              <p className="text-sm text-neutral-600">
                Choose which team(s) you belong to
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-neutral-200 rounded-lg p-3">
                {teams.map((team) => (
                  <div key={team.id} className="flex items-center space-x-3 p-2 hover:bg-neutral-50 rounded transition-colors">
                    <Checkbox
                      id={team.id}
                      checked={selectedTeamIds.includes(team.id)}
                      onCheckedChange={() => toggleTeam(team.id)}
                      disabled={isLoading}
                    />
                    <Label htmlFor={team.id} className="font-medium cursor-pointer flex-1">
                      {team.name}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedTeamIds.length === 0 && selectedRole && (
                <p className="text-sm text-red-600 font-medium">
                  Please select at least one team
                </p>
              )}
            </div>
          )}

          {/* Note for coaches */}
          {selectedRole === UserRole.COACH && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                As a coach, your team assignments will be managed by the head coach after your profile is created.
              </p>
            </div>
          )}

          {/* Phone number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-neutral-700 font-medium">
              Phone Number <span className="text-neutral-500 font-normal">(Optional)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(123) 456-7890"
              disabled={isLoading}
              className="h-11"
              {...register('phone')}
            />
            <p className="text-xs text-neutral-500">For team communication and notifications</p>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full h-11 bg-maroon-700 hover:bg-maroon-800 text-white font-semibold shadow-sm hover:shadow-md transition-all mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Completing profile...
              </span>
            ) : (
              'Complete Profile'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
