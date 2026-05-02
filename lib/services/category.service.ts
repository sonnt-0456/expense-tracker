import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { Category } from '@/types/database.types';

export class CategoryService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async create(userId: string, name: string): Promise<Category> {
    const { data, error } = await this.supabase
      .from('categories')
      .insert({ user_id: userId, name: name.trim() })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, userId: string, name: string): Promise<Category> {
    const { data, error } = await this.supabase
      .from('categories')
      .update({ name: name.trim() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Category not found or unauthorized');
    return data;
  }

  async delete(id: string, userId: string): Promise<void> {
    // Check if category is in use
    const inUse = await this.checkInUse(id, userId);
    if (inUse) {
      throw new Error('Cannot delete category that has associated transactions');
    }

    const { error } = await this.supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async getById(id: string, userId: string): Promise<Category | null> {
    const { data, error } = await this.supabase
      .from('categories')
      .select()
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  }

  async list(userId: string): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from('categories')
      .select()
      .eq('user_id', userId)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async checkInUse(id: string, userId: string): Promise<boolean> {
    const { count, error } = await this.supabase
      .from('transactions')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return (count || 0) > 0;
  }
}
