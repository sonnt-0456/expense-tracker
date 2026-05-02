'use client';

import { useState, useEffect } from 'react';
import { Transaction, Category } from '@/types/database.types';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransactionList } from '@/components/transactions/TransactionList';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, [page]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/transactions?page=${page}&pageSize=50`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.data);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to create transaction');
    }

    await fetchTransactions();
    setShowForm(false);
  };

  const handleUpdate = async (data: any) => {
    if (!editingTransaction) return;

    const response = await fetch(`/api/transactions/${editingTransaction.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to update transaction');
    }

    await fetchTransactions();
    setEditingTransaction(undefined);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error?.message || 'Failed to delete transaction');
        return;
      }

      await fetchTransactions();
    } catch (error) {
      alert('Failed to delete transaction');
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await fetch('/api/transactions/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to export transactions');
      }
    } catch (error) {
      alert('Failed to export transactions');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Transaction
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {(showForm || editingTransaction) && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
            </h2>
            <TransactionForm
              transaction={editingTransaction}
              categories={categories}
              onSubmit={editingTransaction ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false);
                setEditingTransaction(undefined);
              }}
            />
          </div>
        )}

        <TransactionList
          transactions={transactions}
          categories={categories}
          onEdit={(transaction) => {
            setEditingTransaction(transaction);
            setShowForm(false);
          }}
          onDelete={handleDelete}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
