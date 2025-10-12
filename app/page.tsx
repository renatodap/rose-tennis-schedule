import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Landing page that redirects authenticated users to dashboard
 * or unauthenticated users to sign-in
 */
export default async function Home() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/sign-in');
  }
}
