import { z } from 'zod';

export const dashboardSchema = z.object({
  period: z.enum(['week', 'month', 'year']).optional(),
});

export const monthlyEvolutionSchema = z.object({
  startDate: z.optional(z.string()),
  endDate: z.optional(z.string()),
});

export const expenseByCategorySchema = z.object({
  startDate: z.optional(z.string()),
  endDate: z.optional(z.string()),
});

export const comparePeriodsSchema = z.object({
  period1Start: z.string(),
  period1End: z.string(),
  period2Start: z.string(),
  period2End: z.string(),
});

export const budgetSummarySchema = z.object({
  year: z.string().optional(),
  month: z.string().optional(),
});

export const savingsProgressSchema = z.object({
  year: z.string().optional(),
});
