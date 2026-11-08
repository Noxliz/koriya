const fs = require('fs');
const path = require('path');

const replacements = {
  'src/app.ts': [
    "import { errorHandler } from './middleware/errorHandler.js';",
    "import { initAuth } from './modules/auth/index.js';",
    "import { initAccounts } from './modules/accounts/index.js';",
    "import { initTransactions } from './modules/transactions/index.js';",
    "import { initReports } from './modules/reports/index.js';",
  ],
  'src/index.ts': [
    "import { prisma } from './db/prisma.js';",
  ],
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
    "import { TransactionController } from './transactions.controller.js';",
    "import { createTransactionSchema, updateTransactionSchema } from './transactions.validation.js';",
    "import { authMiddleware } from '../../middleware/authMiddleware.js';",
    "import { validate } from '../../middleware/validator.js';",
  ],
  'src/modules/transactions/transactions.service.ts': [
    "import { prisma } from '../../db/prisma.js';",
  ],
};

for (const [filePath, newLines] of Object.entries(replacements)) {
  const fullPath = path.join(__dirname, filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  let newLinesIndex = 0;
  const updatedLines = lines.map(line => {
    if (line.includes('undefined') && newLinesIndex < newLines.length) {
      const result = newLines[newLinesIndex];
      newLinesIndex++;
      return result;
    }
    return line;
  });
  fs.writeFileSync(fullPath, updatedLines.join('\n'), 'utf8');
  console.log(`Fixed ${filePath}`);
}
