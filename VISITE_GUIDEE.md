# 🎨 Visite Guidée de ClipMarket

## 🌐 Accéder à votre Plateforme

Votre application est maintenant déployée sur Vercel ! 

**URL de votre site** : `https://votre-projet.vercel.app` (remplacez par votre URL Vercel)

## 🏠 Pages Disponibles

### 1. Page d'Accueil (`/`)
- Redirige vers `/auth/signin` si non connecté
- Redirige vers `/dashboard` si connecté

### 2. Authentification (`/auth/signin` et `/auth/signup`)

**Page de Connexion** :
- ✅ Connexion par email/mot de passe
- ✅ Connexion Google (si configuré)
- ✅ Design moderne avec onglets
- ✅ Liens vers l'inscription

**Page d'Inscription** :
- ✅ Formulaire d'inscription
- ✅ Choix du rôle (Brand ou Creator)
- ✅ Validation des champs
- ✅ Redirection vers onboarding

### 3. Onboarding (`/onboarding`)
- ✅ Formulaire de profil personnalisé
- ✅ Pour Creators : niche, plateformes, followers, bio
- ✅ Pour Brands : nom de l'entreprise, site web
- ✅ Option de skip pour plus tard

### 4. Dashboard Principal (`/dashboard`)

**Pour les Brands** :
- 📊 Statistiques : Total Views, Total Spend, Active Creators, Active Campaigns
- 💰 Vue d'ensemble des dépenses
- 📈 Graphiques de performance

**Pour les Creators** :
- 📊 Statistiques : Total Views, Total Earnings, Pending Earnings, Active Campaigns
- 💰 Carte Wallet avec balance disponible
- 📈 Suivi des gains

### 5. Brand Dashboard (`/brand/campaigns`)

**Liste des Campagnes** :
- ✅ Vue en grille avec cartes de campagne
- ✅ Informations : titre, description, plateforme, CPM, budget
- ✅ Statut visuel (Active, Paused, Completed)
- ✅ Bouton "Create Campaign"

**Créer une Campagne** (`/brand/campaigns/new`) :
- ✅ Formulaire complet avec validation
- ✅ Champs : titre, description, plateforme, CPM, budget max
- ✅ Guidelines de contenu
- ✅ Filtres pour creators (niche, followers minimum)
- ✅ Date d'expiration

**Détails d'une Campagne** (`/brand/campaigns/[id]`) :
- ✅ Vue détaillée de la campagne
- ✅ Statistiques : vues totales, dépenses, creators actifs
- ✅ Tableau des soumissions
- ✅ Actions : Approuver/Rejeter les soumissions
- ✅ Suivi des vues et gains par creator

### 6. Creator Dashboard (`/creator/campaigns`)

**Parcourir les Campagnes** :
- ✅ Filtres avancés : plateforme, CPM min/max, niche, followers
- ✅ Cartes de campagne avec toutes les infos
- ✅ Badges pour statut et plateforme
- ✅ Barre de progression du budget

**Détails d'une Campagne** (`/creator/campaigns/[id]`) :
- ✅ Vue complète de la campagne
- ✅ Formulaire de soumission
- ✅ Upload de vidéo (Uploadthing)
- ✅ Ou lien vidéo externe
- ✅ Notes optionnelles

**Mes Soumissions** (`/creator/submissions`) :
- ✅ Tableau de toutes vos soumissions
- ✅ Statut : Pending, Approved, Rejected
- ✅ Vues totales et gains estimés
- ✅ Liens vers les vidéos

### 7. Wallet (`/wallet`)

**Pour les Creators** :
- 💰 Balance disponible
- ⏳ Balance en attente
- 📈 Total gagné (lifetime)
- 💸 Bouton de retrait
- 📋 Historique des transactions

### 8. Admin Panel (`/admin`)

**Dashboard Admin** :
- 📊 Vue d'ensemble de la plateforme
- 👥 Total users, campaigns, transactions
- 💵 Revenus de la plateforme

**Gestion des Utilisateurs** (`/admin/users`) :
- ✅ Liste de tous les utilisateurs
- ✅ Filtres par rôle (Admin, Brand, Creator)
- ✅ Statistiques par utilisateur
- ✅ Actions : suspendre, modifier

## 🎨 Design & UI

### Style Visuel
- ✅ **Design moderne** inspiré de Pearpop (clean & minimal)
- ✅ **Fond blanc** avec ombres douces
- ✅ **Cartes** pour chaque élément
- ✅ **Hiérarchie claire** avec typographie soignée
- ✅ **Navigation sidebar** pour accès rapide
- ✅ **Composants réutilisables** (shadcn/ui)

### Composants Principaux

1. **CampaignCard** : Carte de campagne avec toutes les infos
2. **FilterBar** : Filtres avancés pour les campagnes
3. **StatsCard** : Cartes de statistiques avec icônes
4. **WalletCard** : Carte wallet avec balance
5. **SubmissionTable** : Tableau des soumissions avec actions
6. **Sidebar** : Navigation principale
7. **Header** : En-tête avec profil utilisateur

## 🔐 Fonctionnalités de Sécurité

- ✅ **NextAuth.js** pour l'authentification
- ✅ **Rôles** : Admin, Brand, Creator
- ✅ **Protection des routes** selon le rôle
- ✅ **Hachage des mots de passe** (bcrypt)
- ✅ **Sessions sécurisées** (JWT)

## 💾 Base de Données

### Modèles Principaux

1. **User** : Utilisateurs avec rôles
2. **Profile** : Profils étendus (creator/brand)
3. **Campaign** : Campagnes UGC
4. **Submission** : Soumissions de contenu
5. **ViewTracking** : Suivi des vues
6. **Wallet** : Portefeuilles utilisateurs
7. **Transaction** : Transactions financières

## 🚀 Fonctionnalités Clés

### Pour les Brands
- ✅ Créer des campagnes avec CPM
- ✅ Définir des budgets maximums
- ✅ Approuver/rejeter les soumissions
- ✅ Suivre les performances en temps réel
- ✅ Arrêt automatique quand budget atteint

### Pour les Creators
- ✅ Parcourir les campagnes disponibles
- ✅ Filtrer par critères (CPM, niche, followers)
- ✅ Soumettre du contenu (vidéo)
- ✅ Suivre les gains basés sur les vues
- ✅ Retirer les fonds

### Pour les Admins
- ✅ Gérer les utilisateurs
- ✅ Suivre les vues manuellement (MVP)
- ✅ Voir les statistiques globales
- ✅ Monitorer les transactions

## 📱 Responsive Design

- ✅ **Desktop-first** comme demandé
- ✅ **Adaptatif** pour tablettes
- ✅ **Prêt pour mobile** (structure API-first)

## 🔄 Workflow Typique

### Brand Flow
1. S'inscrire → Onboarding → Dashboard
2. Créer une campagne → Configurer CPM et budget
3. Attendre les soumissions → Approuver/Rejeter
4. Suivre les performances → Voir les dépenses

### Creator Flow
1. S'inscrire → Onboarding → Dashboard
2. Parcourir les campagnes → Filtrer
3. Soumettre du contenu → Attendre approbation
4. Suivre les gains → Retirer les fonds

## 🎯 Prochaines Étapes (Futures)

- 🔄 Tracking automatique des vues (APIs)
- 🏆 Système de ranking des creators
- 🎮 Gamification
- 🌙 Mode sombre
- 📱 Application mobile (API déjà prête)

## 🎉 Félicitations !

Vous avez maintenant une plateforme SaaS complète et fonctionnelle pour connecter Brands et Creators ! 🚀
