'use client';

interface DashboardStatsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export function DashboardStats({ totalIncome, totalExpense, balance, transactionCount }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-sm text-gray-600 mb-1">Total Income</p>
        <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-sm text-gray-600 mb-1">Total Expense</p>
        <p className="text-2xl font-bold text-red-600">${totalExpense.toFixed(2)}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-sm text-gray-600 mb-1">Balance</p>
        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ${balance.toFixed(2)}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-sm text-gray-600 mb-1">Transactions</p>
        <p className="text-2xl font-bold text-gray-900">{transactionCount}</p>
      </div>
    </div>
  );
}
