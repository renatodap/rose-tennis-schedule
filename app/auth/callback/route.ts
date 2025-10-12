import { NextResponse } from 'next/server';
import { getClient } from '@/lib/supabase/client';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = getClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to dashboard after OAuth flow
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
}
