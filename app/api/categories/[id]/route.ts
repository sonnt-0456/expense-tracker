import { NextRequest, NextResponse } from 'next/server';
import { getErrorCode, getErrorMessage, jsonError } from '@/lib/http/error-response';
import { createClient } from '@/lib/supabase/server';
import { CategoryService } from '@/lib/services/category.service';
import { categorySchema } from '@/lib/validation/schemas';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  void request;
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    const categoryService = new CategoryService(supabase);
    const category = await categoryService.getById(id, user.id);

    if (!category) {
      return jsonError(404, 'NOT_FOUND', 'Category not found');
    }

    return NextResponse.json(category, { status: 200 });
  } catch {
    return jsonError(500, 'SERVER_ERROR', 'An unexpected error occurred');
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    const category = await categoryService.update(id, user.id, validation.data.name);

    return NextResponse.json(category, { status: 200 });
  } catch (error: unknown) {
    if (getErrorMessage(error)?.includes('not found or unauthorized')) {
      return jsonError(404, 'NOT_FOUND', 'Category not found');
    }

    if (getErrorCode(error) === '23505') {
      return jsonError(409, 'DUPLICATE_NAME', 'Category name already exists');
    }

    return jsonError(500, 'SERVER_ERROR', 'An unexpected error occurred');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  void request;
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    const categoryService = new CategoryService(supabase);
    await categoryService.delete(id, user.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    if (getErrorMessage(error)?.includes('associated transactions')) {
      return jsonError(409, 'CATEGORY_IN_USE', 'Cannot delete category with associated transactions');
    }

    return jsonError(500, 'SERVER_ERROR', 'An unexpected error occurred');
  }
}
