'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@/types/database.types';

const navigationItems = [
  { href: '/', label: 'Home', match: (pathname: string) => pathname === '/' },
  { href: '/dashboard', label: 'Dashboard', match: (pathname: string) => pathname.startsWith('/dashboard') },
  { href: '/transactions', label: 'Transactions', match: (pathname: string) => pathname.startsWith('/transactions') },
  { href: '/categories', label: 'Categories', match: (pathname: string) => pathname.startsWith('/categories') },
];

const guestItems = [
  { href: '/login', label: 'Sign In' },
  { href: '/register', label: 'Get Started' },
];

const mobileItems = [
  ...navigationItems,
  ...guestItems.map((item) => ({
    ...item,
    match: (pathname: string) => pathname === item.href,
  })),
];

function getLinkClasses(active: boolean) {
  return active
    ? 'rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm'
    : 'rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/70 hover:text-slate-900';
}

interface SiteHeaderProps {
  initialUser: User | null;
}

export function SiteHeader({ initialUser }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [supabase] = useState(createClient);
  const [user, setUser] = useState<User | null>(initialUser);
  const [authLoading, setAuthLoading] = useState(initialUser === null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const syncUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!active) return;

      setUser(
        authUser
          ? {
              id: authUser.id,
              email: authUser.email ?? '',
              created_at: authUser.created_at,
            }
          : null
      );
      setAuthLoading(false);
    };

    void syncUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(
        session?.user
          ? {
              id: session.user.id,
              email: session.user.email ?? '',
              created_at: session.user.created_at,
            }
          : null
      );
      setAuthLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [pathname, supabase]);

  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      await supabase.auth.signOut();
      setUser(null);
      router.push('/');
      router.refresh();
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 text-sm font-bold tracking-[0.2em] text-white shadow-lg shadow-cyan-200/70">
            ET
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Expense Tracker
            </p>
            <p className="truncate text-xs text-slate-500">Your personal finance cockpit</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-slate-100/80 p-1 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={getLinkClasses(item.match(pathname))}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
                {user.email}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutLoading}
                className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {logoutLoading ? 'Signing out...' : 'Sign Out'}
              </button>
            </>
          ) : authLoading ? (
            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-400 shadow-sm">
              Checking session...
            </div>
          ) : (
            guestItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    item.href === '/register'
                      ? active
                        ? 'rounded-full border border-blue-700 bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm'
                        : 'rounded-full border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700'
                      : getLinkClasses(active)
                  }
                >
                  {item.label}
                </Link>
              );
            })
          )}
        </div>
      </div>

      <div className="border-t border-slate-200/80 px-4 py-3 md:hidden">
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
          {(user
            ? [
                ...navigationItems,
                {
                  href: '#signout',
                  label: logoutLoading ? 'Signing out...' : 'Sign Out',
                  match: () => false,
                },
              ]
            : mobileItems
          ).map((item) => {
            const active = item.match(pathname);

            if (item.href === '#signout') {
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold whitespace-nowrap text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {item.label}
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${getLinkClasses(active)} whitespace-nowrap border border-transparent`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        {user && (
          <div className="mx-auto mt-3 max-w-7xl text-sm text-slate-500">{user.email}</div>
        )}
      </div>
    </header>
  );
}
