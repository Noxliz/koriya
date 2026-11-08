import { Router } from 'express';
import { TransactionController } from './transactions.controller.js';
import { createTransactionSchema, updateTransactionSchema } from './transactions.validation.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validator.js';

const router = Router();

router.post('/', authMiddleware, validate(createTransactionSchema), TransactionController.create);
router.get('/', authMiddleware, TransactionController.list);
router.delete('/:id', authMiddleware, TransactionController.remove);

export default router;
