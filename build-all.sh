#!/bin/bash

# Script de build cross-platform pour WANKR
# Build macOS, Windows MSIX et Linux en une seule commande

echo "🚀 WANKR - Build Cross-Platform"
echo "================================"
echo ""

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Lancer le build cross-platform
echo "🌍 Lancement du build cross-platform..."
echo "   - macOS (portable)"
echo "   - Windows MSIX"
echo "   - Linux AppImage"
echo ""

node build.js cross

echo ""
echo "✅ Build terminé !"
echo "📁 Les fichiers sont dans le dossier 'dist'"
