/**
 * Supabase client for client-side components
 * Use this in components marked with "use client"
 */

import { createBrowserClient } from '@supabase/ssr';
import { Database } from '../types/database.types';

/**
 * Creates and returns a Supabase client for client-side operations
 * This client automatically handles authentication state
 *
 * @returns Supabase client instance
 */
export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

/**
 * Singleton client instance for client components
 * This ensures we reuse the same client instance across the application
 */
let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export const getClient = () => {
  if (!clientInstance) {
    clientInstance = createClient();
  }
  return clientInstance;
};
