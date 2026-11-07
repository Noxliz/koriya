import { prisma } from '../../db/prisma.js';
import { Decimal } from '@prisma/client/runtime/library';

export class ReportsService {
  // Rapport mensuel: évolution des revenus et dépenses par mois
  static async monthlyEvolution(userId: string, startDate?: Date, endDate?: Date) {
    const txns = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        type: {
          in: ['income', 'expense'],
        },
      },
      orderBy: { date: 'asc' },
      include: {
        category: {
          select: { id: true, name: true, type: true, color: true },
        },
      },
    });

    // Group by month
    const monthlyData: Record<string, { income: number; expense: number; transactions: any[] }> = {};

    for (const txn of txns) {
      const date = new Date(txn.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0, transactions: [] };
      }

      const amount = parseFloat(txn.amount);
      if (txn.type === 'income') {
        monthlyData[monthKey].income += amount;
      } else {
        monthlyData[monthKey].expense += amount;
      }

      monthlyData[monthKey].transactions.push(txn);
    }

    return {
      success: true,
      data: Object.entries(monthlyData).map(([month, values]) => ({
        month,
        income: values.income.toString(),
        expense: values.expense.toString(),
        transactions: values.transactions,
      })),
    };
  }

  // Répartition des dépenses par catégorie
  static async expenseByCategory(userId: string, startDate?: Date, endDate?: Date) {
    const txns = await prisma.transaction.findMany({
      where: {
        userId,
        type: 'expense',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: {
          select: { id: true, name: true, type: true, color: true },
        },
      },
    });

    const categoryTotals: Record<string, { categoryId: string; categoryName: string; categoryType: string; color: string | null; amount: number }> = {};

    for (const txn of txns) {
      const cat = txn.category;
      if (!cat) continue;
      const amt = parseFloat(txn.amount);
      if (!categoryTotals[cat.id]) categoryTotals[cat.id] = { categoryId: cat.id, categoryName: cat.name, categoryType: cat.type, color: cat.color, amount: 0 };
      categoryTotals[cat.id].amount += amt;
    }

    return {
      success: true,
      data: Object.values(categoryTotals),
    };
  }

  // Comparaison de deux périodes
  static async comparePeriods(
    userId: string,
    period1: { startDate: Date; endDate: Date },
    period2: { startDate: Date; endDate: Date }
  ) {
    const calcPeriod = (start: Date, end: Date) => {
      return prisma.transaction.findMany({
        where: {
          userId,
          date: { gte: start, lte: end },
          type: { in: ['income', 'expense'] },
        },
        select: { type: true, amount: true },
      });
    };

    const t1 = await calcPeriod(period1.startDate, period1.endDate);
    const t2 = await calcPeriod(period2.startDate, period2.endDate);

    const sumByType = (txns: any[]) => {
      const result = { income: 0, expense: 0 };
      for (const txn of txns) {
        const amt = parseFloat(txn.amount);
        if (txn.type === 'income') result.income += amt;
        else result.expense += amt;
      }
      return result;
    };

    const s1 = await sumByType(t1);
    const s2 = await sumByType(t2);

    return {
      success: true,
      data: {
        period1: { income: s1.income.toString(), expense: s1.expense.toString() },
        period2: { income: s2.income.toString(), expense: s2.expense.toString() },
      },
    };
  }

  // Synthèse des budgets
  static async budgetSummary(userId: string, year?: number, month?: number) {
    const now = new Date();
    const targetYear = year || now.getFullYear();
    const targetMonth = month || now.getMonth() + 1;

    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        period: 'monthly',
      },
      include: {
        category: {
          select: { id: true, name: true, type: true },
        },
      },
    });

    const budgetData = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await prisma.transaction.findMany({
          where: {
            userId,
            type: 'expense',
            categoryId: budget.categoryId,
            date: {
              gte: new Date(targetYear, targetMonth - 1, 1),
              lte: new Date(targetYear, targetMonth, 0),
            },
          },
        });

        const spentAmount = spent.reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const percentage = budget.amount ? (spentAmount / parseFloat(budget.amount)) * 100 : 0;

        return {
          id: budget.id,
          categoryName: budget.category?.name || 'Sans catégorie',
          categoryType: budget.category?.type || 'expense',
          budgetAmount: budget.amount,
          spent: spentAmount,
          remaining: parseFloat(budget.amount) - spentAmount,
          percentage: Math.min(percentage, 100),
          isOver: percentage >= 100,
        };
      })
    );

    return {
      success: true,
      data: budgetData,
    };
  }

  // Progression de l'épargne
  static async savingsProgress(userId: string, year?: number) {
    const now = new Date();
    const targetYear = year || now.getFullYear();

    const goals = await prisma.savingsGoal.findMany({
      where: {
        userId,
        targetDate: {
          gte: new Date(targetYear, 0, 1),
        },
      },
      include: {
        contributions: {
          orderBy: { date: 'desc' },
        },
      },
    });

    const progress = await Promise.all(
      goals.map(async (goal) => {
        const totalContributions = goal.contributions.reduce((sum, c) => sum + parseFloat(c.amount), 0);
        const percentage = goal.targetAmount ? (totalContributions / parseFloat(goal.targetAmount)) * 100 : 0;

        return {
          id: goal.id,
          name: goal.name,
          targetAmount: goal.targetAmount,
          currentAmount: totalContributions,
          currency: goal.currency,
          targetDate: goal.targetDate,
          percentage: Math.min(percentage, 100),
          contributions: goal.contributions,
        };
      })
    );

    return {
      success: true,
      data: progress,
    };
  }

  // Résumé du tableau de bord
  static async dashboardSummary(userId: string, period: 'week' | 'month' | 'year') {
    const now = new Date();
    const startDates: Record<typeof period, Date> = {
      week: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
      month: new Date(now.getFullYear(), now.getMonth(), 1),
      year: new Date(now.getFullYear(), 0, 1),
    };

    const startDate = startDates[period];

    const [accounts, transactions, goals] = await Promise.all([
      prisma.account.findMany({
        where: { userId },
        select: { id: true, name: true, currency: true, initialBalance: true },
      }),
      prisma.transaction.findMany({
        where: {
          userId,
          date: { gte: startDate },
          type: { in: ['income', 'expense'] },
        },
        select: { type: true, amount: true },
      }),
      prisma.savingsGoal.findMany({
        where: { userId },
        select: { currentAmount: true, targetAmount: true },
      }),
    ]);

    const incomeSum = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const expenseSum = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return {
      success: true,
      data: {
        accounts,
        totalIncome: incomeSum,
        totalExpense: expenseSum,
        netSavings: incomeSum - expenseSum,
        savingsGoals: goals,
      },
    };
  }
}
