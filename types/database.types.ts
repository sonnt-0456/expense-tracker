type SupabaseRelationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type SupabaseTable = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
  Relationships: SupabaseRelationship[];
};

type SupabaseView = {
  Row: Record<string, unknown>;
  Relationships: SupabaseRelationship[];
};

type SupabaseFunction = {
  Args: Record<string, unknown> | never;
  Returns: unknown;
};

type SupabaseSchema = {
  Tables: Record<string, SupabaseTable>;
  Views: Record<string, SupabaseView>;
  Functions: Record<string, SupabaseFunction>;
};

type PublicSchema = SupabaseSchema & {
  Tables: {
    categories: {
      Row: Category;
      Insert: CategoryInsert;
      Update: CategoryUpdate;
      Relationships: [];
    };
    transactions: {
      Row: Transaction;
      Insert: TransactionInsert;
      Update: TransactionUpdate;
      Relationships: [];
    };
  };
  Views: Record<string, never>;
  Functions: Record<string, never>;
};

export interface Database {
  public: PublicSchema;
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
  id?: string;
  user_id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface TransactionInsert {
  id?: string;
  user_id: string;
  category_id: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryUpdate {
  user_id?: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TransactionUpdate {
  user_id?: string;
  category_id?: string;
  amount?: number;
  date?: string;
  type?: 'income' | 'expense';
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}
