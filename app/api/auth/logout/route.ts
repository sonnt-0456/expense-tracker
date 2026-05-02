import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { jsonError } from '@/lib/http/error-response';
import { AuthService } from '@/lib/services/auth.service';

export async function POST() {
  try {
    const supabase = await createClient();
    const authService = new AuthService(supabase);

    await authService.logout();

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch {
    return jsonError(500, 'SERVER_ERROR', 'An unexpected error occurred');
  }
}
