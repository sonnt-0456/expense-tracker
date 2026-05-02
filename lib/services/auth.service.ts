import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { User } from '@/types/database.types';

export class AuthService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async register(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser();

    if (error) throw error;
    if (!user) return null;

    return {
      id: user.id,
      email: user.email!,
      created_at: user.created_at,
    };
  }

  async getSession() {
    const {
      data: { session },
      error,
    } = await this.supabase.auth.getSession();

    if (error) throw error;
    return session;
  }

  async refreshSession() {
    const {
      data: { session },
      error,
    } = await this.supabase.auth.refreshSession();

    if (error) throw error;
    return session;
  }
}
