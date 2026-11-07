import { Router } from 'express';
import { AccountController } from './accounts.controller.js';
import { createAccountSchema, updateAccountSchema } from './accounts.validation.js';
import { validate } from '../../middleware/validator.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const router = Router();

// Protection : l'utilisateur doit être authentifié
router.use(authMiddleware);

router.post('/', validate(createAccountSchema), AccountController.create);
router.get('/', AccountController.list);
router.get('/:id', AccountController.get);
router.patch('/:id', validate(updateAccountSchema), AccountController.update);
router.delete('/:id', AccountController.remove);

export function initAccounts(app: import('express').Express) {
  app.use('/api/accounts', router);
}

export default router;
