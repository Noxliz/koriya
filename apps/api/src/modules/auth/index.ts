import authRouter from './routes.js';

export async function initAuth(app: import('express').Express) {
  app.use('/api/auth', authRouter);
}
