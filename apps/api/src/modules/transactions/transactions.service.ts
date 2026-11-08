import { prisma } from '../../db/prisma.js';
import { Decimal } from '@prisma/client/runtime/library';

export class TransactionService {
  static async create(data: {
    type: 'income' | 'expense' | 'transfer';
    accountId: string;
    userId: string;
    categoryId?: string;
    amount: number;
    currency: string;
    description?: string;
    date?: Date;
    transferToAccountId?: string;
  }) {
    const amount = new Decimal(data.amount);
    const userId = data.userId;

    const transaction = await prisma.$transaction(async (tx) => {
      // Vérifier le compte
      const account = await tx.account.findUnique({
        where: { id: data.accountId, userId: userId },
      });
      if (!account) {
        throw new Error('Compte non trouvé ou non rattaché à cet utilisateur');
      }

      // Règle 1 & 2 : revenu augmente, dépense diminue le solde
      let newBalance: Decimal;
      if (data.type === 'income') {
        newBalance = new Decimal(account.initialBalance).plus(amount);
      } else if (data.type === 'expense') {
        newBalance = new Decimal(account.initialBalance).minus(amount);
      } else {
        // transfert : source -montant, destination +montant
        newBalance = new Decimal(account.initialBalance).minus(amount);
      }

      // Vérifier la devise
      if (account.currency !== data.currency) {
        throw new Error('La devise du compte ne correspond pas au montant');
      }

      // Pour les transferts, vérifier le compte destination
      let destAccount: any = null;
      if (data.type === 'transfer') {
        destAccount = await tx.account.findUnique({
          where: { id: data.transferToAccountId },
        });
        if (!destAccount) {
          throw new Error('Compte destination introuvable');
        }
        if (destAccount.currency !== account.currency) {
          throw new Error('Transferts entre devises différentes non autorisés');
        }
      }

      // Créer la transaction
      const transaction = await tx.transaction.create({
        data: {
          type: data.type,
          accountId: data.accountId,
          categoryId: data.categoryId,
          amount: amount,
          description: data.description,
          date: data.date || new Date(),
          userId: userId,
        },
      });

      // Mettre à jour le solde du compte (source)
      await tx.account.update({
        where: { id: data.accountId },
        data: {
          initialBalance: newBalance,
          updatedAt: new Date(),
        },
      });

      // Pour les transferts, mettre aussi à jour le compte destination
      if (data.type === 'transfer' && data.transferToAccountId) {
        await tx.account.update({
          where: { id: data.transferToAccountId },
          data: {
            initialBalance: new Decimal(destAccount.initialBalance || 0).plus(amount),
            updatedAt: new Date(),
          },
        });
      }

      return transaction;
    });

    return transaction;
  }

  // Lister les transactions d'un utilisateur avec filtres
  static async findByUser(
    userId: string,
    filters?: {
      type?: 'income' | 'expense' | 'transfer';
      categoryId?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    return prisma.transaction.findMany({
      where: {
        userId,
        type: filters?.type,
        categoryId: filters?.categoryId,
        date: {
          gte: filters?.startDate,
          lte: filters?.endDate,
        },
      },
      orderBy: { date: 'desc' },
      include: {
        category: {
          select: { id: true, name: true, type: true, color: true },
        },
      },
    });
  }
}
