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
import { MicrosoftSignInButton } from '@/components/auth/MicrosoftSignInButton';

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
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      gender: undefined,
      phone: '',
    },
  });

  const selectedGender = watch('gender');

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      });

      if (authError) {
        console.error('Auth error:', authError);
        toast({
          title: 'Sign up failed',
          description: authError.message || 'Unable to create account. Please try again.',
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

      // Check if email confirmation is required
      if (authData.user && !authData.session) {
        toast({
          title: 'Check your email',
          description: 'Please check your email to confirm your account before signing in.',
        });
        router.push('/sign-in');
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
        phone_number: data.phone || null,
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
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
          Join the Team
        </h2>
        <p className="text-sm text-neutral-600">
          Create your Rose-Hulman Tennis account
        </p>
      </div>

      {/* Microsoft OAuth button - Hidden until IT approval
      <div className="space-y-4">
        <MicrosoftSignInButton mode="signup" />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-neutral-500 font-medium">Or sign up with email</span>
          </div>
        </div>
      </div>
      */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-neutral-700 font-medium">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@rose-hulman.edu"
            autoComplete="email"
            disabled={isLoading}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="h-11 transition-all"
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-600 font-medium" role="alert">
              {errors.email.message}
            </p>
          )}
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
              autoComplete="given-name"
              disabled={isLoading}
              aria-invalid={errors.firstName ? 'true' : 'false'}
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              className="h-11 transition-all"
              {...register('firstName')}
            />
            {errors.firstName && (
              <p id="firstName-error" className="text-sm text-red-600 font-medium" role="alert">
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
              autoComplete="family-name"
              disabled={isLoading}
              aria-invalid={errors.lastName ? 'true' : 'false'}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              className="h-11 transition-all"
              {...register('lastName')}
            />
            {errors.lastName && (
              <p id="lastName-error" className="text-sm text-red-600 font-medium" role="alert">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Gender selection */}
        <div className="space-y-3">
          <Label className="text-neutral-700 font-medium">Team *</Label>
          <RadioGroup
            value={selectedGender || ''}
            onValueChange={(value) => setValue('gender', value as Gender)}
            disabled={isLoading}
            aria-invalid={errors.gender ? 'true' : 'false'}
            aria-describedby={errors.gender ? 'gender-error' : undefined}
            className="grid grid-cols-2 gap-3"
          >
            <div className="flex items-center space-x-3 border-2 border-neutral-200 rounded-lg p-3 hover:border-maroon-700 transition-colors cursor-pointer has-[:checked]:border-maroon-700 has-[:checked]:bg-maroon-50">
              <RadioGroupItem value={Gender.MEN} id="men" />
              <Label htmlFor="men" className="font-medium cursor-pointer flex-1">
                Men&apos;s
              </Label>
            </div>
            <div className="flex items-center space-x-3 border-2 border-neutral-200 rounded-lg p-3 hover:border-maroon-700 transition-colors cursor-pointer has-[:checked]:border-maroon-700 has-[:checked]:bg-maroon-50">
              <RadioGroupItem value={Gender.WOMEN} id="women" />
              <Label htmlFor="women" className="font-medium cursor-pointer flex-1">
                Women&apos;s
              </Label>
            </div>
          </RadioGroup>
          {errors.gender && (
            <p id="gender-error" className="text-sm text-red-600 font-medium" role="alert">
              {errors.gender.message}
            </p>
          )}
        </div>

        {/* Phone number */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-neutral-700 font-medium">
            Phone Number <span className="text-neutral-500 font-normal">(Optional)</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(123) 456-7890"
            autoComplete="tel"
            disabled={isLoading}
            aria-describedby="phone-description"
            className="h-11 transition-all"
            {...register('phone')}
          />
          <p id="phone-description" className="text-xs text-neutral-500">
            For team communication and notifications
          </p>
        </div>

        {/* Password field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-neutral-700 font-medium">
            Password *
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            disabled={isLoading}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className="h-11 transition-all"
            {...register('password')}
          />
          {errors.password && (
            <p id="password-error" className="text-sm text-red-600 font-medium" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm password field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-neutral-700 font-medium">
            Confirm Password *
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            disabled={isLoading}
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            className="h-11 transition-all"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p id="confirmPassword-error" className="text-sm text-red-600 font-medium" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full h-11 bg-maroon-700 hover:bg-maroon-800 text-white font-semibold shadow-sm hover:shadow-md transition-all mt-6"
          disabled={isLoading}
          aria-label="Create your account"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-neutral-200" />
        </div>
      </div>

      {/* Sign in link */}
      <div className="text-center text-sm">
        <span className="text-neutral-600">Already have an account? </span>
        <Link
          href="/sign-in"
          className="font-semibold text-maroon-700 hover:text-maroon-800 hover:underline transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
