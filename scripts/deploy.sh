#!/bin/bash

# Script de déploiement automatique pour ClipMarket
# Usage: ./scripts/deploy.sh [github|vercel|both]

set -e

echo "🚀 ClipMarket Deployment Script"
echo "================================"

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour vérifier si Git est initialisé
check_git() {
    if [ ! -d ".git" ]; then
        echo -e "${YELLOW}⚠️  Git n'est pas initialisé. Initialisation...${NC}"
        git init
        git branch -M main
    fi
}

# Fonction pour vérifier les variables d'environnement
check_env() {
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠️  Fichier .env non trouvé${NC}"
        echo "Copiez .env.example vers .env et configurez vos variables"
        exit 1
    fi
}

# Fonction pour push sur GitHub
deploy_github() {
    echo -e "\n${BLUE}📦 Déploiement sur GitHub...${NC}"
    
    check_git
    
    # Vérifier si remote existe
    if ! git remote get-url origin &> /dev/null; then
        echo -e "${YELLOW}⚠️  Remote GitHub non configuré${NC}"
        read -p "Entrez l'URL de votre repository GitHub: " repo_url
        git remote add origin "$repo_url"
    fi
    
    # Ajouter tous les fichiers
    git add .
    
    # Commit
    read -p "Message de commit (défaut: Update): " commit_msg
    commit_msg=${commit_msg:-Update}
    git commit -m "$commit_msg" || echo "Aucun changement à committer"
    
    # Push
    echo -e "${GREEN}⬆️  Push sur GitHub...${NC}"
    git push -u origin main || git push
    
    echo -e "${GREEN}✅ Déployé sur GitHub avec succès!${NC}"
}

# Fonction pour déployer sur Vercel
deploy_vercel() {
    echo -e "\n${BLUE}☁️  Déploiement sur Vercel...${NC}"
    
    # Vérifier si Vercel CLI est installé
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}⚠️  Vercel CLI non installé. Installation...${NC}"
        npm i -g vercel
    fi
    
    # Vérifier si connecté
    if ! vercel whoami &> /dev/null; then
        echo -e "${YELLOW}⚠️  Vous devez vous connecter à Vercel${NC}"
        vercel login
    fi
    
    # Déployer
    echo -e "${GREEN}🚀 Déploiement en cours...${NC}"
    vercel --prod
    
    echo -e "${GREEN}✅ Déployé sur Vercel avec succès!${NC}"
}

# Fonction pour exécuter les migrations Prisma
run_migrations() {
    echo -e "\n${BLUE}🗄️  Exécution des migrations Prisma...${NC}"
    
    # Générer Prisma Client
    npx prisma generate
    
    # Exécuter les migrations
    read -p "Exécuter les migrations? (y/n): " run_migrate
    if [ "$run_migrate" = "y" ]; then
        npx prisma migrate deploy || npx prisma migrate dev
        echo -e "${GREEN}✅ Migrations exécutées!${NC}"
    fi
}

# Menu principal
case "${1:-both}" in
    github)
        deploy_github
        ;;
    vercel)
        deploy_vercel
        run_migrations
        ;;
    both)
        deploy_github
        echo ""
        read -p "Continuer avec le déploiement Vercel? (y/n): " continue_vercel
        if [ "$continue_vercel" = "y" ]; then
            deploy_vercel
            run_migrations
        fi
        ;;
    *)
        echo "Usage: ./scripts/deploy.sh [github|vercel|both]"
        exit 1
        ;;
esac

echo -e "\n${GREEN}🎉 Déploiement terminé!${NC}"
