import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const transactionSchema = z.object({
  category_id: z.string().uuid('Invalid category'),
  amount: z.number().positive('Amount must be greater than 0'),
  date: z.string().refine((date) => {
    const d = new Date(date);
    return d <= new Date() && !isNaN(d.getTime());
  }, 'Date cannot be in the future'),
  type: z.enum(['income', 'expense']),
  description: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name too long'),
});

export const filterSchema = z.object({
  categoryId: z.string().uuid().optional(),
  type: z.enum(['income', 'expense']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  searchQuery: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type FilterInput = z.infer<typeof filterSchema>;
