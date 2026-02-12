# Script pour vérifier que tout est bien configuré (PowerShell)
# Usage: .\scripts\check-setup.ps1

Write-Host "🔍 Vérification de la Configuration" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

$Errors = 0

# Vérifier Git
Write-Host -NoNewline "Vérification Git... "
if (Test-Path ".git") {
    Write-Host "✅" -ForegroundColor Green
} else {
    Write-Host "❌ Git non initialisé" -ForegroundColor Red
    $Errors++
}

# Vérifier remote GitHub
Write-Host -NoNewline "Vérification remote GitHub... "
try {
    $remote = git remote get-url origin 2>$null
    if ($remote) {
        Write-Host "✅" -ForegroundColor Green
        Write-Host "   Remote: $remote" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  Remote GitHub non configuré" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Remote GitHub non configuré" -ForegroundColor Yellow
}

# Vérifier .env
Write-Host -NoNewline "Vérification .env... "
if (Test-Path ".env") {
    Write-Host "✅" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env non trouvé (normal si vous utilisez Vercel env vars)" -ForegroundColor Yellow
}

# Vérifier Vercel CLI
Write-Host -NoNewline "Vérification Vercel CLI... "
try {
    $null = vercel whoami 2>$null
    Write-Host "✅" -ForegroundColor Green
    $user = vercel whoami 2>$null
    Write-Host "   Connecté en tant que: $user" -ForegroundColor Gray
} catch {
    if (Get-Command vercel -ErrorAction SilentlyContinue) {
        Write-Host "⚠️  Non connecté (exécutez: vercel login)" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  Vercel CLI non installé" -ForegroundColor Yellow
    }
}

# Vérifier projet Vercel lié
Write-Host -NoNewline "Vérification projet Vercel... "
if (Test-Path ".vercel/project.json") {
    Write-Host "✅" -ForegroundColor Green
    $project = Get-Content ".vercel/project.json" | ConvertFrom-Json
    Write-Host "   Projet ID: $($project.projectId)" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Projet non lié (exécutez: vercel link)" -ForegroundColor Yellow
}

# Vérifier Prisma
Write-Host -NoNewline "Vérification Prisma... "
if (Get-Command npx -ErrorAction SilentlyContinue) {
    Write-Host "✅" -ForegroundColor Green
} else {
    Write-Host "❌ npm/npx non trouvé" -ForegroundColor Red
    $Errors++
}

# Vérifier node_modules
Write-Host -NoNewline "Vérification dépendances... "
if (Test-Path "node_modules") {
    Write-Host "✅" -ForegroundColor Green
} else {
    Write-Host "⚠️  Dépendances non installées (exécutez: npm install)" -ForegroundColor Yellow
}

Write-Host ""
if ($Errors -eq 0) {
    Write-Host "✅ Configuration OK!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "1. Assurez-vous que votre code est pushé sur GitHub"
    Write-Host "2. Configurez les variables d'environnement sur Vercel"
    Write-Host "3. Créez une base de données PostgreSQL"
    Write-Host "4. Déployez sur Vercel"
} else {
    Write-Host "❌ $Errors erreur(s) trouvée(s)" -ForegroundColor Red
}
