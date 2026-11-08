export function errorHandler(err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) {
  console.error('❌ Erreur:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur serveur interne';

  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}
