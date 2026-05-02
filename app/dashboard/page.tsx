'use client';

import { useEffect, useState } from 'react';
import { DashboardChart } from '@/components/dashboard/DashboardChart';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import type { ChartDataPoint, DashboardStats as DashboardSummary } from '@/types/api.types';

interface DashboardResponse {
  data: ChartDataPoint[];
  summary: DashboardSummary;
}

export default function DashboardPage() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [stats, setStats] = useState<DashboardSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
  });
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      try {
        const response = await fetch(`/api/transactions/stats?period=${period}`);
        if (!response.ok) {
          throw new Error('Failed to load stats');
        }

        const data = (await response.json()) as DashboardResponse;
        if (!cancelled) {
          setChartData(data.data);
          setStats(data.summary);
        }
      } catch {
        console.error('Failed to load stats');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadStats();

    return () => {
      cancelled = true;
    };
  }, [period]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-81px)] items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-81px)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Overview of your income, expenses, and balance.
          </p>
        </div>

        <DashboardStats
          totalIncome={stats.totalIncome}
          totalExpense={stats.totalExpense}
          balance={stats.balance}
          transactionCount={stats.transactionCount}
        />

        <DashboardChart data={chartData} period={period} onPeriodChange={setPeriod} />
      </div>
    </div>
  );
}
