INSERT INTO "Category" (id, "userId", name, type, "createdAt", "updatedAt") VALUES 
('cat_salaire2', 'cmw6dxybw0000e9c4ylw9dhbl', 'Salaire', 'income', now(), now()),
('cat_alimentation2', 'cmw6dxybw0000e9c4ylw9dhbl', 'Alimentation', 'expense', now(), now()),
('cat_loyers2', 'cmw6dxybw0000e9c4ylw9dhbl', 'Loyers', 'expense', now(), now()),
('cat_transport2', 'cmw6dxybw0000e9c4ylw9dhbl', 'Transport', 'expense', now(), now());

INSERT INTO "Account" (id, "userId", name, type, currency, "initialBalance", "archived", "createdAt", "updatedAt") VALUES 
('acc_portefeuille2', 'cmw6dxybw0000e9c4ylw9dhbl', 'Portefeuille', 'cash', 'EUR', '2000.00', false, now(), now()),
('acc_epargne2', 'cmw6dxybw0000e9c4ylw9dhbl', 'Épargne', 'bank', 'EUR', '500.00', false, now(), now());

INSERT INTO "Transaction" (id, "userId", "accountId", type, "categoryId", amount, "date", description, "createdAt", "updatedAt") VALUES 
('txn_salaire2', 'cmw6dxybw0000e9c4ylw9dhbl', 'acc_portefeuille2', 'income', 'cat_salaire2', '3000.00', '2026-11-01 00:00:00', 'Salaire mars', now(), now()),
('txn_alimentation2', 'cmw6dxybw0000e9c4ylw9dhbl', 'acc_portefeuille2', 'expense', 'cat_alimentation2', '400.00', '2026-11-05 00:00:00', 'Courses', now(), now()),
('txn_loyers2', 'cmw6dxybw0000e9c4ylw9dhbl', 'acc_portefeuille2', 'expense', 'cat_loyers2', '800.00', '2026-11-10 00:00:00', 'Loyer novembre', now(), now()),
('txn_transport2', 'cmw6dxybw0000e9c4ylw9dhbl', 'acc_epargne2', 'expense', 'cat_transport2', '150.00', '2026-11-12 00:00:00', 'Essence', now(), now());

INSERT INTO "Budget" (id, "userId", "categoryId", period, amount, "createdAt", "updatedAt") VALUES 
('budget_2', 'cmw6dxybw0000e9c4ylw9dhbl', 'cat_alimentation2', 'monthly', '500.00', now(), now());

INSERT INTO "SavingsGoal" (id, "userId", name, "targetAmount", currency, "targetDate", "currentAmount", "createdAt", "updatedAt") VALUES 
('goal_vacances2', 'cmw6dxybw0000e9c4ylw9dhbl', 'Vacances décembre', '1000.00', 'EUR', '2026-12-31', '200.00', now(), now());
