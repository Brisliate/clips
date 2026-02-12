# 📋 Étapes après connexion Vercel ↔ GitHub

## ✅ Ce que vous avez déjà fait
- [x] Connecté Vercel à GitHub

## 🎯 Prochaines étapes

### Étape 1: Vérifier que votre code est sur GitHub

```bash
# Dans votre terminal, vérifiez que vous êtes dans le dossier du projet
cd c:\Users\hourr\Desktop\clips

# Vérifiez le statut Git
git status

# Si vous n'avez pas encore pushé sur GitHub:
git init  # (si pas déjà fait)
git add .
git commit -m "Initial commit: ClipMarket platform"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/clipmarket.git
git push -u origin main
```

### Étape 2: Sur Vercel (pas GitHub!)

1. **Allez sur [vercel.com](https://vercel.com)**
2. **Cliquez sur votre projet** (ou créez-en un nouveau)
3. **Importez votre repository GitHub** :
   - Cliquez "Add New Project"
   - Sélectionnez votre repo `clips` ou `clipmarket`
   - Cliquez "Import"

### Étape 3: Configurer les Variables d'Environnement sur Vercel

**Important**: Les variables se configurent sur **Vercel**, pas sur GitHub!

1. Dans votre projet Vercel, allez dans **Settings** → **Environment Variables**
2. Ajoutez ces variables (une par une) :

```
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_URL=https://votre-projet.vercel.app
NEXTAUTH_SECRET=votre-secret-generer-avec-openssl-rand-base64-32
```

**Pour générer NEXTAUTH_SECRET** :
```bash
# Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes(-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})))

# Mac/Linux
openssl rand -base64 32
```

### Étape 4: Créer la Base de Données

**Option A: Vercel Postgres (Recommandé)**
1. Dans Vercel → **Storage** → **Create Database**
2. Sélectionnez **Postgres**
3. Créez la base de données
4. Copiez la `DATABASE_URL` automatiquement générée
5. Ajoutez-la dans Environment Variables

**Option B: Supabase (Gratuit)**
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte et un projet
3. Settings → Database → Connection string
4. Copiez la `DATABASE_URL`
5. Ajoutez-la dans Vercel Environment Variables

### Étape 5: Déployer!

1. Dans Vercel, cliquez sur **"Deploy"**
2. Vercel va automatiquement :
   - Installer les dépendances
   - Générer Prisma Client
   - Builder le projet
   - Déployer

### Étape 6: Exécuter les Migrations Prisma

Après le premier déploiement :

```bash
# Installer Vercel CLI (si pas déjà fait)
npm i -g vercel

# Se connecter
vercel login

# Récupérer les variables d'environnement
vercel env pull .env.local

# Exécuter les migrations
npx prisma migrate deploy
```

Ou via l'interface Vercel :
1. Allez dans votre projet → **Deployments**
2. Cliquez sur les **3 points** → **View Function Logs**
3. Ou utilisez **Vercel CLI** dans votre terminal

## 🔄 Déploiements Automatiques

Une fois configuré, **chaque push sur GitHub déclenchera automatiquement un déploiement sur Vercel** !

```bash
# Faites vos modifications
git add .
git commit -m "Vos modifications"
git push

# Vercel déploiera automatiquement! 🎉
```

## 📝 Checklist Complète

- [ ] Code pushé sur GitHub
- [ ] Projet créé/importé sur Vercel
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Base de données PostgreSQL créée
- [ ] DATABASE_URL ajoutée dans Vercel
- [ ] Premier déploiement réussi
- [ ] Migrations Prisma exécutées
- [ ] Site accessible et fonctionnel

## 🐛 Dépannage

### "Build failed" sur Vercel
- Vérifiez que `DATABASE_URL` est bien configurée
- Vérifiez les logs dans Vercel → Deployments → Logs

### "Prisma generate failed"
- Assurez-vous que `DATABASE_URL` est correcte
- Vérifiez que la base de données est accessible

### Le site ne fonctionne pas après déploiement
- Vérifiez que les migrations Prisma ont été exécutées
- Vérifiez les variables d'environnement dans Vercel

## 💡 Astuce

Pour voir les logs en temps réel :
```bash
vercel logs --follow
```
