import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = Boolean(user);

  return (
    <div className="flex min-h-[calc(100vh-81px)] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_38%),linear-gradient(135deg,_#eff6ff_0%,_#ecfeff_48%,_#f8fafc_100%)]">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-6 text-5xl font-bold text-gray-900">
          Expense Tracker
        </h1>
        <p className="mb-8 text-xl text-gray-600">
          {isAuthenticated
            ? 'Welcome back. Jump into your dashboard, review recent activity, and keep your finances under control.'
            : 'Track your income and expenses, visualize spending patterns, and take control of your finances.'}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/transactions"
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
              >
                View Transactions
              </Link>
              <Link
                href="/categories"
                className="rounded-lg border-2 border-blue-600 bg-white px-6 py-3 font-medium text-blue-600 transition hover:bg-blue-50"
              >
                Manage Categories
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="rounded-lg border-2 border-blue-600 bg-white px-6 py-3 font-medium text-blue-600 transition hover:bg-blue-50"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
