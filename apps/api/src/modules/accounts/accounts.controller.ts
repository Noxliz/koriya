import { Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { AccountService } from './accounts.service.js';

export class AccountController {
  // Créer un compte
  static async create(req: Request, res: Response) {
    try {
      const { name, type, currency, initialBalance } = req.body;
      const userId = req.user?.id;

      const account = await AccountService.create(userId, {
        name,
        type,
        currency,
        initialBalance,
      });

      return res.status(201).json({
        success: true,
        data: account,
      });
    } catch (error) {
      console.error('Erreur création compte:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Erreur serveur lors de la création du compte' },
      });
    }
  }

  // Lister tous les comptes de l'utilisateur
  static async list(req: Request, res: Response) {
    try {
      const accounts = await AccountService.findByUser(req.user?.id);
      return res.json({
        success: true,
        data: accounts,
      });
    } catch (error) {
      console.error('Erreur liste comptes:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Erreur serveur lors de la liste des comptes' },
      });
    }
  }

  // Récupérer un compte par ID
  static async get(req: Request, res: Response) {
    try {
      const account = await AccountService.findById(
        req.params.id,
        req.user?.id
      );

      if (!account) {
        return res.status(404).json({
          success: false,
          error: { message: 'Compte non trouvé' },
        });
      }

      return res.json({
        success: true,
        data: account,
      });
    } catch (error) {
      console.error('Erreur récupération compte:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Erreur serveur' },
      });
    }
  }

  // Modifier un compte
  static async update(req: Request, res: Response) {
    try {
      const { name, type, currency, initialBalance } = req.body;
      const userId = req.user?.id;

      const account = await AccountService.findById(req.params.id, userId);
      if (!account) {
        return res.status(404).json({
          success: false,
          error: { message: 'Compte non trouvé' },
        });
      }

      const updated = await AccountService.update(
        account.id,
        userId,
        { name, type, currency, initialBalance },
      );

      return res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      console.error('Erreur modification compte:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Erreur serveur lors de la modification' },
      });
    }
  }

  // Supprimer un compte
  static async remove(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const account = await AccountService.findById(req.params.id, userId);

      if (!account) {
        return res.status(404).json({
          success: false,
          error: { message: 'Compte non trouvé' },
        });
      }

      await prisma.account.delete({
        where: { id: account.id },
      });

      return res.json({
        success: true,
        message: 'Compte supprimé',
      });
    } catch (error) {
      console.error('Erreur suppression compte:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Erreur serveur lors de la suppression' },
      });
    }
  }
}
