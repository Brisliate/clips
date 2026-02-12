#!/bin/bash

# Script pour configurer Vercel automatiquement
# Usage: ./scripts/setup-vercel.sh

set -e

echo "🔧 Configuration Vercel..."
echo "=========================="

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "Installation de Vercel CLI..."
    npm i -g vercel
fi

# Se connecter
echo "Connexion à Vercel..."
vercel login

# Lier le projet
echo "Liaison du projet..."
vercel link

# Récupérer les variables d'environnement
echo "Récupération des variables d'environnement..."
vercel env pull .env.local

echo "✅ Configuration Vercel terminée!"
echo ""
echo "Informations importantes:"
echo "- VERCEL_TOKEN: Récupérez-le depuis vercel.com/account/tokens"
echo "- VERCEL_ORG_ID: Trouvez-le dans .vercel/project.json après 'vercel link'"
echo "- VERCEL_PROJECT_ID: Trouvez-le dans .vercel/project.json après 'vercel link'"
echo ""
echo "Ajoutez ces valeurs dans GitHub Secrets pour CI/CD automatique"
