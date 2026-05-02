import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-81px)] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_38%),linear-gradient(135deg,_#eff6ff_0%,_#ecfeff_48%,_#f8fafc_100%)]">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-6 text-5xl font-bold text-gray-900">
          Expense Tracker
        </h1>
        <p className="mb-8 text-xl text-gray-600">
          Track your income and expenses, visualize spending patterns, and take control of your finances.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
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
        </div>
      </div>
    </div>
  );
}
