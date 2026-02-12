# 🚀 Déploiement sur Coolify + Hetzner

Guide complet pour déployer ClipMarket sur Coolify (auto-hébergé sur Hetzner).

## 📋 Prérequis

1. **Serveur Hetzner** (CPX11 ou plus - ~5€/mois)
   - Ubuntu 22.04 LTS recommandé
   - Au moins 2GB RAM
   - 20GB SSD minimum

2. **Coolify** installé sur votre serveur
   - Suivez: https://coolify.io/docs

3. **Domaine** (optionnel mais recommandé)
   - Pointé vers l'IP de votre serveur Hetzner

## 🎯 Option 1: Déploiement via Coolify UI (Recommandé)

### Étape 1: Préparer votre repository

```bash
# Assurez-vous que tout est commité
git add .
git commit -m "Ready for Coolify deployment"
git push origin main
```

### Étape 2: Créer une nouvelle application dans Coolify

1. **Connecter GitHub**
   - Dans Coolify → Settings → Source Providers
   - Ajoutez votre compte GitHub
   - Autorisez l'accès au repository

2. **Créer une nouvelle application**
   - Cliquez sur "New Resource" → "Application"
   - Sélectionnez votre repository GitHub
   - Choisissez la branche `main`
   - Type: **Dockerfile**

3. **Configurer les variables d'environnement**
   
   Dans Coolify → Environment Variables, ajoutez :

   ```env
   DATABASE_URL=postgresql://postgres:password@postgres:5432/clipmarket
   NEXTAUTH_URL=https://votre-domaine.com
   NEXTAUTH_SECRET=générez-avec-openssl-rand-base64-32
   GOOGLE_CLIENT_ID=votre-google-client-id
   GOOGLE_CLIENT_SECRET=votre-google-client-secret
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   UPLOADTHING_SECRET=votre-secret
   UPLOADTHING_APP_ID=votre-app-id
   ```

4. **Ajouter une base de données PostgreSQL**
   - Dans Coolify → New Resource → Database
   - Sélectionnez PostgreSQL
   - Notez la `DATABASE_URL` générée
   - Mettez à jour la variable `DATABASE_URL` dans votre app

5. **Déployer**
   - Cliquez sur "Deploy"
   - Coolify va automatiquement :
     - Build l'image Docker
     - Exécuter les migrations Prisma
     - Démarrer l'application

### Étape 3: Exécuter les migrations Prisma

Après le premier déploiement, exécutez les migrations :

```bash
# Via Coolify Terminal ou SSH
cd /app
npx prisma migrate deploy
```

Ou via Coolify :
- Allez dans votre application → Terminal
- Exécutez : `npx prisma migrate deploy`

## 🐳 Option 2: Déploiement avec Docker Compose (Avancé)

Si vous préférez gérer vous-même :

### Étape 1: Cloner le repository sur votre serveur

```bash
ssh root@votre-serveur-hetzner
git clone https://github.com/VOTRE-USERNAME/clipmarket.git
cd clipmarket
```

### Étape 2: Configurer les variables d'environnement

```bash
cp .env.example .env
nano .env  # Éditez avec vos valeurs
```

### Étape 3: Démarrer avec Docker Compose

```bash
docker-compose up -d
```

### Étape 4: Exécuter les migrations

```bash
docker-compose exec app npx prisma migrate deploy
```

## 🔧 Configuration Coolify Recommandée

### Build Settings

- **Build Pack**: Dockerfile
- **Dockerfile Path**: `Dockerfile`
- **Build Command**: (automatique avec Dockerfile)
- **Start Command**: (automatique)

### Port Configuration

- **Port**: `3000`
- **Expose Port**: `3000`

### Health Check

Coolify détectera automatiquement le port 3000.

## 📊 Configuration du Serveur Hetzner

### Taille minimale recommandée

- **CPX11**: 2 vCPU, 4GB RAM, 40GB SSD (~5€/mois)
- **CPX21**: 3 vCPU, 8GB RAM, 80GB SSD (~10€/mois) - Pour production

### Firewall

Assurez-vous d'ouvrir les ports :
- `80` (HTTP)
- `443` (HTTPS)
- `22` (SSH)

Coolify gère automatiquement les certificats SSL via Let's Encrypt.

## 🔐 Sécurité

### Variables sensibles

⚠️ **Ne commitez JAMAIS** :
- `.env`
- Tokens API
- Secrets

Tout est déjà dans `.gitignore`.

### SSL/TLS

Coolify configure automatiquement SSL avec Let's Encrypt si vous avez un domaine.

## 🚀 Scripts de déploiement pour Coolify

J'ai créé des scripts spécifiques dans `scripts/deploy-coolify.sh` :

```bash
chmod +x scripts/deploy-coolify.sh
./scripts/deploy-coolify.sh
```

## 📝 Checklist de Déploiement

- [ ] Serveur Hetzner créé et configuré
- [ ] Coolify installé sur le serveur
- [ ] Repository GitHub connecté à Coolify
- [ ] Application créée dans Coolify
- [ ] Base de données PostgreSQL créée
- [ ] Variables d'environnement configurées
- [ ] Domaine configuré (optionnel)
- [ ] Application déployée
- [ ] Migrations Prisma exécutées
- [ ] Site accessible et fonctionnel

## 🐛 Dépannage

### Erreur: "Cannot connect to database"

Vérifiez que :
- La base de données PostgreSQL est démarrée
- La `DATABASE_URL` est correcte
- Le réseau Docker est configuré

### Erreur: "Prisma Client not generated"

```bash
# Dans le terminal Coolify
npx prisma generate
```

### Erreur: "Build failed"

Vérifiez les logs dans Coolify → Deployments → Logs

## 💰 Coûts Estimés

- **Hetzner CPX11**: ~5€/mois
- **Domaine**: ~10-15€/an (optionnel)
- **Total**: ~5-6€/mois

Comparé à Vercel Pro (~20€/mois), c'est beaucoup plus économique !

## 🔄 Mises à jour Automatiques

Coolify peut être configuré pour :
- Auto-deploy sur push vers `main`
- Webhooks GitHub
- Déploiements manuels

## 📞 Support

- [Documentation Coolify](https://coolify.io/docs)
- [Documentation Hetzner](https://docs.hetzner.com)

## 🎯 Avantages vs Vercel

| Feature | Coolify + Hetzner | Vercel |
|---------|------------------|--------|
| Coût | ~5€/mois | ~20€/mois |
| Contrôle | Total | Limité |
| Base de données | Incluse | Payante |
| Bandwidth | Illimité | Limité |
| Custom domains | Illimité | Limité |
| SSL | Auto (Let's Encrypt) | Auto |

**Conclusion**: Coolify + Hetzner est parfait pour ce projet ! 🚀
