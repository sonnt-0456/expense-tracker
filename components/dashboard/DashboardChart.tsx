'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  date: string;
  income: number;
  expense: number;
}

interface DashboardChartProps {
  data: ChartDataPoint[];
  period: 'daily' | 'weekly' | 'monthly';
  onPeriodChange: (period: 'daily' | 'weekly' | 'monthly') => void;
}

export function DashboardChart({ data, period, onPeriodChange }: DashboardChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Spending Trends</h2>
        <div className="flex gap-2">
          <button
            onClick={() => onPeriodChange('daily')}
            className={`px-3 py-1 text-sm rounded ${
              period === 'daily'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => onPeriodChange('weekly')}
            className={`px-3 py-1 text-sm rounded ${
              period === 'weekly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => onPeriodChange('monthly')}
            className={`px-3 py-1 text-sm rounded ${
              period === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No data available for the selected period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
            <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Expense" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
