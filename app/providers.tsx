'use client';

/**
 * Client-side providers wrapper
 * Add any React context providers here that need to wrap the entire app
 */

import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <>{children}</>;
}
