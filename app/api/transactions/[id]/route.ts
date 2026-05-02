import { NextRequest, NextResponse } from 'next/server';
import { getErrorMessage, jsonError } from '@/lib/http/error-response';
import { createClient } from '@/lib/supabase/server';
import { TransactionService } from '@/lib/services/transaction.service';
import { transactionSchema } from '@/lib/validation/schemas';

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

    const transactionService = new TransactionService(supabase);
    const transaction = await transactionService.getById(id, user.id);

    if (!transaction) {
      return jsonError(404, 'NOT_FOUND', 'Transaction not found');
    }

    return NextResponse.json(transaction, { status: 200 });
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
    const validation = transactionSchema.safeParse(body);

    if (!validation.success) {
      return jsonError(400, 'VALIDATION_ERROR', 'Invalid input data', validation.error.flatten().fieldErrors);
    }

    const transactionService = new TransactionService(supabase);
    const transaction = await transactionService.update(id, user.id, validation.data);

    return NextResponse.json(transaction, { status: 200 });
  } catch (error: unknown) {
    if (getErrorMessage(error)?.includes('not found or unauthorized')) {
      return jsonError(404, 'NOT_FOUND', 'Transaction not found');
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

    const transactionService = new TransactionService(supabase);
    await transactionService.delete(id, user.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return jsonError(500, 'SERVER_ERROR', 'An unexpected error occurred');
  }
}
