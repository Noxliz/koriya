import { z } from 'zod';

export const createAccountSchema = z.object({
  name: z.string().min(2, 'Le nom du compte est requis'),
  type: z.enum(['cash', 'bank', 'mobile', 'other'], {
    errorMap: () => ({ message: 'Type invalide' }),
  }),
  currency: z.enum(['XOF', 'EUR'], {
    errorMap: () => ({ message: 'Devise invalide' }),
  }),
  initialBalance: z.number().positive('Le solde initial doit être positif'),
});

export const updateAccountSchema = createAccountSchema.partial();
