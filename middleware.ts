/**
 * Next.js middleware for handling authentication and routing
 */

import { updateSession } from './lib/supabase/middleware';
import type { NextRequest } from 'next/server';

/**
 * Middleware function that runs on every request
 * Handles Supabase session refresh and authentication
 *
 * @param request - Next.js request object
 * @returns Next.js response object
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

/**
 * Configure which routes the middleware should run on
 * Exclude static files and API routes that don't need auth
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
