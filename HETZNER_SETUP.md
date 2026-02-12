# 🖥️ Configuration Serveur Hetzner pour Coolify

Guide étape par étape pour configurer votre serveur Hetzner avec Coolify.

## 📋 Étape 1: Créer un serveur Hetzner

1. Allez sur [hetzner.com](https://www.hetzner.com)
2. Créez un compte
3. Créez un nouveau projet
4. Cliquez sur "Add Server"
5. Choisissez :
   - **Location**: Falkenstein (Allemagne) ou Nuremberg
   - **Image**: Ubuntu 22.04
   - **Type**: CPX11 (2 vCPU, 4GB RAM) - suffisant pour commencer
   - **SSH Key**: Ajoutez votre clé SSH publique
6. Créez le serveur

## 🔐 Étape 2: Se connecter au serveur

```bash
ssh root@VOTRE-IP-HETZNER
```

Ou avec votre clé SSH :
```bash
ssh -i ~/.ssh/votre_cle root@VOTRE-IP-HETZNER
```

## 🚀 Étape 3: Installation rapide (Script automatique)

```bash
# Télécharger et exécuter le script
curl -fsSL https://raw.githubusercontent.com/VOTRE-REPO/clipmarket/main/scripts/setup-hetzner.sh | bash
```

Ou manuellement :

```bash
# Mise à jour
apt update && apt upgrade -y

# Installation Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Installation Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Installation Coolify
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

## ☁️ Étape 4: Accéder à Coolify

1. Ouvrez votre navigateur
2. Allez sur : `http://VOTRE-IP-HETZNER`
3. Suivez l'assistant de configuration Coolify
4. Créez votre compte admin

## 🔧 Étape 5: Configuration Coolify

### 5.1. Connecter GitHub

1. Dans Coolify → Settings → Source Providers
2. Cliquez sur "Add GitHub"
3. Autorisez l'accès à votre repository
4. Sélectionnez le repository `clipmarket`

### 5.2. Créer une base de données PostgreSQL

1. Coolify → New Resource → Database
2. Sélectionnez PostgreSQL
3. Version : 16 (recommandé)
4. Créez la base de données
5. Notez la `DATABASE_URL` générée

### 5.3. Créer l'application

1. Coolify → New Resource → Application
2. Source : GitHub → Votre repository
3. Branch : `main`
4. Build Pack : **Dockerfile**
5. Port : `3000`

### 5.4. Configurer les variables d'environnement

Dans votre application Coolify → Environment Variables :

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

### 5.5. Déployer

1. Cliquez sur "Deploy"
2. Attendez la fin du build
3. Votre application sera disponible !

## 🌐 Étape 6: Configurer un domaine (Optionnel)

### 6.1. Pointer votre domaine vers Hetzner

Dans les DNS de votre domaine, ajoutez :

```
Type: A
Name: @
Value: VOTRE-IP-HETZNER
TTL: 3600
```

### 6.2. Configurer SSL dans Coolify

1. Dans votre application Coolify
2. Allez dans "Domains"
3. Ajoutez votre domaine
4. Coolify configurera automatiquement SSL avec Let's Encrypt

## 🔄 Déploiements futurs

### Option A: Automatique (Recommandé)

Configurez dans Coolify :
- Auto Deploy : Activé
- Branch : `main`

Chaque push sur `main` déclenchera un déploiement automatique.

### Option B: Manuel

Dans Coolify, cliquez simplement sur "Deploy" quand vous voulez mettre à jour.

## 📊 Monitoring

Coolify inclut :
- Logs en temps réel
- Métriques de performance
- Health checks automatiques
- Redémarrage automatique en cas d'erreur

## 💰 Coûts

- **Hetzner CPX11**: ~5€/mois
- **Domaine**: ~10-15€/an (optionnel)
- **Coolify**: Gratuit (open-source)
- **Total**: ~5-6€/mois

## 🐛 Dépannage

### Le serveur ne répond pas

```bash
# Vérifier Docker
systemctl status docker

# Vérifier Coolify
docker ps
```

### L'application ne démarre pas

Vérifiez les logs dans Coolify → Deployments → Logs

### Erreur de base de données

```bash
# Via SSH
docker exec -it postgres_container psql -U postgres

# Ou via Coolify Terminal
npx prisma migrate deploy
```

## 🔐 Sécurité

### Firewall recommandé

```bash
# UFW (si installé)
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### Mises à jour régulières

```bash
apt update && apt upgrade -y
docker system prune -a
```

## 📚 Ressources

- [Documentation Coolify](https://coolify.io/docs)
- [Documentation Hetzner](https://docs.hetzner.com)
- [Guide Docker](https://docs.docker.com)

## ✅ Checklist Complète

- [ ] Serveur Hetzner créé
- [ ] SSH configuré
- [ ] Docker installé
- [ ] Coolify installé
- [ ] GitHub connecté
- [ ] Base de données PostgreSQL créée
- [ ] Application créée dans Coolify
- [ ] Variables d'environnement configurées
- [ ] Application déployée
- [ ] Migrations Prisma exécutées
- [ ] Domaine configuré (optionnel)
- [ ] SSL activé (si domaine)
- [ ] Site accessible et fonctionnel

**Vous êtes prêt ! 🎉**
