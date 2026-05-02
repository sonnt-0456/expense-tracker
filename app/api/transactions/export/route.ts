import { NextResponse } from 'next/server';
import { jsonError } from '@/lib/http/error-response';
import { createClient } from '@/lib/supabase/server';
import { TransactionService } from '@/lib/services/transaction.service';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    const transactionService = new TransactionService(supabase);
    const csv = await transactionService.exportCSV(user.id);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="transactions-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch {
    return jsonError(500, 'SERVER_ERROR', 'An unexpected error occurred');
  }
}
