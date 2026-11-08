import { Router } from 'express';
import { ReportsController } from './reports.controller.js';
import { dashboardSchema, monthlyEvolutionSchema, expenseByCategorySchema, comparePeriodsSchema, budgetSummarySchema, savingsProgressSchema } from './reports.validation.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validator.js';

const router = Router();

router.get('/dashboard', authMiddleware, validate(dashboardSchema), ReportsController.getDashboard);
router.get('/monthly-evolution', authMiddleware, validate(monthlyEvolutionSchema), ReportsController.getMonthlyEvolution);
router.get('/expense-by-category', authMiddleware, validate(expenseByCategorySchema), ReportsController.getExpenseByCategory);
router.get('/compare', authMiddleware, validate(comparePeriodsSchema), ReportsController.getComparePeriods);
router.get('/budget-summary', authMiddleware, validate(budgetSummarySchema), ReportsController.getBudgetSummary);
router.get('/savings-progress', authMiddleware, validate(savingsProgressSchema), ReportsController.getSavingsProgress);

export function initReports(app: import('express').Express) {
  app.use('/api/reports', router);
}
