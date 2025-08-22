#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function updateVersion(type = "patch") {
  try {
    log(`🔄 Bumping version (${type})...`, "yellow");
    execSync(`npm version ${type} --no-git-tag-version`, { stdio: "inherit" });

    // Read the new version
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    const newVersion = packageJson.version;
    log(`✅ Version bumped to ${newVersion}`, "green");

    return newVersion;
  } catch (error) {
    log(`❌ Failed to bump version: ${error.message}`, "red");
    process.exit(1);
  }
}

function updateManifestVersion(version) {
  try {
    log("📝 Updating appxmanifest.xml version...", "yellow");

    const manifestPath = "appxmanifest.xml";
    let manifest = fs.readFileSync(manifestPath, "utf8");

    // Update version in manifest
    manifest = manifest.replace(/Version="[^"]*"/, `Version="${version}.0"`);

    fs.writeFileSync(manifestPath, manifest);
    log("✅ Manifest version updated", "green");
  } catch (error) {
    log(`❌ Failed to update manifest: ${error.message}`, "red");
  }
}

function buildApp(platform, target) {
  try {
    log(`🔨 Building ${platform} ${target}...`, "blue");

    const command = `npx electron-builder --${platform} --config.${platform}.target=${target}`;
    execSync(command, { stdio: "inherit" });

    log(`✅ ${platform} ${target} build completed!`, "green");
  } catch (error) {
    log(`❌ Build failed: ${error.message}`, "red");
    process.exit(1);
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  log("🚀 WANKR Build Script", "bright");
  log("====================", "cyan");

  switch (command) {
    case "win-msix":
      log("🎯 Building Windows MSIX with version bump", "magenta");
      // Use the dedicated MSIX build script
      try {
        execSync("node build-msix.js", { stdio: "inherit" });
        log("✅ Windows MSIX build completed!", "green");
      } catch (error) {
        log("⚠️  MSIX build failed, falling back to portable...", "yellow");
        buildApp("win", "portable");
      }
      break;

    case "win":
      log("🎯 Building Windows Portable with version bump", "magenta");
      updateVersion("patch");
      buildApp("win", "portable");
      break;

    case "mac":
      log("🎯 Building macOS with version bump", "magenta");
      updateVersion("patch");
      buildApp("mac", "dir");
      break;

    case "linux":
      log("🎯 Building Linux with version bump", "magenta");
      updateVersion("patch");
      buildApp("linux", "AppImage");
      break;

    case "all":
      log("🎯 Building all platforms with version bump", "magenta");
      updateVersion("patch");
      updateManifestVersion(
        JSON.parse(fs.readFileSync("package.json", "utf8")).version
      );
      buildApp("win", "portable");
      // Use the dedicated MSIX build script for Windows
      try {
        execSync("node build-msix.js", { stdio: "inherit" });
        log("✅ Windows MSIX build completed!", "green");
      } catch (error) {
        log("⚠️  MSIX build failed, continuing with other builds...", "yellow");
      }
      buildApp("mac", "dir");
      buildApp("linux", "AppImage");
      break;

    case "cross":
      log(
        "🌍 Building cross-platform (macOS, Windows MSIX, Linux) with version bump",
        "magenta"
      );
      updateVersion("patch");
      updateManifestVersion(
        JSON.parse(fs.readFileSync("package.json", "utf8")).version
      );
      buildApp("mac", "dir");
      // Use the dedicated MSIX build script for Windows
      try {
        execSync("node build-msix.js", { stdio: "inherit" });
        log("✅ Windows MSIX build completed!", "green");
      } catch (error) {
        log("⚠️  MSIX build failed, falling back to portable...", "yellow");
        buildApp("win", "portable");
      }
      buildApp("linux", "AppImage");
      break;

    case "version":
      const versionType = args[1] || "patch";
      log(`🎯 Bumping version (${versionType})`, "magenta");
      updateVersion(versionType);
      updateManifestVersion(
        JSON.parse(fs.readFileSync("package.json", "utf8")).version
      );
      break;

    default:
      log("❌ Unknown command", "red");
      log("Available commands:", "yellow");
      log(
        "  node build.js win-msix  - Build Windows MSIX with version bump",
        "cyan"
      );
      log(
        "  node build.js win       - Build Windows Portable with version bump",
        "cyan"
      );
      log("  node build.js mac       - Build macOS with version bump", "cyan");
      log("  node build.js linux     - Build Linux with version bump", "cyan");
      log(
        "  node build.js all       - Build all platforms with version bump",
        "cyan"
      );
      log(
        "  node build.js cross     - Build macOS, Windows MSIX, Linux with version bump",
        "cyan"
      );
      log(
        "  node build.js version [patch|minor|major] - Bump version only",
        "cyan"
      );
      process.exit(1);
  }

  log("🎉 Build process completed successfully!", "green");
}

main();
