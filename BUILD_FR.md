# 🚀 WANKR - Guide de Build Cross-Platform

Ce guide vous explique comment build WANKR pour macOS, Windows MSIX et Linux en une seule commande.

## 🎯 Scripts de Build Disponibles

### 🌍 Build Cross-Platform (Recommandé)

**Option 1: Script shell simple**

```bash
./build-all.sh
```

**Option 2: Commande npm**

```bash
npm run build:cross
```

**Option 3: Script Node.js direct**

```bash
node build.js cross
```

> **Note**: Le build Windows utilise le format portable (.exe) au lieu de MSIX pour une meilleure compatibilité.

### 📦 Builds Individuels

**macOS:**

```bash
npm run build:mac-smart
# ou
node build.js mac
```

**Windows Portable:**

```bash
npm run build:win-smart
# ou
node build.js win
```

**Linux:**

```bash
npm run build:linux-smart
# ou
node build.js linux
```

## ✨ Fonctionnalités du Script

Le script de build automatise :

- ✅ **Bump de version** automatique (patch)
- ✅ **Mise à jour** du manifest MSIX
- ✅ **Nommage cohérent** ("wankr" partout)
- ✅ **Build cross-platform** en une commande
- ✅ **Sortie colorée** pour une meilleure lisibilité
- ✅ **Gestion d'erreurs** robuste

## 🎨 Formats de Sortie

### macOS

- **Format**: Dossier portable (`.app`)
- **Usage**: Peut être déplacé n'importe où
- **Installation**: Glisser-déposer dans Applications

### Windows

- **Format**: Portable (.exe)
- **Usage**: Exécutable portable Windows
- **Avantages**: Pas d'installation requise, facile à distribuer

### Linux

- **Format**: AppImage
- **Usage**: Portable, pas d'installation requise
- **Avantages**: Fonctionne sur toutes les distributions

## 📁 Structure des Fichiers de Sortie

```
dist/
├── mac-arm64/
│   └── wankr.app/          # Application macOS portable
├── win-arm64-unpacked/
│   └── wankr.exe          # Exécutable Windows portable
├── linux-arm64-unpacked/
│   └── wankr.AppImage     # AppImage Linux
└── wankr-1.0.x.exe        # Exécutable Windows portable
└── wankr-1.0.x-arm64.AppImage  # AppImage Linux
```

## 🔧 Prérequis

### Système

- **Node.js** (v16 ou supérieur)
- **npm** (inclus avec Node.js)
- **Git** (pour le versioning)

### Plateformes

- **macOS**: Build natif sur macOS
- **Windows**: Build natif sur Windows (recommandé pour MSIX)
- **Linux**: Build natif sur Linux

## 🚀 Utilisation Rapide

1. **Cloner le projet**

```bash
git clone <votre-repo>
cd wankr
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Build cross-platform**

```bash
./build-all.sh
```

4. **Trouver les fichiers**

```bash
ls -la dist/
```

## 🎛️ Commandes Avancées

### Version Bump Manuel

```bash
# Patch (1.0.0 → 1.0.1)
npm run version-bump patch

# Minor (1.0.0 → 1.1.0)
npm run version-bump minor

# Major (1.0.0 → 2.0.0)
npm run version-bump major
```

### Build Sans Bump de Version

```bash
# Build simple (pas de bump automatique)
npm run build:win-msix
npm run build:mac
npm run build:linux
```

## 🔍 Dépannage

### Erreurs Communes

**"Node.js not found"**

```bash
# Installer Node.js depuis https://nodejs.org/
```

**"Build failed"**

```bash
# Vérifier les dépendances
npm install

# Nettoyer le cache
npm cache clean --force
```

**"Permission denied"**

```bash
# Rendre le script exécutable
chmod +x build-all.sh
```

### Logs et Debug

Le script affiche des logs colorés :

- 🔄 **Jaune** : Actions en cours
- ✅ **Vert** : Succès
- ❌ **Rouge** : Erreurs
- 🔨 **Bleu** : Build en cours

## 📋 Checklist de Build

- [ ] Node.js installé
- [ ] Dépendances installées (`npm install`)
- [ ] Scripts exécutables (`chmod +x build-all.sh`)
- [ ] Connexion internet (pour télécharger les dépendances)
- [ ] Espace disque suffisant (environ 500MB)

## 🎉 Résultat

Après un build réussi, vous aurez :

- **wankr.app** pour macOS (dossier portable)
- **wankr.exe** pour Windows (exécutable portable)
- **wankr.AppImage** pour Linux (AppImage portable)

Tous les fichiers seront dans le dossier `dist/` avec le nom "wankr" et la version mise à jour automatiquement !
