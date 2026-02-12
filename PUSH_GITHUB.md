# 🚀 Push sur GitHub - Guide Simple

## Option 1: Via GitHub Desktop (Le plus simple)

1. **Téléchargez GitHub Desktop**: [desktop.github.com](https://desktop.github.com)
2. **Installez et connectez-vous** avec votre compte GitHub
3. **Ajoutez votre dossier**:
   - File → Add Local Repository
   - Sélectionnez `C:\Users\hourr\Desktop\clips`
4. **Créez le commit**:
   - Écrivez un message: "Initial commit: ClipMarket platform"
   - Cliquez "Commit to main"
5. **Publiez sur GitHub**:
   - Cliquez "Publish repository"
   - Choisissez un nom (ex: `clipmarket`)
   - Cliquez "Publish"

✅ **C'est fait!** Votre code est sur GitHub.

## Option 2: Via l'interface GitHub (Sans Git)

1. **Allez sur GitHub.com** et créez un nouveau repository:
   - Cliquez "+" → "New repository"
   - Nom: `clipmarket`
   - Public ou Private
   - **Ne cochez PAS** "Initialize with README"
   - Cliquez "Create repository"

2. **Upload vos fichiers**:
   - GitHub vous montrera des instructions
   - Cliquez "uploading an existing file"
   - Glissez-déposez tous les fichiers de `C:\Users\hourr\Desktop\clips`
   - Cliquez "Commit changes"

✅ **C'est fait!**

## Option 3: Via Git en ligne de commande

### Si Git n'est pas installé:

1. **Installez Git**: [git-scm.com/download/win](https://git-scm.com/download/win)
2. **Redémarrez votre terminal** après l'installation

### Commandes à exécuter:

```powershell
# 1. Aller dans le dossier
cd C:\Users\hourr\Desktop\clips

# 2. Initialiser Git (si pas déjà fait)
git init
git branch -M main

# 3. Créer un repository sur GitHub.com d'abord, puis:
git remote add origin https://github.com/VOTRE-USERNAME/clipmarket.git

# 4. Ajouter tous les fichiers
git add .

# 5. Créer le commit
git commit -m "Initial commit: ClipMarket platform"

# 6. Push sur GitHub
git push -u origin main
```

## Option 4: Utiliser le script automatique

Si Git est installé, vous pouvez utiliser le script:

```powershell
.\scripts\push-to-github.ps1
```

Le script vous guidera étape par étape.

## 📝 Après le push sur GitHub

Une fois votre code sur GitHub:

1. **Allez sur Vercel.com**
2. **Cliquez "Add New Project"**
3. **Importez votre repository** `clipmarket`
4. **Configurez les variables d'environnement** (voir VERCEL_SETUP.md)
5. **Cliquez "Deploy"**

Vercel déploiera automatiquement votre application! 🎉

## 🔗 Liens Utiles

- [GitHub Desktop](https://desktop.github.com) - Interface graphique
- [Git pour Windows](https://git-scm.com/download/win) - Ligne de commande
- [Créer un repo GitHub](https://github.com/new) - Créer un nouveau repository
