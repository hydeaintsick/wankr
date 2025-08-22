# WANKR MSIX Build Guide

This guide will help you build and sign a beautiful MSIX package for Windows.

## Prerequisites

1. **Windows 10/11** (MSIX builds work best on Windows)
2. **Node.js** (v16 or higher)
3. **Electron Builder** (already installed)
4. **Windows App SDK** (for advanced MSIX features)

## Building the MSIX Package

### Smart Build System

The project includes a smart build system that automatically:

- ✅ Bumps version numbers (patch, minor, or major)
- ✅ Updates appxmanifest.xml version
- ✅ Ensures consistent app naming ("wankr")
- ✅ Provides colored console output
- ✅ Handles errors gracefully

**Available smart build commands:**

```bash
# Windows MSIX with version bump
npm run build:win-msix-smart

# Windows Portable with version bump
npm run build:win-smart

# macOS with version bump
npm run build:mac-smart

# Linux with version bump
npm run build:linux-smart

# All platforms with version bump
npm run build:all-smart

# Version bump only
npm run version-bump
```

### 1. Install Dependencies

```bash
npm install
```

### 2. Build MSIX Package

**Option A: Simple build (no version bump)**

```bash
npm run build:win-msix
```

**Option B: Smart build with automatic version bump (recommended)**

```bash
npm run build:win-msix-smart
# or
node build.js win-msix
```

This will create an unsigned MSIX package in the `dist` folder.

## Signing the MSIX Package

### Option 1: Self-Signed Certificate (Development/Testing)

1. **Create a self-signed certificate:**

```powershell
New-SelfSignedCertificate -Type Custom -Subject "CN=Your Name" -KeyUsage DigitalSignature -FriendlyName "WANKR Certificate" -CertStoreLocation "Cert:\CurrentUser\My" -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.3", "2.5.29.19={text}")
```

2. **Sign the MSIX package:**

```powershell
$cert = Get-ChildItem -Path Cert:\CurrentUser\My -CodeSigningCert
$msixPath = ".\dist\win-unpacked\WANKR.msix"
SignTool sign /fd SHA256 /f $cert.PSPath $msixPath
```

### Option 2: Code Signing Certificate (Production)

For production distribution, you'll need a code signing certificate from a trusted Certificate Authority (CA).

1. **Purchase a code signing certificate** from providers like:

   - DigiCert
   - Sectigo
   - GlobalSign
   - Comodo

2. **Sign the package:**

```powershell
SignTool sign /fd SHA256 /f "path\to\your\certificate.pfx" /p "your-password" ".\dist\win-unpacked\WANKR.msix"
```

## Installing the MSIX Package

### Development Installation

```powershell
Add-AppxPackage -Path ".\dist\win-unpacked\WANKR.msix"
```

### Uninstalling

```powershell
Get-AppxPackage -Name "com.example.wankr" | Remove-AppxPackage
```

## Publishing to Microsoft Store

1. **Create a Microsoft Partner Center account**
2. **Create a new app submission**
3. **Upload your signed MSIX package**
4. **Fill in app metadata and screenshots**
5. **Submit for review**

## Customization

### Update App Metadata

Edit `package.json` in the `msix` section:

```json
"msix": {
  "identityName": "com.example.wankr",
  "publisher": "CN=Your Name",
  "publisherDisplayName": "Your Name",
  "applicationId": "Wankr",
  "displayName": "WANKR",
  "description": "WANKR - Everyday is a holiday"
}
```

### Update Visual Assets

Replace the icon files in the `assets` folder:

- `icon.ico` - Windows icon
- `icon.png` - MSIX package icon
- Create different sizes: 44x44, 150x150, 310x150

### Update Manifest

Edit `appxmanifest.xml` to customize:

- App name and description
- Capabilities and permissions
- Visual elements and branding

## Troubleshooting

### Common Issues

1. **"Certificate not trusted"**

   - Install the certificate in Trusted Root Certification Authorities
   - Use a trusted CA certificate for production

2. **"App won't start"**

   - Check Windows Event Viewer for errors
   - Verify all dependencies are included

3. **"Build fails"**
   - Ensure you're on Windows
   - Check that all required files are present
   - Verify Node.js and npm versions

### Debug Mode

To run the app in debug mode:

```powershell
Get-AppxPackage -Name "com.example.wankr" | Get-AppxPackageManifest
```

## Security Considerations

- MSIX packages are sandboxed by default
- Use `runFullTrust` capability only if necessary
- Consider using restricted capabilities for better security
- Always sign packages before distribution

## Distribution Options

1. **Microsoft Store** (recommended for wide distribution)
2. **Direct download** from your website
3. **Enterprise deployment** via Intune or Group Policy
4. **Side-loading** for development and testing

## Support

For issues with MSIX packaging:

- [Microsoft MSIX Documentation](https://docs.microsoft.com/en-us/windows/msix/)
- [Electron Builder MSIX Guide](https://www.electron.build/configuration/win)
- [Windows App SDK](https://docs.microsoft.com/en-us/windows/apps/windows-app-sdk/)
