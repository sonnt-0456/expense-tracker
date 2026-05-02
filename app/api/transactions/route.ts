import { NextRequest, NextResponse } from 'next/server';
import { getErrorCode, jsonError } from '@/lib/http/error-response';
import { createClient } from '@/lib/supabase/server';
import { TransactionService } from '@/lib/services/transaction.service';
import { transactionSchema, filterSchema } from '@/lib/validation/schemas';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      categoryId: searchParams.get('categoryId') || undefined,
      type: (searchParams.get('type') as 'income' | 'expense') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      searchQuery: searchParams.get('searchQuery') || undefined,
    };
    const validation = filterSchema.safeParse(filters);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');

    if (!validation.success) {
      return jsonError(400, 'VALIDATION_ERROR', 'Invalid filter data', validation.error.flatten().fieldErrors);
    }

    const transactionService = new TransactionService(supabase);
    const result = await transactionService.list(user.id, validation.data, page, pageSize);

    return NextResponse.json(result, { status: 200 });
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
    const validation = transactionSchema.safeParse(body);

    if (!validation.success) {
      return jsonError(400, 'VALIDATION_ERROR', 'Invalid input data', validation.error.flatten().fieldErrors);
    }

    const transactionService = new TransactionService(supabase);
    const transaction = await transactionService.create(user.id, validation.data);

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: unknown) {
    if (getErrorCode(error) === '23503') {
      return jsonError(404, 'INVALID_CATEGORY', 'Category not found');
    }

    return jsonError(500, 'SERVER_ERROR', 'An unexpected error occurred');
  }
}
