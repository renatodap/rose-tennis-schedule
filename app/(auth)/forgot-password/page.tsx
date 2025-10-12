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
        <div className="space-y-2 text-center">
          <div
            className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: `${BRAND_COLORS.PRIMARY}20` }}
          >
            <svg
              className="w-8 h-8"
              style={{ color: BRAND_COLORS.PRIMARY }}
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
          <h2 className="text-2xl font-bold tracking-tight">Check your email</h2>
          <p className="text-sm text-gray-600">
            We&apos;ve sent you a password reset link. Please check your email and follow the instructions.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500 text-center">
            Didn&apos;t receive the email? Check your spam folder or try again.
          </p>

          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="w-full"
            aria-label="Go back to request another reset email"
          >
            Go back
          </Button>
        </div>

        <div className="text-center text-sm">
          <Link
            href="/sign-in"
            className="font-medium hover:underline"
            style={{ color: BRAND_COLORS.PRIMARY }}
          >
            Return to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Forgot Password</h2>
        <p className="text-sm text-gray-600">
          Enter your email address and we&apos;ll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
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

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          style={{
            backgroundColor: BRAND_COLORS.PRIMARY,
          }}
          aria-label="Send password reset email"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      {/* Back to sign in link */}
      <div className="text-center text-sm">
        <Link
          href="/sign-in"
          className="font-medium hover:underline"
          style={{ color: BRAND_COLORS.PRIMARY }}
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
