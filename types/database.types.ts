export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: CategoryInsert;
        Update: CategoryUpdate;
      };
      transactions: {
        Row: Transaction;
        Insert: TransactionInsert;
        Update: TransactionUpdate;
      };
    };
  };
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryInsert {
  user_id: string;
  name: string;
}

export interface TransactionInsert {
  user_id: string;
  category_id: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  description?: string | null;
}

export interface CategoryUpdate {
  name?: string;
  updated_at?: string;
}

export interface TransactionUpdate {
  category_id?: string;
  amount?: number;
  date?: string;
  type?: 'income' | 'expense';
  description?: string | null;
  updated_at?: string;
}
