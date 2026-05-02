import { NextRequest, NextResponse } from 'next/server';
import { jsonError } from '@/lib/http/error-response';
import { createClient } from '@/lib/supabase/server';
import { TransactionService } from '@/lib/services/transaction.service';

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
    const period = (searchParams.get('period') as 'daily' | 'weekly' | 'monthly') || 'monthly';

    if (!['daily', 'weekly', 'monthly'].includes(period)) {
      return jsonError(400, 'INVALID_PERIOD', 'Period must be daily, weekly, or monthly');
    }

    const transactionService = new TransactionService(supabase);
    const stats = await transactionService.getStats(user.id, period);
    const dashboardStats = await transactionService.getDashboardStats(user.id);

    return NextResponse.json(
      {
        data: stats,
        period,
        summary: dashboardStats,
      },
      { status: 200 }
    );
  } catch {
    return jsonError(500, 'SERVER_ERROR', 'An unexpected error occurred');
  }
}
