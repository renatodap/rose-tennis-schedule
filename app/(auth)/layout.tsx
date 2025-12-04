/**
 * Authentication layout component
 * Premium auth experience with gradient background and centered card
 */

import { colors, gradients } from '@/lib/design-tokens';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6"
      style={{ background: gradients.maroon }}
    >
      {/* Logo and branding */}
      <div className="w-full max-w-md mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-4 shadow-lg">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Rose-Hulman Tennis
        </h1>
        <p className="mt-2 text-sm sm:text-base text-white/80">
          Team Management Platform
        </p>
      </div>

      {/* Main content card */}
      <main className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <p className="text-sm text-white/70">
          &copy; {new Date().getFullYear()} Rose-Hulman Institute of Technology
        </p>
      </footer>
    </div>
  );
}
