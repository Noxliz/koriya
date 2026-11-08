// fixAllImports.cjs - fixed all import statements with broken 'undefined' module specifiers
const fs = require('fs');
const path = require('path');

const base = path.resolve(__dirname);

const mapping = {
  'src/middleware/authMiddleware.ts': [
    "import { AuthService } from '../modules/auth/auth.service.js';",
  ],
  'src/middleware/test_import.ts': [
    "import { authMiddleware } from './authMiddleware.js';",
  ],
  'src/modules/accounts/accounts.controller.ts': [
    "import { prisma } from '../../db/prisma.js';",
    "import { AccountService } from './accounts.service.js';",
  ],
  'src/modules/accounts/accounts.service.ts': [
    "import { prisma } from '../../db/prisma.js';",
  ],
  'src/modules/accounts/index.ts': [
    "import { AccountController } from './accounts.controller.js';",
    "import { createAccountSchema, updateAccountSchema } from './accounts.validation.js';",
    "import { validate } from '../../middleware/validator.js';",
    "import { authMiddleware } from '../../middleware/authMiddleware.js';",
  ],
  'src/modules/accounts/routes.ts': [
    "import { AccountController } from './accounts.controller.js';",
    "import { createAccountSchema, updateAccountSchema } from './accounts.validation.js';",
    "import { validate } from '../../middleware/validator.js';",
  ],
  'src/modules/auth/auth.controller.ts': [
    "import { AuthService } from './auth.service.js';",
  ],
  'src/modules/auth/auth.routes.ts': [
    "import { registerSchema, loginSchema } from './auth.validation.js';",
    "import { validate } from '../../middleware/validator.js';",
  ],
  'src/modules/auth/auth.service.ts': [
    "import { prisma } from '../../db/prisma.js';",
  ],
  'src/modules/auth/index.ts': [
    "import authRouter from './routes.js';",
  ],
  'src/modules/auth/routes.ts': [
    "import { AuthController } from './auth.controller.js';",
    "import { registerSchema, loginSchema } from './auth.validation.js';",
    "import { validate } from '../../middleware/validator.js';",
  ],
  'src/modules/reports/index.ts': [
    "import { ReportsController } from './reports.controller.js';",
    "import { dashboardSchema, monthlyEvolutionSchema, expenseByCategorySchema, comparePeriodsSchema, budgetSummarySchema, savingsProgressSchema } from './reports.validation.js';",
    "import { authMiddleware } from '../../middleware/authMiddleware.js';",
    "import { validate } from '../../middleware/validator.js';",
  ],
  'src/modules/reports/reports.controller.ts': [
    "import { ReportsService } from './reports.service.js';",
  ],
  'src/modules/reports/reports.routes.ts': [
    "import { Router } from 'express';",
    "import { ReportsController } from './reports.controller.js';",
    "import { dashboardSchema, monthlyEvolutionSchema, expenseByCategorySchema, comparePeriodsSchema, budgetSummarySchema, savingsProgressSchema } from './reports.validation.js';",
    "import { authMiddleware } from '../../middleware/authMiddleware.js';",
    "import { validate } from '../../middleware/validator.js';",
  ],
  'src/modules/reports/reports.service.ts': [
    "import { prisma } from '../../db/prisma.js';",
  ],
  'src/modules/transactions/index.ts': [
    "import { TransactionController } from './transactions.controller.js';",
    "import { createTransactionSchema, updateTransactionSchema } from './transactions.validation.js';",
    "import { authMiddleware } from '../../middleware/authMiddleware.js';",
    "import { validate } from '../../middleware/validator.js';",
  ],
  'src/modules/transactions/transactions.controller.ts': [
    "import { prisma } from '../../db/prisma.js';",
    "import { TransactionService } from './transactions.service.js';",
  ],
  'src/modules/transactions/transactions.routes.ts': [
    "import { Router } from 'express';",
    "import { TransactionController } from './transactions.controller.js';",
    "import { createTransactionSchema, updateTransactionSchema } from './transactions.validation.js';",
    "import { authMiddleware } from '../../middleware/authMiddleware.js';",
    "import { validate } from '../../middleware/validator.js';",
  ],
  'src/modules/transactions/transactions.service.ts': [
    "import { prisma } from '../../db/prisma.js';",
  ],
};

const brokenRegex = /^import .* from ['"]undefined['"];$/;

for (const [relPath, correctImports] of Object.entries(mapping)) {
  const fullPath = path.join(base, relPath);
  const lines = fs.readFileSync(fullPath, 'utf8').split('\n');
  const out = [];
  let idx = 0;
  for (const line of lines) {
    if (brokenRegex.test(line) && idx < correctImports.length) {
      out.push(correctImports[idx]);
      idx++;
    } else {
      out.push(line);
    }
  }
  if (idx < correctImports.length) {
    console.warn(`Only replaced ${idx} of ${correctImports.length} imports in ${relPath}`);
  }
  fs.writeFileSync(fullPath, out.join('\n'), 'utf8');
  console.log(`Fixed ${relPath}`);
}
