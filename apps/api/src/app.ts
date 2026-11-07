import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler.js';
import { initAuth } from './modules/auth/index.js';
import { initAccounts } from './modules/accounts/index.js';
import { initTransactions } from './modules/transactions/index.js';
import { initReports } from './modules/reports/index.js';

const app = express();

// Middleware globaux
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Initialisation des modules
initAuth(app);
initAccounts(app);
initTransactions(app);
initReports(app);

// Gestion centralisée des erreurs
app.use(errorHandler);

export default app;
