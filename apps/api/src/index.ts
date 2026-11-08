import app from './app';
import { prisma } from './db/prisma.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie');

    const server = app.listen(PORT, () => {
      console.log(`🚀 API Koriya démarrée sur le port ${PORT}`);
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Le port ${PORT} est déjà utilisé`);
      } else {
        console.error('❌ Erreur du serveur:', err);
      }
      process.exit(1);
    });

    // Nettoyage à l'arrêt
    process.on('SIGTERM', () => {
      console.log('🛑 Arrêt du serveur...');
      server.close(() => {
        prisma.$disconnect();
        console.log('🔌 Connexion DB fermée');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Échec de la connexion à la base de données:', error);
    process.exit(1);
  }
}

main();
