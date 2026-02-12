#!/bin/bash

# Script de déploiement rapide sur Vercel
# Usage: ./scripts/vercel-quick-deploy.sh

set -e

echo "🚀 Déploiement Vercel Rapide"
echo "============================="

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm i -g vercel
fi

# Vérifier si connecté
if ! vercel whoami &> /dev/null; then
    echo "🔐 Connexion à Vercel..."
    vercel login
fi

# Vérifier si projet lié
if [ ! -f ".vercel/project.json" ]; then
    echo "🔗 Liaison du projet..."
    vercel link
fi

# Générer Prisma Client
echo "🗄️  Génération Prisma Client..."
npx prisma generate

# Build local (optionnel, pour vérifier)
read -p "Voulez-vous tester le build localement avant de déployer? (y/n): " test_build
if [ "$test_build" = "y" ]; then
    echo "🔨 Build local..."
    npm run build
fi

# Déployer
echo "☁️  Déploiement sur Vercel..."
vercel --prod

echo ""
echo "✅ Déploiement terminé!"
echo ""
echo "📝 N'oubliez pas de:"
echo "1. Configurer les variables d'environnement dans Vercel Dashboard"
echo "2. Exécuter les migrations: npx prisma migrate deploy"
echo "3. Vérifier que tout fonctionne sur votre URL Vercel"
