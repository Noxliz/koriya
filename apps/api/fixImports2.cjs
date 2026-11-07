// fixImports.cjs - replace broken import statements with correct ones
const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname); // apps/api

const filesMap = {
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
    "import { prisma } from '../db/prisma.js';",
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

for (const [relPath, correctImports] of Object.entries(filesMap)) {
  const fullPath = path.join(baseDir, relPath);
  const lines = fs.readFileSync(fullPath, 'utf8').split('\n');
  const newLines = [];
  let importIdx = 0;
  for (const line of lines) {
    // If line is an import statement with 'undefined', replace with the next correct import
    if (/^import\s+.*$/.test(line) && line.includes('undefined') && importIdx < correctImports.length) {
      newLines.push(correctImports[importIdx]);
      importIdx++;
    } else {
      newLines.push(line);
    }
  }
  if (importIdx < correctImports.length) {
    console.error(`Warning: Not all imports replaced for ${relPath}`);
  }
  fs.writeFileSync(fullPath, newLines.join('\n'), 'utf8');
  console.log(`Fixed imports in ${relPath}`);
}
