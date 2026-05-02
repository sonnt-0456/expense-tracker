import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TransactionService } from '@/lib/services/transaction.service';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID(),
          },
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') as 'daily' | 'weekly' | 'monthly') || 'monthly';

    if (!['daily', 'weekly', 'monthly'].includes(period)) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_PERIOD',
            message: 'Period must be daily, weekly, or monthly',
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID(),
          },
        },
        { status: 400 }
      );
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
  } catch (error: any) {
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
