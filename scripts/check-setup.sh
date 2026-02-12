#!/bin/bash

# Script pour vérifier que tout est bien configuré
# Usage: ./scripts/check-setup.sh

echo "🔍 Vérification de la Configuration"
echo "===================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# Vérifier Git
echo -n "Vérification Git... "
if [ -d ".git" ]; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌ Git non initialisé${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Vérifier remote GitHub
echo -n "Vérification remote GitHub... "
if git remote get-url origin &> /dev/null; then
    echo -e "${GREEN}✅${NC}"
    echo "   Remote: $(git remote get-url origin)"
else
    echo -e "${YELLOW}⚠️  Remote GitHub non configuré${NC}"
fi

# Vérifier .env
echo -n "Vérification .env... "
if [ -f ".env" ]; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${YELLOW}⚠️  .env non trouvé (normal si vous utilisez Vercel env vars)${NC}"
fi

# Vérifier Vercel CLI
echo -n "Vérification Vercel CLI... "
if command -v vercel &> /dev/null; then
    echo -e "${GREEN}✅${NC}"
    if vercel whoami &> /dev/null; then
        echo "   Connecté en tant que: $(vercel whoami)"
    else
        echo -e "   ${YELLOW}⚠️  Non connecté (exécutez: vercel login)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Vercel CLI non installé${NC}"
fi

# Vérifier projet Vercel lié
echo -n "Vérification projet Vercel... "
if [ -f ".vercel/project.json" ]; then
    echo -e "${GREEN}✅${NC}"
    echo "   Projet lié: $(cat .vercel/project.json | grep -o '"projectId":"[^"]*"' | cut -d'"' -f4)"
else
    echo -e "${YELLOW}⚠️  Projet non lié (exécutez: vercel link)${NC}"
fi

# Vérifier Prisma
echo -n "Vérification Prisma... "
if command -v npx &> /dev/null; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌ npm/npx non trouvé${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Vérifier node_modules
echo -n "Vérification dépendances... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${YELLOW}⚠️  Dépendances non installées (exécutez: npm install)${NC}"
fi

echo ""
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Configuration OK!${NC}"
    echo ""
    echo "Prochaines étapes:"
    echo "1. Assurez-vous que votre code est pushé sur GitHub"
    echo "2. Configurez les variables d'environnement sur Vercel"
    echo "3. Créez une base de données PostgreSQL"
    echo "4. Déployez sur Vercel"
else
    echo -e "${RED}❌ $ERRORS erreur(s) trouvée(s)${NC}"
fi
