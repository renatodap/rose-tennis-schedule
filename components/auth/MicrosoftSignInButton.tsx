'use client';

/**
 * Microsoft/Outlook OAuth sign-in button component
 * Provides a clean, mobile-responsive button for Microsoft authentication
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/lib/hooks/use-toast';
import { getClient } from '@/lib/supabase/client';

interface MicrosoftSignInButtonProps {
  mode?: 'signin' | 'signup';
}

export function MicrosoftSignInButton({ mode = 'signin' }: MicrosoftSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = getClient();

  const handleMicrosoftSignIn = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email',
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // OAuth redirect will happen automatically
    } catch (error) {
      console.error('Microsoft sign in error:', error);
      toast({
        title: 'An error occurred',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleMicrosoftSignIn}
      disabled={isLoading}
    >
      <svg
        className="w-5 h-5 mr-2"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="1" y="1" width="9" height="9" fill="#F25022" />
        <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
        <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
        <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
      </svg>
      {isLoading ? 'Connecting...' : mode === 'signin' ? 'Sign in with Microsoft' : 'Sign up with Microsoft'}
    </Button>
  );
}
