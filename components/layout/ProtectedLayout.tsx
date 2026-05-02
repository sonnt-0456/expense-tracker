import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <>{children}</>;
}
