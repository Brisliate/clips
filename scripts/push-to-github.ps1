# Script pour push sur GitHub
# Usage: .\scripts\push-to-github.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Push sur GitHub" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan

# Vérifier si Git est initialisé
if (-not (Test-Path ".git")) {
    Write-Host "Initialisation de Git..." -ForegroundColor Yellow
    git init
    git branch -M main
}

# Vérifier le statut
Write-Host "`nVérification du statut Git..." -ForegroundColor Blue
git status

# Demander confirmation
Write-Host ""
$confirm = Read-Host "Continuer avec le push? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Annulé." -ForegroundColor Yellow
    exit
}

# Ajouter tous les fichiers
Write-Host "`nAjout des fichiers..." -ForegroundColor Blue
git add .

# Vérifier si remote existe
try {
    $null = git remote get-url origin 2>$null
    $hasRemote = $true
} catch {
    $hasRemote = $false
}

if (-not $hasRemote) {
    Write-Host "`n⚠️  Remote GitHub non configuré" -ForegroundColor Yellow
    $repoUrl = Read-Host "Entrez l'URL de votre repository GitHub (ex: https://github.com/username/clipmarket.git)"
    git remote add origin $repoUrl
}

# Commit
Write-Host "`nCréation du commit..." -ForegroundColor Blue
$commitMsg = Read-Host "Message de commit (défaut: Initial commit: ClipMarket platform)"
if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    $commitMsg = "Initial commit: ClipMarket platform"
}

try {
    git commit -m $commitMsg
} catch {
    Write-Host "Aucun changement à committer" -ForegroundColor Yellow
}

# Push
Write-Host "`nPush sur GitHub..." -ForegroundColor Green
try {
    git push -u origin main
    Write-Host "`n✅ Push réussi!" -ForegroundColor Green
} catch {
    Write-Host "`n⚠️  Erreur lors du push. Essayez:" -ForegroundColor Yellow
    Write-Host "   git push -u origin main --force" -ForegroundColor Gray
    Write-Host "   (Attention: --force écrase l'historique)" -ForegroundColor Red
}

Write-Host "`n🎉 Terminé! Votre code est maintenant sur GitHub." -ForegroundColor Green
Write-Host "`nProchaines étapes:" -ForegroundColor Cyan
Write-Host "1. Allez sur Vercel.com" -ForegroundColor White
Write-Host "2. Créez un nouveau projet" -ForegroundColor White
Write-Host "3. Importez votre repository GitHub" -ForegroundColor White
Write-Host "4. Configurez les variables d'environnement" -ForegroundColor White
