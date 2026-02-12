# 🧪 Comment Tester la Plateforme

## 🚀 Accès Rapide

1. **Allez sur votre URL Vercel** : `https://votre-projet.vercel.app`
2. **Créez un compte** (Brand ou Creator)
3. **Explorez les fonctionnalités** !

## 👤 Test en tant que Brand

### 1. Créer un Compte Brand
- Allez sur `/auth/signup`
- Choisissez "Brand"
- Complétez l'onboarding

### 2. Créer une Campagne
- Allez sur `/brand/campaigns/new`
- Remplissez le formulaire :
  - Titre : "Test Campaign"
  - Description : "Test UGC campaign"
  - Plateforme : TikTok
  - CPM : $5.00
  - Budget max : $1000
  - Expiration : Dans 30 jours
- Cliquez "Create Campaign"

### 3. Voir votre Campagne
- Allez sur `/brand/campaigns`
- Cliquez sur votre campagne
- Voir les statistiques et soumissions

## 🎨 Test en tant que Creator

### 1. Créer un Compte Creator
- Allez sur `/auth/signup`
- Choisissez "Creator"
- Complétez l'onboarding (niche, plateformes, followers)

### 2. Parcourir les Campagnes
- Allez sur `/creator/campaigns`
- Utilisez les filtres pour trouver des campagnes
- Cliquez sur une campagne pour voir les détails

### 3. Soumettre du Contenu
- Allez sur `/creator/campaigns/[id]`
- Remplissez le formulaire :
  - URL vidéo (ex: https://youtube.com/watch?v=...)
  - Ou upload un fichier
  - Notes optionnelles
- Cliquez "Submit Content"

### 4. Voir vos Soumissions
- Allez sur `/creator/submissions`
- Voir le statut de vos soumissions
- Voir les vues et gains estimés

### 5. Voir votre Wallet
- Allez sur `/wallet`
- Voir votre balance
- Voir l'historique des transactions

## 🔄 Test du Workflow Complet

### Scénario : Campagne Complète

1. **Brand** crée une campagne avec CPM $5 et budget $1000
2. **Creator** soumet une vidéo
3. **Brand** approuve la soumission
4. **Admin** (ou automatique) track les vues (ex: 50,000 vues)
5. **Système calcule** : (50,000 / 1000) × $5 = $250
6. **Creator** voit les gains dans son wallet
7. **Creator** peut retirer les fonds

## 📊 Vérifier les Statistiques

### Dashboard Brand
- Total Views
- Total Spend
- Active Creators
- Active Campaigns

### Dashboard Creator
- Total Views
- Total Earnings
- Pending Earnings
- Active Campaigns

## 🎨 Explorer le Design

- ✅ Navigation sidebar
- ✅ Cartes de campagne
- ✅ Tableaux de données
- ✅ Formulaires avec validation
- ✅ Badges et statuts colorés
- ✅ Graphiques et statistiques

## 🔐 Tester la Sécurité

- ✅ Essayer d'accéder à `/admin` sans être admin → Redirection
- ✅ Essayer d'accéder à `/brand/campaigns` en tant que creator → Redirection
- ✅ Vérifier que les données sont isolées par utilisateur

## 💡 Astuces de Test

1. **Créez plusieurs comptes** pour tester différents rôles
2. **Utilisez des données réalistes** pour mieux voir le résultat
3. **Testez les filtres** avec différentes combinaisons
4. **Vérifiez la responsivité** en redimensionnant la fenêtre

## 🐛 Si quelque chose ne fonctionne pas

1. Vérifiez la console du navigateur (F12)
2. Vérifiez les logs Vercel
3. Vérifiez que `DATABASE_URL` est configurée
4. Vérifiez que les migrations Prisma sont exécutées

## 🎉 Amusez-vous bien !

Explorez toutes les fonctionnalités et voyez votre plateforme en action ! 🚀
