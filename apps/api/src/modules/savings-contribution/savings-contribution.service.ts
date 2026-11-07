import { prisma } from '../../db/prisma.js';
import { Decimal } from '@prisma/client/runtime/library';

export class SavingsContributionService {
  static async createContribution(
    userId: string,
    goalId: string,
    amount: Decimal,
    note?: string,
    date?: Date
  ) {
    // Vérifier que l'objectif appartient bien à l'utilisateur
    const goal = await prisma.savingsGoal.findUnique({
      where: { id: goalId, userId },
    });
    if (!goal) {
      throw new Error('Objectif d\'épargne introuvable');
    }

    const contribution = await prisma.savingsContribution.create({
      data: {
        savingsGoalId: goalId,
        amount,
        date: date || new Date(),
        note,
      },
    });

    return contribution;
  }
}
