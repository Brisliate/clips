# Script de déploiement PowerShell pour ClipMarket
# Usage: .\scripts\deploy.ps1 [github|vercel|both]

param(
    [Parameter(Position=0)]
    [ValidateSet("github", "vercel", "both")]
    [string]$Target = "both"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 ClipMarket Deployment Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Fonction pour vérifier Git
function Check-Git {
    if (-not (Test-Path ".git")) {
        Write-Host "⚠️  Git n'est pas initialisé. Initialisation..." -ForegroundColor Yellow
        git init
        git branch -M main
    }
}

# Fonction pour push sur GitHub
function Deploy-GitHub {
    Write-Host "`n📦 Déploiement sur GitHub..." -ForegroundColor Blue
    
    Check-Git
    
    # Vérifier si remote existe
    try {
        $null = git remote get-url origin 2>$null
    } catch {
        Write-Host "⚠️  Remote GitHub non configuré" -ForegroundColor Yellow
        $repoUrl = Read-Host "Entrez l'URL de votre repository GitHub"
        git remote add origin $repoUrl
    }
    
    # Ajouter tous les fichiers
    git add .
    
    # Commit
    $commitMsg = Read-Host "Message de commit (défaut: Update)"
    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
        $commitMsg = "Update"
    }
    
    try {
        git commit -m $commitMsg
    } catch {
        Write-Host "Aucun changement à committer" -ForegroundColor Yellow
    }
    
    # Push
    Write-Host "⬆️  Push sur GitHub..." -ForegroundColor Green
    try {
        git push -u origin main
    } catch {
        git push
    }
    
    Write-Host "✅ Déployé sur GitHub avec succès!" -ForegroundColor Green
}

# Fonction pour déployer sur Vercel
function Deploy-Vercel {
    Write-Host "`n☁️  Déploiement sur Vercel..." -ForegroundColor Blue
    
    # Vérifier si Vercel CLI est installé
    try {
        $null = vercel whoami 2>$null
    } catch {
        Write-Host "⚠️  Vercel CLI non installé. Installation..." -ForegroundColor Yellow
        npm i -g vercel
    }
    
    # Vérifier si connecté
    try {
        $null = vercel whoami 2>$null
    } catch {
        Write-Host "⚠️  Vous devez vous connecter à Vercel" -ForegroundColor Yellow
        vercel login
    }
    
    # Déployer
    Write-Host "🚀 Déploiement en cours..." -ForegroundColor Green
    vercel --prod
    
    Write-Host "✅ Déployé sur Vercel avec succès!" -ForegroundColor Green
}

# Fonction pour exécuter les migrations
function Run-Migrations {
    Write-Host "`n🗄️  Exécution des migrations Prisma..." -ForegroundColor Blue
    
    # Générer Prisma Client
    npx prisma generate
    
    # Exécuter les migrations
    $runMigrate = Read-Host "Exécuter les migrations? (y/n)"
    if ($runMigrate -eq "y") {
        try {
            npx prisma migrate deploy
        } catch {
            npx prisma migrate dev
        }
        Write-Host "✅ Migrations exécutées!" -ForegroundColor Green
    }
}

# Menu principal
switch ($Target) {
    "github" {
        Deploy-GitHub
    }
    "vercel" {
        Deploy-Vercel
        Run-Migrations
    }
    "both" {
        Deploy-GitHub
        Write-Host ""
        $continue = Read-Host "Continuer avec le déploiement Vercel? (y/n)"
        if ($continue -eq "y") {
            Deploy-Vercel
            Run-Migrations
        }
    }
}

Write-Host "`n🎉 Déploiement terminé!" -ForegroundColor Green
