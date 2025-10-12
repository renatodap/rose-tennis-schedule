/**
 * Authentication layout component
 * Provides centered layout with Rose-Hulman branding for auth pages
 */

import { BRAND_COLORS } from '@/lib/constants';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Rose-Hulman branding */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{ color: BRAND_COLORS.PRIMARY }}
            >
              Rose-Hulman Tennis
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Team Availability Management
            </p>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Rose-Hulman Institute of Technology</p>
        </div>
      </footer>
    </div>
  );
}
