import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../modules/auth/auth.service.js';

// Express middleware: synchronise la lecture du token et appelle next() ou renvoie une réponse
export async function authMiddleware(req: any, res: Response, next: NextFunction) {
  // Skip authentication for auth routes
  if (req.path.startsWith('/api/auth')) {
    return next();
  }

  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.sessionToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'Non authentifié. Veuillez vous connecter.' },
    });
  }

  try {
    const user = await AuthService.validateSession(token);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Session invalide ou expirée.' },
      });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
