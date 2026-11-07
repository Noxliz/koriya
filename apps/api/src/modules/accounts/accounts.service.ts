import { prisma } from '../../db/prisma.js';
import { Decimal } from '@prisma/client/runtime/library';

export class AccountService {
  // Créer un compte
  static async create(userId: string, data: {
    name: string;
    type: string;
    currency: string;
    initialBalance: number;
  }) {
    const initialBalance = new Decimal(data.initialBalance);

    const account = await prisma.account.create({
      data: {
        userId,
        name: data.name,
        type: data.type,
        currency: data.currency,
        initialBalance,
      },
    });

    return account;
  }

  // Lister tous les comptes de l'utilisateur
  static async findByUser(userId: string) {
    return prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Récupérer un compte par ID (avec vérification du propriétaire)
  static async findById(accountId: string, userId: string) {
    return prisma.account.findUnique({
      where: { id: accountId, userId },
    });
  }

  // Modifier un compte
  static async update(accountId: string, userId: string, data: {
    name?: string;
    type?: string;
    currency?: string;
    initialBalance?: number;
  }) {
    return prisma.account.update({
      where: {
        id: accountId,
        userId,
      },
      data: {
        name: data.name,
        type: data.type,
        currency: data.currency,
        initialBalance: data.initialBalance
          ? new Decimal(data.initialBalance)
          : undefined,
      },
    });
  }
}
