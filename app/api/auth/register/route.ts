import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AuthService } from '@/lib/services/auth.service';
import { registerSchema } from '@/lib/validation/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: validation.error.flatten().fieldErrors,
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID(),
          },
        },
        { status: 400 }
      );
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
  } catch (error: any) {
    // Check for duplicate email
    if (error.message?.includes('already registered')) {
      return NextResponse.json(
        {
          error: {
            code: 'DUPLICATE_EMAIL',
            message: 'Email already exists',
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID(),
          },
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred',
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      },
      { status: 500 }
    );
  }
}
