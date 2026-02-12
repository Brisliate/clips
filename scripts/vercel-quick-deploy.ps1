# Script de déploiement rapide sur Vercel (PowerShell)
# Usage: .\scripts\vercel-quick-deploy.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Déploiement Vercel Rapide" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

# Vérifier si Vercel CLI est installé
try {
    $null = vercel whoami 2>$null
} catch {
    Write-Host "📦 Installation de Vercel CLI..." -ForegroundColor Yellow
    npm i -g vercel
}

# Vérifier si connecté
try {
    $null = vercel whoami 2>$null
} catch {
    Write-Host "🔐 Connexion à Vercel..." -ForegroundColor Yellow
    vercel login
}

# Vérifier si projet lié
if (-not (Test-Path ".vercel/project.json")) {
    Write-Host "🔗 Liaison du projet..." -ForegroundColor Yellow
    vercel link
}

# Générer Prisma Client
Write-Host "🗄️  Génération Prisma Client..." -ForegroundColor Blue
npx prisma generate

# Build local (optionnel)
$testBuild = Read-Host "Voulez-vous tester le build localement avant de déployer? (y/n)"
if ($testBuild -eq "y") {
    Write-Host "🔨 Build local..." -ForegroundColor Blue
    npm run build
}

# Déployer
Write-Host "☁️  Déploiement sur Vercel..." -ForegroundColor Green
vercel --prod

Write-Host ""
Write-Host "✅ Déploiement terminé!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 N'oubliez pas de:" -ForegroundColor Yellow
Write-Host "1. Configurer les variables d'environnement dans Vercel Dashboard"
Write-Host "2. Exécuter les migrations: npx prisma migrate deploy"
Write-Host "3. Vérifier que tout fonctionne sur votre URL Vercel"
