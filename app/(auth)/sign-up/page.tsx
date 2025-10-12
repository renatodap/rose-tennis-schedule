'use client';

/**
 * Sign-up page component
 * Allows new users to create an account with profile information
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/lib/hooks/use-toast';
import { getClient } from '@/lib/supabase/client';
import { BRAND_COLORS, Gender, UserRole, TeamLevel } from '@/lib/constants';

// Form validation schema
const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.enum([Gender.MEN, Gender.WOMEN], {
    required_error: 'Please select a gender',
  }),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
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
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const selectedGender = watch('gender');

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        toast({
          title: 'Sign up failed',
          description: authError.message,
          variant: 'destructive',
        });
        return;
      }

      if (!authData.user) {
        toast({
          title: 'Sign up failed',
          description: 'Unable to create user account.',
          variant: 'destructive',
        });
        return;
      }

      // Create user profile in users table
      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        gender: data.gender,
        role: UserRole.PLAYER, // Default role
        team_level: TeamLevel.JV, // Default team level
        phone: data.phone || null,
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        toast({
          title: 'Profile creation failed',
          description: 'Account created but profile setup incomplete. Please contact support.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Account created successfully!',
        description: 'Welcome to Rose-Hulman Tennis.',
      });

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Sign up error:', error);
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
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
        <p className="text-sm text-gray-600">
          Join the Rose-Hulman Tennis team
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@rose-hulman.edu"
            autoComplete="email"
            disabled={isLoading}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-600" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* First and Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              autoComplete="given-name"
              disabled={isLoading}
              aria-invalid={errors.firstName ? 'true' : 'false'}
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              {...register('firstName')}
            />
            {errors.firstName && (
              <p id="firstName-error" className="text-sm text-red-600" role="alert">
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
              autoComplete="family-name"
              disabled={isLoading}
              aria-invalid={errors.lastName ? 'true' : 'false'}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              {...register('lastName')}
            />
            {errors.lastName && (
              <p id="lastName-error" className="text-sm text-red-600" role="alert">
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
            aria-describedby={errors.gender ? 'gender-error' : undefined}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={Gender.MEN} id="men" />
              <Label htmlFor="men" className="font-normal cursor-pointer">
                Men&apos;s Team
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={Gender.WOMEN} id="women" />
              <Label htmlFor="women" className="font-normal cursor-pointer">
                Women&apos;s Team
              </Label>
            </div>
          </RadioGroup>
          {errors.gender && (
            <p id="gender-error" className="text-sm text-red-600" role="alert">
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
            autoComplete="tel"
            disabled={isLoading}
            aria-describedby="phone-description"
            {...register('phone')}
          />
          <p id="phone-description" className="text-xs text-gray-500">
            Optional - for team communication
          </p>
        </div>

        {/* Password field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password (min 8 characters)"
            autoComplete="new-password"
            disabled={isLoading}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
          {errors.password && (
            <p id="password-error" className="text-sm text-red-600" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm password field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            disabled={isLoading}
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p id="confirmPassword-error" className="text-sm text-red-600" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          style={{
            backgroundColor: BRAND_COLORS.PRIMARY,
          }}
          aria-label="Create your account"
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      {/* Sign in link */}
      <div className="text-center text-sm">
        <span className="text-gray-600">Already have an account? </span>
        <Link
          href="/sign-in"
          className="font-medium hover:underline"
          style={{ color: BRAND_COLORS.PRIMARY }}
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
