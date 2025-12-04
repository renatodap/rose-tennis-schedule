'use client';

/**
 * Sign-in page component
 * Allows users to sign in with email and password
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
import { useToast } from '@/lib/hooks/use-toast';
import { getClient } from '@/lib/supabase/client';
import { BRAND_COLORS } from '@/lib/constants';
import { MicrosoftSignInButton } from '@/components/auth/MicrosoftSignInButton';

// Form validation schema
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = getClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
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
          Welcome Back
        </h2>
        <p className="text-sm text-neutral-600">
          Sign in to your Rose-Hulman Tennis account
        </p>
      </div>

      {/* Microsoft OAuth button - Hidden until IT approval
      <div className="space-y-4">
        <MicrosoftSignInButton mode="signin" />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-neutral-500 font-medium">Or continue with email</span>
          </div>
        </div>
      </div>
      */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-neutral-700 font-medium">
            Email Address
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

        {/* Password field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-neutral-700 font-medium">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-maroon-700 hover:text-maroon-800 hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
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

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full h-11 bg-maroon-700 hover:bg-maroon-800 text-white font-semibold shadow-sm hover:shadow-md transition-all"
          disabled={isLoading}
          aria-label="Sign in to your account"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-neutral-200" />
        </div>
      </div>

      {/* Sign up link */}
      <div className="text-center text-sm">
        <span className="text-neutral-600">Don&apos;t have an account? </span>
        <Link
          href="/sign-up"
          className="font-semibold text-maroon-700 hover:text-maroon-800 hover:underline transition-colors"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}
