INSERT INTO "Category" (id, "userId", name, type, "createdAt", "updatedAt") VALUES 
('cat_salaire', 'cmw6dxybw0000e9c4ylw9dhbl', 'Salaire', 'income', now(), now()),
('cat_alimentation', 'cmw6dxybw0000e9c4ylw9dhbl', 'Alimentation', 'expense', now(), now()),
('cat_loyers', 'cmw6dxybw0000e9c4ylw9dhbl', 'Loyers', 'expense', now(), now()),
('cat_transport', 'cmw6dxybw0000e9c4ylw9dhbl', 'Transport', 'expense', now(), now());

INSERT INTO "Account" (id, "userId", name, type, currency, "initialBalance", "archived", "createdAt", "updatedAt") VALUES 
('acc_portefeuille', 'cmw6dxybw0000e9c4ylw9dhbl', 'Portefeuille', 'cash', 'EUR', '2000.00', false, now(), now()),
('acc_epargne', 'cmw6dxybw0000e9c4ylw9dhbl', 'Épargne', 'bank', 'EUR', '500.00', false, now(), now());

INSERT INTO "Transaction" (id, "userId", "accountId", type, "categoryId", amount, "date", description, "createdAt", "updatedAt") VALUES 
('txn_salaire', 'cmw6dxybw0000e9c4ylw9dhbl', 'acc_portefeuille', 'income', 'cat_salaire', '3000.00', now(), 'Salaire mars', now(), now()),
('txn_alimentation', 'cmw6dxybw0000e9c4ylw9dhbl', 'acc_portefeuille', 'expense', 'cat_alimentation', '400.00', now(), 'Courses', now(), now()),
('txn_loyers', 'cmw6dxybw0000e9c4ylw9dhbl', 'acc_portefeuille', 'expense', 'cat_loyers', '800.00', now(), 'Loyer novembre', now(), now()),
('txn_transport', 'cmw6dxybw0000e9c4ylw9dhbl', 'acc_epargne', 'expense', 'cat_transport', '150.00', now(), 'Essence', now(), now());

INSERT INTO "Budget" (id, "userId", "categoryId", period, amount, "createdAt", "updatedAt") VALUES 
('budget_1', 'cmw6dxybw0000e9c4ylw9dhbl', 'cat_alimentation', 'monthly', '500.00', now(), now());

INSERT INTO "SavingsGoal" (id, "userId", name, "targetAmount", currency, "targetDate", "currentAmount", "createdAt", "updatedAt") VALUES 
('goal_vacances', 'cmw6dxybw0000e9c4ylw9dhbl', 'Vacances décembre', '1000.00', 'EUR', '2026-12-31', '200.00', now(), now());
