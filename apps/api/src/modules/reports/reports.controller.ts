import { Request, Response } from 'express';
import { ReportsService } from './reports.service.js';

export class ReportsController {
  static async getMonthlyEvolution(req: any, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const result = await ReportsService.monthlyEvolution(
        req.user!.id,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined
      );
      return res.json(result);
    } catch (error: any) {
      console.error('Erreur rapport mensuel:', error);
      return res
        .status(500)
        .json({ success: false, error: { message: 'Erreur serveur' } });
    }
  }

  static async getExpenseByCategory(req: any, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const result = await ReportsService.expenseByCategory(
        req.user!.id,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined
      );
      return res.json(result);
    } catch (error: any) {
      console.error('Erreur répartition catégories:', error);
      return res
        .status(500)
        .json({ success: false, error: { message: 'Erreur serveur' } });
    }
  }

  static async getComparePeriods(req: any, res: Response) {
    try {
      const { period1Start, period1End, period2Start, period2End } = req.query;
      const result = await ReportsService.comparePeriods(
        req.user!.id,
        {
          startDate: new Date(period1Start),
          endDate: new Date(period1End),
        },
        {
          startDate: new Date(period2Start),
          endDate: new Date(period2End),
        }
      );
      return res.json(result);
    } catch (error: any) {
      console.error('Erreur comparaison:', error);
      return res
        .status(500)
        .json({ success: false, error: { message: 'Erreur serveur' } });
    }
  }

  static async getBudgetSummary(req: any, res: Response) {
    try {
      const { year, month } = req.query;
      const result = await ReportsService.budgetSummary(
        req.user!.id,
        year ? parseInt(year) : undefined,
        month ? parseInt(month) : undefined
      );
      return res.json(result);
    } catch (error: any) {
      console.error('Erreur synthèse budgets:', error);
      return res
        .status(500)
        .json({ success: false, error: { message: 'Erreur serveur' } });
    }
  }

  static async getSavingsProgress(req: any, res: Response) {
    try {
      const { year } = req.query;
      const result = await ReportsService.savingsProgress(
        req.user!.id,
        year ? parseInt(year) : undefined
      );
      return res.json(result);
    } catch (error: any) {
      console.error('Erreur progression épargne:', error);
      return res
        .status(500)
        .json({ success: false, error: { message: 'Erreur serveur' } });
    }
  }

  static async getDashboard(req: any, res: Response) {
    try {
      const { period } = req.query;
      const result = await ReportsService.dashboardSummary(
        req.user!.id,
        period || 'month'
      );
      return res.json(result);
    } catch (error: any) {
      console.error('Erreur tableau de bord:', error);
      return res
        .status(500)
        .json({ success: false, error: { message: 'Erreur serveur' } });
    }
  }
}
