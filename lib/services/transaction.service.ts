import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Transaction, TransactionInsert } from '@/types/database.types';
import { FilterState, PaginatedResult } from '@/types/api.types';

export class TransactionService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async create(userId: string, data: Omit<TransactionInsert, 'user_id'>): Promise<Transaction> {
    const { data: transaction, error } = await this.supabase
      .from('transactions')
      .insert({
        user_id: userId,
        category_id: data.category_id,
        amount: data.amount,
        date: data.date,
        type: data.type,
        description: data.description || null,
      })
      .select()
      .single();

    if (error) throw error;
    return transaction;
  }

  async update(
    id: string,
    userId: string,
    data: Partial<Omit<TransactionInsert, 'user_id'>>
  ): Promise<Transaction> {
    const { data: transaction, error } = await this.supabase
      .from('transactions')
      .update(data)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!transaction) throw new Error('Transaction not found or unauthorized');
    return transaction;
  }

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async getById(id: string, userId: string): Promise<Transaction | null> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select()
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async list(
    userId: string,
    filters: FilterState = {},
    page: number = 1,
    pageSize: number = 50
  ): Promise<PaginatedResult<Transaction>> {
    let query = this.supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Apply filters
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.dateFrom) {
      query = query.gte('date', filters.dateFrom);
    }
    if (filters.dateTo) {
      query = query.lte('date', filters.dateTo);
    }
    if (filters.searchQuery) {
      query = query.ilike('description', `%${filters.searchQuery}%`);
    }

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query
      .order('date', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    };
  }

  async getStats(userId: string, period: 'daily' | 'weekly' | 'monthly') {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('date, type, amount')
      .eq('user_id', userId)
      .order('date', { ascending: true });

    if (error) throw error;

    const transactions = data || [];
    const grouped: Record<string, { income: number; expense: number }> = {};

    transactions.forEach((t) => {
      let key: string;
      const date = new Date(t.date);

      if (period === 'daily') {
        key = t.date;
      } else if (period === 'weekly') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!grouped[key]) {
        grouped[key] = { income: 0, expense: 0 };
      }

      if (t.type === 'income') {
        grouped[key].income += Number(t.amount);
      } else {
        grouped[key].expense += Number(t.amount);
      }
    });

    return Object.entries(grouped)
      .map(([date, values]) => ({
        date,
        income: values.income,
        expense: values.expense,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getDashboardStats(userId: string) {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('type, amount')
      .eq('user_id', userId);

    if (error) throw error;

    const transactions = data || [];
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === 'income') {
        totalIncome += Number(t.amount);
      } else {
        totalExpense += Number(t.amount);
      }
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: transactions.length,
    };
  }

  async exportCSV(userId: string): Promise<string> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('date, type, category_id, amount, description')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;

    const transactions = data || [];
    
    // Get categories for mapping
    const { data: categories } = await this.supabase
      .from('categories')
      .select('id, name')
      .eq('user_id', userId);

    const categoryMap = new Map(categories?.map((c) => [c.id, c.name]) || []);

    // CSV header
    let csv = 'Date,Type,Category,Amount,Description\n';

    // CSV rows
    transactions.forEach((t) => {
      const categoryName = categoryMap.get(t.category_id) || 'Unknown';
      const description = (t.description || '').replace(/"/g, '""'); // Escape quotes
      csv += `${t.date},${t.type},${categoryName},${Number(t.amount).toFixed(2)},"${description}"\n`;
    });

    return csv;
  }
}
