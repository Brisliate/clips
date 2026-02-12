# 🚀 Démarrage Rapide - ClipMarket

## Pour voir le résultat rapidement

### Option 1: Déploiement Vercel (Recommandé - 5 minutes)

1. **Push sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/VOTRE-USERNAME/clipmarket.git
   git push -u origin main
   ```

2. **Déployer sur Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez "Add New Project"
   - Importez votre repo GitHub
   - Ajoutez les variables d'environnement (voir ci-dessous)
   - Cliquez "Deploy"

3. **Configurer la base de données**
   - Dans Vercel → Storage → Créez une Postgres DB
   - Ou utilisez Supabase/Neon (gratuit)
   - Copiez la `DATABASE_URL` dans les env vars

4. **Variables d'environnement minimales sur Vercel**
   ```
   DATABASE_URL=votre-connection-string
   NEXTAUTH_URL=https://votre-projet.vercel.app
   NEXTAUTH_SECRET=générez-avec-openssl-rand-base64-32
   ```

5. **Exécuter les migrations**
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

### Option 2: Test Local (Développement)

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer .env
cp .env.example .env
# Éditez .env avec vos valeurs

# 3. Configurer la base de données
npx prisma generate
npx prisma migrate dev --name init

# 4. Lancer le serveur
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## 📝 Variables d'Environnement Minimales

Pour un déploiement fonctionnel, vous avez besoin au minimum de :

```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=http://localhost:3000  # ou votre URL Vercel
NEXTAUTH_SECRET=votre-secret
```

Les autres (Stripe, Google OAuth, etc.) sont optionnelles pour tester.

## ✅ Checklist Rapide

- [ ] Code sur GitHub
- [ ] Projet Vercel créé
- [ ] DATABASE_URL configurée
- [ ] NEXTAUTH_URL et NEXTAUTH_SECRET configurés
- [ ] Migrations exécutées
- [ ] Site déployé et accessible

## 🎯 Prochaines Étapes

Une fois déployé :
1. Créez un compte (Brand ou Creator)
2. Testez la création de campagne
3. Testez la soumission de contenu
4. Configurez Stripe pour les paiements réels

Pour plus de détails, voir [DEPLOYMENT.md](./DEPLOYMENT.md)
