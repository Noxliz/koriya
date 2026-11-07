# Koriya

> Application de gestion de budget personnelle pour le monde francophone (Afrique et ailleurs).

Koriya permet de suivre vos revenus, dépenses, épargne et objectifs d'épargne.  
L'interface est disponible en français et s'adapte à un thème clair ou sombre.

## Fonctionnalités

- **Comptes** : créer et gérer des comptes (espèces, comptes bancaires, monnaies).
- **Transactions** : enregistrer des revenus, dépenses et virements entre comptes.
- **Rapports** : synthèse mensuelle, dépenses par catégorie, budget par période.
- **Objectif d'épargne** : définir un objectif et y verser des contributions.
- **Authentification** : sessions sécurisées (cookies HTTP‑only, Argon2, choix de locale française).
- **Thèmes** : clair et sombre, preference persistante.

## Stack technique

- **Backend** : Node.js + Express + TypeScript
- **Base de données** : PostgreSQL (via Prisma ORM)
- **Frontend** : React + TypeScript + Vite
- **Authentification** : cookies sécurisés (`HttpOnly`, `Secure`, `SameSite=Strict`)
- **Mots de passe** : Argon2id
- **Langue** : français (`fr-FR`) pour le MVP

## Installation

### Prérequis

- Node.js >= 18
- PostgreSQL >= 14
- npm (ou yarn, pnpm)

### Configuration

1. Cloner le dépôt :

   ```bash
   git clone https://github.com/votre-username/koriya.git
   cd koriya
   ```

2. Copier le fichier `.env.example` en `.env` et modifier les valeurs :

   ```bash
   cp .env.example .env
   ```

3. Installer les dépendances (depuis la racine) :

   ```bash
   npm install
   ```

4. Générer le client Prisma :

   ```bash
   npx prisma generate
   ```

5. Appliquer les migrations :

   ```bash
   npx prisma migrate dev
   ```

6. Lancer le serveur API :

   ```bash
   cd apps/api
   npm run dev
   ```

7. Lancer le front‑end :

   ```bash
   cd apps/web
   npm run dev
   ```

## Scripts utiles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre les deux parties (API + front) en mode développement |
| `npm run build` | Compile le front‑end (produit `dist/`) |
| `npm run start:api` | Lance le serveur API en production |
| `npx prisma migrate dev` | Crée et applique les migrations |
| `npx prisma generate` | Génère le client Prisma |

## Structure du projet

```
koriya/
├── apps/
│   ├── api/          # Backend Express + TypeScript
│   └── web/          # Frontend React + Vite
├── packages/
│   └── shared/       # Types et schémas partagés
├── prisma/
│   └── schema.prisma
├── .env.example
├── .gitignore
└── package.json
```

## Déploiement

- **Backend** : Render, Railway, Heroku, AWS, etc. (variable `DATABASE_URL`, `PORT`, `CORS_ORIGIN`).
- **Frontend** : Vercel, Netlify, GitHub Pages (variable d’environnement `VITE_API_URL` ou proxy inverse).

## Licence

Projet personnel – libre d’utilisation.
