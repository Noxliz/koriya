import { z } from 'zod';

export const createTransactionSchema = z.object({
  type: z.enum(['income', 'expense', 'transfer']),
  accountId: z.string(),
  categoryId: z.string().optional(),
  amount: z.number().positive('Le montant doit être positif'),
  currency: z.enum(['XOF', 'EUR']),
  description: z.string().optional(),
  date: z.string().optional(),
  transferToAccountId: z.string().optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();
