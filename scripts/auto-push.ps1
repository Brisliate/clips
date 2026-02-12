# Script de push automatique (fonctionne une fois Git configuré)
# Usage: .\scripts\auto-push.ps1 [commit-message]

param(
    [string]$CommitMessage = "Update: ClipMarket platform"
)

$ErrorActionPreference = "Stop"

Write-Host "🤖 Push Automatique sur GitHub" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

# Vérifier si Git est disponible
try {
    $gitVersion = git --version 2>&1
    Write-Host "✅ Git détecté: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git n'est pas installé ou pas dans le PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Pour installer Git:" -ForegroundColor Yellow
    Write-Host "1. Téléchargez: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. Installez avec 'Add Git to PATH' coché" -ForegroundColor White
    Write-Host "3. Redémarrez Cursor" -ForegroundColor White
    exit 1
}

# Vérifier si on est dans un repo Git
if (-not (Test-Path ".git")) {
    Write-Host "Initialisation du repository Git..." -ForegroundColor Yellow
    git init
    git branch -M main
    
    # Demander l'URL du repo GitHub
    Write-Host ""
    Write-Host "⚠️  Remote GitHub non configuré" -ForegroundColor Yellow
    $repoUrl = Read-Host "Entrez l'URL de votre repository GitHub (ex: https://github.com/username/clipmarket.git)"
    git remote add origin $repoUrl
}

# Vérifier le remote
try {
    $remote = git remote get-url origin 2>&1
    Write-Host "✅ Remote configuré: $remote" -ForegroundColor Green
} catch {
    Write-Host "❌ Remote GitHub non configuré" -ForegroundColor Red
    $repoUrl = Read-Host "Entrez l'URL de votre repository GitHub"
    git remote add origin $repoUrl
}

# Ajouter tous les fichiers
Write-Host "`n📦 Ajout des fichiers..." -ForegroundColor Blue
git add .

# Vérifier s'il y a des changements
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "ℹ️  Aucun changement à committer" -ForegroundColor Yellow
} else {
    # Commit
    Write-Host "💾 Création du commit..." -ForegroundColor Blue
    git commit -m $CommitMessage
    
    # Push
    Write-Host "🚀 Push sur GitHub..." -ForegroundColor Green
    try {
        git push -u origin main
        Write-Host "`n✅ Push réussi!" -ForegroundColor Green
        Write-Host "`n🎉 Votre code est maintenant sur GitHub!" -ForegroundColor Cyan
    } catch {
        Write-Host "`n❌ Erreur lors du push" -ForegroundColor Red
        Write-Host "`nCauses possibles:" -ForegroundColor Yellow
        Write-Host "1. Authentification GitHub non configurée" -ForegroundColor White
        Write-Host "2. Token/credentials expirés" -ForegroundColor White
        Write-Host ""
        Write-Host "Solutions:" -ForegroundColor Yellow
        Write-Host "1. Installez GitHub CLI: winget install GitHub.cli" -ForegroundColor White
        Write-Host "2. Authentifiez-vous: gh auth login" -ForegroundColor White
        Write-Host "3. Ou utilisez un Personal Access Token" -ForegroundColor White
        exit 1
    }
}

Write-Host "`n📝 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Allez sur Vercel.com" -ForegroundColor White
Write-Host "2. Importez votre repository GitHub" -ForegroundColor White
Write-Host "3. Configurez les variables d'environnement" -ForegroundColor White
Write-Host "4. Déployez!" -ForegroundColor White
