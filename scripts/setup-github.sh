#!/bin/bash

# Script pour configurer GitHub automatiquement
# Usage: ./scripts/setup-github.sh <github-repo-url>

set -e

if [ -z "$1" ]; then
    echo "Usage: ./scripts/setup-github.sh <github-repo-url>"
    echo "Exemple: ./scripts/setup-github.sh https://github.com/username/clipmarket.git"
    exit 1
fi

REPO_URL=$1

echo "🔧 Configuration GitHub..."
echo "=========================="

# Initialiser Git si nécessaire
if [ ! -d ".git" ]; then
    echo "Initialisation de Git..."
    git init
    git branch -M main
fi

# Configurer le remote
if git remote get-url origin &> /dev/null; then
    echo "Mise à jour du remote origin..."
    git remote set-url origin "$REPO_URL"
else
    echo "Ajout du remote origin..."
    git remote add origin "$REPO_URL"
fi

# Créer le premier commit
echo "Création du commit initial..."
git add .
git commit -m "Initial commit: ClipMarket SaaS platform" || echo "Aucun changement"

# Push
echo "Push sur GitHub..."
git push -u origin main || git push

echo "✅ Configuration GitHub terminée!"
echo ""
echo "Prochaines étapes:"
echo "1. Configurez les secrets GitHub dans Settings → Secrets and variables → Actions"
echo "2. Ajoutez: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID"
echo "3. Ajoutez: DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET"
