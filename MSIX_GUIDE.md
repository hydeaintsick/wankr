# 🎯 WANKR - Guide MSIX Windows

Ce guide explique comment créer des packages MSIX pour Windows avec WANKR.

## 🚀 Build MSIX

### Option 1: Script Dédié MSIX

```bash
node build-msix.js
```

### Option 2: Via npm

```bash
npm run build:msix
```

### Option 3: Build Cross-Platform avec MSIX

```bash
node build.js cross
```

## ⚠️ Important : MSIX Requiert Windows

**Le build MSIX ne fonctionne que sur Windows** car il nécessite :

- `makeappx.exe` (Windows SDK)
- `signtool.exe` (Windows SDK)
- Certificats Windows

### Sur macOS/Linux

Le script détecte automatiquement qu'il n'est pas sur Windows et :

- ✅ Build le Windows portable (.exe) à la place
- ✅ Affiche un avertissement informatif
- ✅ Continue le processus normalement

## 🎯 Fonctionnement du Script MSIX

### 1. Bump de Version

- Incrémente automatiquement la version (patch)
- Met à jour `package.json`
- Met à jour `appxmanifest.xml`

### 2. Build Windows App

- Crée l'application Windows portable
- Utilise electron-builder
- Génère `dist/win-arm64-unpacked/`

### 3. Création MSIX (Windows uniquement)

- Copie le manifest dans le dossier unpacked
- Utilise `makeappx pack` pour créer le MSIX
- Génère `dist/wankr.msix`

## 📦 Formats de Sortie

### Sur Windows

```
dist/
├── wankr.msix              # Package MSIX
├── wankr.exe               # Portable (fallback)
└── win-arm64-unpacked/     # Dossier unpacked
```

### Sur macOS/Linux

```
dist/
├── wankr.exe               # Portable Windows
└── win-arm64-unpacked/     # Dossier unpacked
```

## 🔧 Configuration MSIX

Le package MSIX est configuré avec :

```xml
<!-- appxmanifest.xml -->
<Identity Name="com.example.wankr"
          Publisher="CN=Your Name"
          Version="1.0.x.0" />

<Properties>
  <DisplayName>wankr</DisplayName>
  <PublisherDisplayName>Your Name</PublisherDisplayName>
  <Description>WANKR - Everyday is a holiday</Description>
</Properties>

<Capabilities>
  <rescap:Capability Name="runFullTrust" />
</Capabilities>
```

## 🎨 Personnalisation

### Modifier le Publisher

```xml
<Identity Publisher="CN=Votre Nom" />
<Properties>
  <PublisherDisplayName>Votre Nom</PublisherDisplayName>
</Properties>
```

### Modifier les Capacités

```xml
<Capabilities>
  <rescap:Capability Name="runFullTrust" />
  <uap:Capability Name="internetClient" />
</Capabilities>
```

### Modifier l'App ID

```xml
<Applications>
  <Application Id="votre-app-id"
               Executable="wankr.exe"
               EntryPoint="Windows.FullTrustApplication">
```

## 🔐 Signing MSIX

### Développement (Self-Signed)

```powershell
# Créer un certificat auto-signé
New-SelfSignedCertificate -Type Custom -Subject "CN=Votre Nom" -KeyUsage DigitalSignature -FriendlyName "WANKR Certificate" -CertStoreLocation "Cert:\CurrentUser\My" -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.3", "2.5.29.19={text}")

# Signer le MSIX
$cert = Get-ChildItem -Path Cert:\CurrentUser\My -CodeSigningCert
SignTool sign /fd SHA256 /f $cert.PSPath "dist\wankr.msix"
```

### Production (Certificat CA)

```powershell
# Signer avec un certificat de production
SignTool sign /fd SHA256 /f "certificat.pfx" /p "mot-de-passe" "dist\wankr.msix"
```

## 📱 Installation MSIX

### Développement

```powershell
Add-AppxPackage -Path "dist\wankr.msix"
```

### Désinstallation

```powershell
Get-AppxPackage -Name "com.example.wankr" | Remove-AppxPackage
```

## 🏪 Microsoft Store

Pour publier sur le Microsoft Store :

1. **Créer un compte Partner Center**
2. **Créer une nouvelle app**
3. **Uploader le MSIX signé**
4. **Remplir les métadonnées**
5. **Soumettre pour review**

## 🔍 Dépannage

### Erreurs Communes

**"makeappx not found"**

- Installer Windows SDK
- Ajouter `makeappx.exe` au PATH

**"Certificate not trusted"**

- Installer le certificat dans Trusted Root
- Utiliser un certificat CA pour la production

**"App won't start"**

- Vérifier les capacités dans le manifest
- Vérifier les permissions Windows

### Debug

```powershell
# Vérifier le manifest
Get-AppxPackage -Name "com.example.wankr" | Get-AppxPackageManifest

# Voir les logs
Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-AppXDeployment-Server/Operational'}
```

## 🎉 Avantages MSIX

- ✅ **Installation moderne** Windows
- ✅ **Mises à jour automatiques**
- ✅ **Sécurité renforcée**
- ✅ **Distribution facile**
- ✅ **Microsoft Store ready**

## 📋 Checklist MSIX

- [ ] Windows SDK installé
- [ ] Certificat de signature configuré
- [ ] Manifest personnalisé
- [ ] Test sur Windows
- [ ] Signing du package
- [ ] Test d'installation

---

**Note** : Le script MSIX est intelligent et s'adapte automatiquement à votre plateforme. Sur macOS/Linux, il crée un Windows portable, sur Windows il crée un vrai MSIX ! 🎯
