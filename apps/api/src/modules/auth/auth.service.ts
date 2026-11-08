import { prisma } from '../../db/prisma.js';
import { hash, verify } from 'argon2';

export class AuthService {
  // Hachage du mot de passe
  static async hashPassword(password: string): Promise<string> {
    return hash(password, { type: 2 }); // Argon2id
  }

  // Vérification du mot de passe
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return verify(hash, password);
  }

  // Inscription
  static async register(email: string, password: string, name: string) {
    const hashedPassword = await this.hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
      },
    });

    return user;
  }

  // Connexion
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isValid = await this.verifyPassword(password, user.passwordHash);
    if (!isValid) return null;

    return user;
  }

  // Création d'une session
  static async createSession(userId: string) {
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 jours

    await prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    return { token, expiresAt };
  }

  // Vérifier une session
  static async validateSession(token: string) {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) return null;

    // Vérifier que la session n'est pas expirée
    if (new Date() > session.expiresAt) {
      await prisma.session.delete({ where: { id: session.id } });
      return null;
    }

    return session.user;
  }

  // Supprimer une session
  static async destroySession(token: string) {
    await prisma.session.delete({ where: { token } });
  }
}
