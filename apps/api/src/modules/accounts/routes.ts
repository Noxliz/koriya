import { Router } from 'express';
import { AccountController } from './accounts.controller.js';
import { createAccountSchema, updateAccountSchema } from './accounts.validation.js';
import { validate } from '../../middleware/validator.js';

const router = Router();

router.post('/', validate(createAccountSchema), AccountController.create);
router.get('/', AccountController.list);
router.get('/:id', AccountController.get);
router.patch('/:id', validate(updateAccountSchema), AccountController.update);
router.delete('/:id', AccountController.remove);

export default router;
