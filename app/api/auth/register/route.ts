import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AuthService } from '@/lib/services/auth.service';
import { getErrorMessage, jsonError } from '@/lib/http/error-response';
import { registerSchema } from '@/lib/validation/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return jsonError(400, 'VALIDATION_ERROR', 'Invalid input data', validation.error.flatten().fieldErrors);
    }

    const { email, password } = validation.data;
    const supabase = await createClient();
    const authService = new AuthService(supabase);

    const data = await authService.register(email, password);

    return NextResponse.json(
      {
        user: {
          id: data.user!.id,
          email: data.user!.email!,
          created_at: data.user!.created_at,
        },
        session: data.session,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Check for duplicate email
    if (getErrorMessage(error)?.includes('already registered')) {
      return jsonError(409, 'DUPLICATE_EMAIL', 'Email already exists');
    }

    return jsonError(500, 'SERVER_ERROR', 'An unexpected error occurred');
  }
}
