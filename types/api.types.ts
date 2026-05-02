import { User, Category, Transaction } from './database.types';

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  session: Session;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

export interface TransactionInput {
  category_id: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  description?: string;
}

export interface CategoryInput {
  name: string;
}

export interface FilterState {
  categoryId?: string;
  type?: 'income' | 'expense';
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ChartDataPoint {
  date: string;
  income: number;
  expense: number;
}

export interface ChartData {
  data: ChartDataPoint[];
  period: 'daily' | 'weekly' | 'monthly';
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
    timestamp: string;
    requestId: string;
  };
}

export interface TransactionWithCategory extends Transaction {
  category: Category;
}
