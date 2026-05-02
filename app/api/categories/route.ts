import { NextRequest, NextResponse } from 'next/server';
import { getErrorCode, jsonError } from '@/lib/http/error-response';
import { createClient } from '@/lib/supabase/server';
import { CategoryService } from '@/lib/services/category.service';
import { categorySchema } from '@/lib/validation/schemas';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    const categoryService = new CategoryService(supabase);
    const categories = await categoryService.list(user.id);

    return NextResponse.json(categories, { status: 200 });
  } catch {
    return jsonError(500, 'SERVER_ERROR', 'An unexpected error occurred');
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    const body = await request.json();
    const validation = categorySchema.safeParse(body);

    if (!validation.success) {
      return jsonError(400, 'VALIDATION_ERROR', 'Invalid input data', validation.error.flatten().fieldErrors);
    }

    const categoryService = new CategoryService(supabase);
    const category = await categoryService.create(user.id, validation.data.name);

    return NextResponse.json(category, { status: 201 });
  } catch (error: unknown) {
    if (getErrorCode(error) === '23505') {
      // Unique constraint violation
      return jsonError(409, 'DUPLICATE_NAME', 'Category name already exists');
    }

    return jsonError(500, 'SERVER_ERROR', 'An unexpected error occurred');
  }
}
