# 🚀 Configuration Vercel - Guide Simple

## Étape 1: Obtenir votre Token Vercel

1. Allez sur [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Cliquez sur **"Create Token"**
3. Donnez-lui un nom (ex: "ClipMarket Deployment")
4. Sélectionnez **"Full Account"** ou **"Full Access"**
5. Cliquez **"Create"**
6. **Copiez le token** (vous ne pourrez plus le voir après!)

⚠️ **Important**: Gardez ce token secret et ne le partagez jamais publiquement.

## Étape 2: Installer Vercel CLI

```bash
npm i -g vercel
```

## Étape 3: Se connecter à Vercel

```bash
vercel login
```

Cela ouvrira votre navigateur pour vous connecter.

## Étape 4: Lier votre projet

Dans le dossier de votre projet :

```bash
vercel link
```

Cela va :
- Vous demander de créer un nouveau projet ou d'en utiliser un existant
- Créer un fichier `.vercel/project.json` avec vos identifiants

## Étape 5: Récupérer vos identifiants

Après `vercel link`, ouvrez `.vercel/project.json` :

```json
{
  "projectId": "prj_xxxxxxxxxxxxx",  // ← VERCEL_PROJECT_ID
  "orgId": "team_xxxxxxxxxxxxx"      // ← VERCEL_ORG_ID
}
```

## Étape 6: Configurer les Variables d'Environnement

### Option A: Via l'interface Vercel (Recommandé)

1. Allez sur votre projet sur [vercel.com](https://vercel.com)
2. **Settings** → **Environment Variables**
3. Ajoutez ces variables :

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://votre-projet.vercel.app
NEXTAUTH_SECRET=votre-secret-generer-avec-openssl-rand-base64-32
GOOGLE_CLIENT_ID=... (optionnel)
GOOGLE_CLIENT_SECRET=... (optionnel)
STRIPE_SECRET_KEY=... (optionnel)
UPLOADTHING_SECRET=... (optionnel)
```

### Option B: Via CLI

```bash
vercel env add DATABASE_URL
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
# etc...
```

## Étape 7: Déployer

### Première fois

```bash
vercel --prod
```

### Déploiements suivants

**Option 1: Manuel**
```bash
vercel --prod
```

**Option 2: Automatique avec GitHub**
- Connectez votre repo GitHub dans Vercel
- Chaque push sur `main` déploiera automatiquement

## 🔄 Déploiement Automatique avec GitHub

### 1. Connecter GitHub à Vercel

1. Dans Vercel, allez dans **Settings** → **Git**
2. Cliquez **"Connect Git Provider"**
3. Sélectionnez **GitHub**
4. Autorisez Vercel à accéder à vos repos
5. Sélectionnez votre repository `clipmarket`

### 2. Configurer GitHub Actions (Optionnel)

Si vous voulez utiliser GitHub Actions pour plus de contrôle :

1. Dans GitHub, allez dans **Settings** → **Secrets and variables** → **Actions**
2. Ajoutez ces secrets :

```
VERCEL_TOKEN=votre-token-vercel
VERCEL_ORG_ID=votre-org-id (depuis .vercel/project.json)
VERCEL_PROJECT_ID=votre-project-id (depuis .vercel/project.json)
DATABASE_URL=votre-database-url
NEXTAUTH_URL=https://votre-projet.vercel.app
NEXTAUTH_SECRET=votre-secret
```

3. Le workflow `.github/workflows/deploy.yml` se déclenchera automatiquement

## 📝 Checklist Vercel

- [ ] Token Vercel créé et copié
- [ ] Vercel CLI installé (`npm i -g vercel`)
- [ ] Connecté à Vercel (`vercel login`)
- [ ] Projet lié (`vercel link`)
- [ ] Variables d'environnement configurées
- [ ] Base de données PostgreSQL créée
- [ ] Migrations Prisma exécutées (`npx prisma migrate deploy`)
- [ ] Premier déploiement réussi (`vercel --prod`)

## 🎯 Commandes Rapides

```bash
# Se connecter
vercel login

# Lier le projet
vercel link

# Déployer en production
vercel --prod

# Déployer en preview
vercel

# Voir les logs
vercel logs

# Récupérer les variables d'env
vercel env pull .env.local
```

## 🐛 Dépannage

### Erreur: "Token invalid"
- Vérifiez que le token est correct
- Créez un nouveau token si nécessaire

### Erreur: "Project not found"
- Exécutez `vercel link` pour lier le projet
- Ou créez un nouveau projet via `vercel`

### Erreur: "Build failed"
- Vérifiez les logs dans Vercel Dashboard
- Assurez-vous que `DATABASE_URL` est configurée
- Vérifiez que `prisma generate` s'exécute (déjà dans package.json)

## 💡 Astuce

Pour un déploiement encore plus simple, utilisez l'interface Vercel :
1. Importez directement votre repo GitHub
2. Vercel détectera automatiquement Next.js
3. Configurez les variables d'environnement
4. Cliquez "Deploy"

C'est tout! 🎉
