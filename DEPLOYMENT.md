# Guide de Déploiement - ClipMarket

Ce guide vous explique comment déployer ClipMarket sur GitHub et Vercel.

## 📋 Prérequis

1. Compte GitHub
2. Compte Vercel (gratuit)
3. Base de données PostgreSQL (Vercel Postgres, Supabase, ou Neon)
4. Compte Stripe (pour les paiements)
5. Compte Uploadthing (optionnel, pour les uploads vidéo)

## 🚀 Étapes de Déploiement

### 1. Préparer le projet localement

```bash
# Assurez-vous que tout fonctionne localement
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run build
```

### 2. Push sur GitHub

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit: ClipMarket SaaS platform"

# Créer un repository sur GitHub, puis:
git remote add origin https://github.com/VOTRE-USERNAME/clipmarket.git
git branch -M main
git push -u origin main
```

### 3. Configurer Vercel

#### Option A: Via l'interface Vercel (Recommandé)

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Add New Project"
3. Importez votre repository GitHub
4. Configurez les variables d'environnement (voir ci-dessous)
5. Déployez !

#### Option B: Via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Pour la production
vercel --prod
```

### 4. Variables d'Environnement sur Vercel

Dans les paramètres du projet Vercel → Environment Variables, ajoutez :

#### Obligatoires

```
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
NEXTAUTH_URL=https://votre-projet.vercel.app
NEXTAUTH_SECRET=votre-secret-generer-avec-openssl-rand-base64-32
```

#### Optionnelles (selon vos besoins)

```
# Google OAuth
GOOGLE_CLIENT_ID=votre-google-client-id
GOOGLE_CLIENT_SECRET=votre-google-client-secret

# Email (pour magic links)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=votre-email@example.com
EMAIL_SERVER_PASSWORD=votre-mot-de-passe
EMAIL_FROM=noreply@clipmarket.com

# Stripe
STRIPE_SECRET_KEY=sk_live_votre-cle-secrete
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_votre-cle-publique

# Uploadthing
UPLOADTHING_SECRET=votre-uploadthing-secret
UPLOADTHING_APP_ID=votre-uploadthing-app-id
```

### 5. Configurer la Base de Données

#### Option A: Vercel Postgres (Recommandé)

1. Dans votre projet Vercel, allez dans "Storage"
2. Créez une base de données Postgres
3. Copiez la `DATABASE_URL` dans les variables d'environnement
4. Exécutez les migrations :

```bash
# Via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
```

#### Option B: Supabase (Gratuit)

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Copiez la connection string depuis Settings → Database
4. Ajoutez-la comme `DATABASE_URL` sur Vercel

#### Option C: Neon (Gratuit)

1. Créez un compte sur [neon.tech](https://neon.tech)
2. Créez un projet
3. Copiez la connection string
4. Ajoutez-la comme `DATABASE_URL` sur Vercel

### 6. Exécuter les Migrations Prisma

Après avoir configuré la base de données, exécutez les migrations :

```bash
# Via Vercel CLI (recommandé)
vercel env pull .env.local
npx prisma migrate deploy

# Ou via un script dans Vercel (voir package.json)
```

### 7. Scripts de Build sur Vercel

Vercel détectera automatiquement Next.js, mais vous pouvez ajouter un script postinstall dans `package.json` :

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

## 🔧 Configuration Post-Déploiement

### 1. Créer un utilisateur Admin

Vous pouvez créer un utilisateur admin directement dans la base de données :

```sql
-- Via Prisma Studio ou votre client SQL
UPDATE "users" SET role = 'ADMIN' WHERE email = 'votre-email@example.com';
```

### 2. Configurer Stripe

1. Créez un compte Stripe
2. Obtenez vos clés API (mode test ou production)
3. Ajoutez-les dans Vercel Environment Variables
4. Configurez les webhooks si nécessaire

### 3. Configurer Uploadthing (Optionnel)

1. Créez un compte sur [uploadthing.com](https://uploadthing.com)
2. Créez une nouvelle app
3. Copiez les clés dans Vercel Environment Variables

## 📝 Checklist de Déploiement

- [ ] Code pushé sur GitHub
- [ ] Projet créé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] Base de données PostgreSQL créée
- [ ] Migrations Prisma exécutées
- [ ] Build réussi sur Vercel
- [ ] Site accessible en production
- [ ] Test de connexion fonctionnel
- [ ] Test de création de campagne (Brand)
- [ ] Test de soumission (Creator)

## 🐛 Dépannage

### Erreur de build Prisma

Ajoutez dans `package.json` :
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Erreur de connexion à la base de données

Vérifiez que :
- La `DATABASE_URL` est correcte
- La base de données accepte les connexions externes
- Les migrations ont été exécutées

### Erreur NextAuth

Vérifiez que :
- `NEXTAUTH_URL` correspond à votre domaine Vercel
- `NEXTAUTH_SECRET` est défini et unique

## 🔗 Liens Utiles

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation NextAuth](https://next-auth.js.org)
- [Documentation Stripe](https://stripe.com/docs)

## 📞 Support

En cas de problème, vérifiez les logs Vercel dans la section "Deployments" de votre projet.
