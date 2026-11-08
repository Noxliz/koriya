import { Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { TransactionService } from './transactions.service.js';

export class TransactionController {
  static async create(req: any, res: Response) {
    try {
      const { type, accountId, categoryId, amount, currency, description, date } =
        req.body;

      if (!type || !['income', 'expense', 'transfer'].includes(type)) {
        return res
          .status(400)
          .json({ success: false, error: { message: 'Type invalide' } });
      }

      if (!accountId) {
        return res
          .status(400)
          .json({ success: false, error: { message: 'Compte requis' } });
      }

      const transaction = await TransactionService.create({
        type,
        accountId,
        categoryId,
        amount: parseFloat(amount),
        currency: req.body.currency,
        description: req.body.description,
        date: req.body.date,
        transferToAccountId: req.body.transferToAccountId,
        userId: req.user!.id,
      });

      return res.status(201).json({
        success: true,
        data: transaction,
      });
    } catch (error: any) {
      console.error('Erreur création transaction:', error);
      return res
        .status(500)
        .json({ success: false, error: { message: 'Erreur serveur' } });
    }
  }

  static async list(req: any, res: Response) {
    try {
      const transactions = await TransactionService.findByUser(req.user!.id, {
        type: req.query.type as 'income' | 'expense' | 'transfer' | undefined,
        categoryId: req.query.categoryId,
        startDate: req.query.startDate
          ? new Date(req.query.startDate)
          : undefined,
        endDate: req.query.endDate
          ? new Date(req.query.endDate)
          : undefined,
      });
      return res.json({
        success: true,
        data: transactions,
      });
    } catch (error: any) {
      console.error('Erreur liste transactions:', error);
      return res
        .status(500)
        .json({ success: false, error: { message: 'Erreur serveur' } });
    }
  }

  static async remove(req: any, res: Response) {
    try {
      const { id } = req.params;
      const transaction = await prisma.transaction.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!transaction || transaction.userId !== req.user!.id) {
        return res
          .status(404)
          .json({ success: false, error: { message: 'Transaction introuvable' } });
      }

      await prisma.transaction.delete({
        where: { id: req.params.id },
      });

      return res.json({
        success: true,
        message: 'Transaction supprimée',
      });
    } catch (error: any) {
      console.error('Erreur suppression transaction:', error);
      return res
        .status(500)
        .json({ success: false, error: { message: 'Erreur serveur' } });
    }
  }
}
