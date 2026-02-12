#!/bin/bash

# Script de configuration initiale pour serveur Hetzner
# Usage: ./scripts/setup-hetzner.sh

set -e

echo "🔧 Configuration Serveur Hetzner pour Coolify"
echo "============================================="

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}Ce script va installer Docker et Coolify sur votre serveur Hetzner${NC}"
read -p "Continuer? (y/n): " confirm

if [ "$confirm" != "y" ]; then
    echo "Annulé."
    exit 0
fi

# Mise à jour du système
echo -e "\n${BLUE}📦 Mise à jour du système...${NC}"
apt update && apt upgrade -y

# Installation de Docker
echo -e "\n${BLUE}🐳 Installation de Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
else
    echo "Docker est déjà installé"
fi

# Installation de Docker Compose
echo -e "\n${BLUE}📦 Installation de Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose est déjà installé"
fi

# Installation de Coolify
echo -e "\n${BLUE}☁️  Installation de Coolify...${NC}"
echo "Suivez les instructions sur: https://coolify.io/docs"
echo ""
echo "Ou exécutez:"
echo "  curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash"

read -p "Installer Coolify maintenant? (y/n): " install_coolify

if [ "$install_coolify" = "y" ]; then
    curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
fi

# Configuration du firewall
echo -e "\n${BLUE}🔥 Configuration du firewall...${NC}"
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    echo "Firewall configuré"
fi

echo -e "\n${GREEN}✅ Configuration terminée!${NC}"
echo ""
echo "Prochaines étapes:"
echo "1. Accédez à Coolify: http://$(hostname -I | awk '{print $1}')"
echo "2. Configurez votre premier projet"
echo "3. Connectez votre repository GitHub"
echo "4. Déployez ClipMarket!"
