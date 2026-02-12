# 🤖 Déploiement Automatique

Ce guide explique comment configurer le déploiement automatique sur GitHub et Vercel.

## 📋 Ce dont vous avez besoin

### Pour GitHub
1. Un repository GitHub créé (vide ou existant)
2. Un token d'accès GitHub (optionnel, pour CI/CD)

### Pour Vercel
1. Un compte Vercel
2. Vercel CLI installé (`npm i -g vercel`)
3. Les identifiants Vercel (pour CI/CD)

## 🚀 Méthode 1: Scripts Automatiques (Recommandé)

### Sur Windows (PowerShell)

```powershell
# 1. Configurer GitHub
.\scripts\setup-github.sh https://github.com/VOTRE-USERNAME/clipmarket.git

# 2. Déployer tout
.\scripts\deploy.ps1 both
```

### Sur Mac/Linux (Bash)

```bash
# Rendre les scripts exécutables
chmod +x scripts/*.sh

# 1. Configurer GitHub
./scripts/setup-github.sh https://github.com/VOTRE-USERNAME/clipmarket.git

# 2. Déployer tout
./scripts/deploy.sh both
```

## 🔄 Méthode 2: CI/CD avec GitHub Actions (Fully Automated)

### Étape 1: Obtenir les identifiants Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Lier le projet (créera .vercel/project.json)
vercel link

# Récupérer le token Vercel
# Allez sur: https://vercel.com/account/tokens
# Créez un nouveau token et copiez-le
```

### Étape 2: Configurer GitHub Secrets

Dans votre repository GitHub :
1. Allez dans **Settings** → **Secrets and variables** → **Actions**
2. Ajoutez ces secrets :

```
VERCEL_TOKEN=votre-token-vercel
VERCEL_ORG_ID=votre-org-id (trouvé dans .vercel/project.json)
VERCEL_PROJECT_ID=votre-project-id (trouvé dans .vercel/project.json)
DATABASE_URL=votre-database-url
NEXTAUTH_URL=https://votre-projet.vercel.app
NEXTAUTH_SECRET=votre-secret
```

### Étape 3: Activer GitHub Actions

Le fichier `.github/workflows/deploy.yml` est déjà créé. Il se déclenchera automatiquement à chaque push sur `main`.

## 📝 Ce que les scripts font automatiquement

### Script `deploy.sh` / `deploy.ps1`

1. ✅ Vérifie si Git est initialisé
2. ✅ Configure le remote GitHub si nécessaire
3. ✅ Ajoute tous les fichiers
4. ✅ Crée un commit
5. ✅ Push sur GitHub
6. ✅ Déploie sur Vercel (si demandé)
7. ✅ Exécute les migrations Prisma

### GitHub Actions Workflow

1. ✅ Checkout le code
2. ✅ Installe les dépendances
3. ✅ Génère Prisma Client
4. ✅ Exécute les migrations
5. ✅ Build le projet
6. ✅ Déploie sur Vercel automatiquement

## 🎯 Workflow Recommandé

### Première fois

```bash
# 1. Configurer GitHub
./scripts/setup-github.sh https://github.com/VOTRE-USERNAME/clipmarket.git

# 2. Configurer Vercel
./scripts/setup-vercel.sh

# 3. Ajouter les secrets GitHub (manuellement via l'interface)
```

### Déploiements suivants

**Option A: Manuel avec script**
```bash
./scripts/deploy.sh both
```

**Option B: Automatique avec Git push**
```bash
git add .
git commit -m "Votre message"
git push
# GitHub Actions déploiera automatiquement sur Vercel
```

## 🔐 Sécurité

⚠️ **Important**: Ne commitez JAMAIS :
- Vos fichiers `.env`
- Vos tokens/secrets
- Vos clés API

Tout est déjà configuré dans `.gitignore` pour vous protéger.

## 🐛 Dépannage

### Erreur: "Git remote not found"
```bash
git remote add origin https://github.com/VOTRE-USERNAME/clipmarket.git
```

### Erreur: "Vercel not logged in"
```bash
vercel login
```

### Erreur: "Prisma generate failed"
Vérifiez que `DATABASE_URL` est définie dans vos variables d'environnement.

## 📞 Support

Si les scripts ne fonctionnent pas, vous pouvez toujours :
1. Push manuel sur GitHub
2. Déploiement manuel via l'interface Vercel
3. Voir `DEPLOYMENT.md` pour les instructions détaillées
