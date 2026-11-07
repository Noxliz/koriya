import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

export class AuthController {
  // Inscription
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      // Validation basique
      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          error: { message: 'Email, mot de passe et nom sont requis' },
        });
      }

      const user = await AuthService.register(email, password, name);

      return res.status(201).json({
        success: true,
        data: { id: user.id, email: user.email, name: user.name },
      });
    } catch (error) {
      console.error('Erreur inscription:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Erreur serveur lors de l\'inscription' },
      });
    }
  }

  // Connexion
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: { message: 'Email et mot de passe sont requis' },
        });
      }

      const user = await AuthService.login(email, password);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: { message: 'Email ou mot de passe incorrect' },
        });
      }

      // Créer une session
      const session = await AuthService.createSession(user.id);

      // Récupérer le token depuis la session créée
      const cookieValue = session ? session.token : '';

      res.cookie('sessionToken', cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      });

      return res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          session: {
            expiresAt: session.expiresAt,
          },
        },
      });
    } catch (error) {
      console.error('Erreur connexion:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Erreur serveur lors de la connexion' },
      });
    }
  }

  // Déconnexion
  static async logout(req: Request, res: Response) {
    try {
      const token = req.cookies?.sessionToken;
      if (token) {
        await AuthService.destroySession(token);
      }

      res.clearCookie('sessionToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return res.json({
        success: true,
        message: 'Déconnexion réussie',
      });
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Erreur serveur lors de la déconnexion' },
      });
    }
  }
}
