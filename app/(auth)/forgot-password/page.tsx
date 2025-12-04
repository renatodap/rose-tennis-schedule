'use client';

/**
 * Forgot password page component
 * Allows users to request a password reset email
 */

import { useState } from 'react';
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

// Form validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const supabase = getClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: 'Error sending reset email',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      setIsSubmitted(true);
      toast({
        title: 'Password reset email sent',
        description: 'Please check your email for instructions.',
      });
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

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <div className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-green-50 ring-2 ring-green-500/20">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Check Your Email
          </h2>
          <p className="text-sm text-neutral-600 max-w-sm mx-auto">
            We&apos;ve sent a password reset link to your email address. Please check your inbox and follow the instructions.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 text-center">
            Didn&apos;t receive the email? Check your spam folder or try again.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="w-full h-11 border-neutral-300 hover:bg-neutral-50"
            aria-label="Go back to request another reset email"
          >
            Try Again
          </Button>

          <div className="text-center">
            <Link
              href="/sign-in"
              className="text-sm font-semibold text-maroon-700 hover:text-maroon-800 hover:underline transition-colors"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
          Reset Password
        </h2>
        <p className="text-sm text-neutral-600">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

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

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full h-11 bg-maroon-700 hover:bg-maroon-800 text-white font-semibold shadow-sm hover:shadow-md transition-all"
          disabled={isLoading}
          aria-label="Send password reset email"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </span>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-neutral-200" />
        </div>
      </div>

      {/* Back to sign in link */}
      <div className="text-center">
        <Link
          href="/sign-in"
          className="text-sm font-semibold text-maroon-700 hover:text-maroon-800 hover:underline transition-colors"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
