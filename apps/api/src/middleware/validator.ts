import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Pour les requêtes GET, req.body est {} : utiliser req.query par défaut
      const isPost = req.body && Object.keys(req.body).length > 0;
      const data = isPost ? req.body : req.query;
      console.log('DEBUG req.query type:', typeof data, 'keys:', data ? Object.keys(data).join(',') : 'empty');
      const parsed = schema.parse(data);
      if (isPost) {
        req.body = parsed;
      } else {
        // For GET, we cannot assign to req.query (getter only). Override the getter for this request.
        Object.defineProperty(req, 'query', {
          value: parsed,
          writable: false,
          enumerable: true,
          configurable: true,
        });
      }
      next();
    } catch (error) {
      console.error('Validation error:', error, error?.stack);
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation échouée',
          details: error.issues?.map((e: any) => e.message) || ['Données invalides'],
        },
      });
    }
  };
}
