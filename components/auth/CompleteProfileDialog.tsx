'use client';

/**
 * Profile completion dialog for OAuth users
 * Collects required information not provided by OAuth provider
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getClient } from '@/lib/supabase/client';
import { useToast } from '@/lib/hooks/use-toast';
import { Gender, UserRole } from '@/lib/constants';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.enum([Gender.MEN, Gender.WOMEN], {
    required_error: 'Please select a gender',
  }),
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
  const supabase = getClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const selectedGender = watch('gender');

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);

    try {
      // Create user profile
      const { error: profileError } = await supabase.from('users').insert({
        id: userId,
        email,
        first_name: data.firstName,
        last_name: data.lastName,
        gender: data.gender,
        role: UserRole.PLAYER,
        phone_number: data.phone || null,
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

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide a few more details to finish setting up your account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="bg-gray-50"
            />
          </div>

          {/* First and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                disabled={isLoading}
                aria-invalid={errors.firstName ? 'true' : 'false'}
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                disabled={isLoading}
                aria-invalid={errors.lastName ? 'true' : 'false'}
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Gender selection */}
          <div className="space-y-2">
            <Label>Gender *</Label>
            <RadioGroup
              value={selectedGender}
              onValueChange={(value) => setValue('gender', value as Gender)}
              disabled={isLoading}
              aria-invalid={errors.gender ? 'true' : 'false'}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Gender.MEN} id="men" />
                <Label htmlFor="men" className="font-normal cursor-pointer">
                  Men's Team
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Gender.WOMEN} id="women" />
                <Label htmlFor="women" className="font-normal cursor-pointer">
                  Women's Team
                </Label>
              </div>
            </RadioGroup>
            {errors.gender && (
              <p className="text-sm text-red-600" role="alert">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Phone number */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(123) 456-7890"
              disabled={isLoading}
              {...register('phone')}
            />
            <p className="text-xs text-gray-500">Optional - for team communication</p>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            style={{ backgroundColor: '#800000' }}
          >
            {isLoading ? 'Completing profile...' : 'Complete Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
