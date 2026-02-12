#!/bin/bash

# Script de déploiement pour Coolify
# Usage: ./scripts/deploy-coolify.sh

set -e

echo "🚀 ClipMarket - Déploiement Coolify"
echo "===================================="

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker n'est pas installé${NC}"
    echo "Installez Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Vérifier si docker-compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker Compose n'est pas installé${NC}"
    exit 1
fi

# Vérifier le fichier .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Fichier .env non trouvé${NC}"
    echo "Copiez .env.example vers .env et configurez vos variables"
    exit 1
fi

echo -e "\n${BLUE}📦 Build de l'image Docker...${NC}"
docker-compose build

echo -e "\n${BLUE}🗄️  Démarrage de la base de données...${NC}"
docker-compose up -d postgres

echo -e "\n${BLUE}⏳ Attente du démarrage de PostgreSQL...${NC}"
sleep 5

echo -e "\n${BLUE}🔄 Exécution des migrations Prisma...${NC}"
docker-compose run --rm app npx prisma migrate deploy || docker-compose run --rm app npx prisma migrate dev

echo -e "\n${BLUE}🚀 Démarrage de l'application...${NC}"
docker-compose up -d app

echo -e "\n${GREEN}✅ Déploiement terminé!${NC}"
echo ""
echo "Votre application est disponible sur:"
echo "  - Local: http://localhost:3000"
echo ""
echo "Commandes utiles:"
echo "  - Voir les logs: docker-compose logs -f app"
echo "  - Arrêter: docker-compose down"
echo "  - Redémarrer: docker-compose restart app"
echo "  - Terminal: docker-compose exec app sh"
