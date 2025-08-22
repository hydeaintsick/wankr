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

    manifest = manifest.replace(/Version="[^"]*"/, `Version="${version}.0"`);

    fs.writeFileSync(manifestPath, manifest);
    log("✅ Manifest version updated", "green");
  } catch (error) {
    log(`❌ Failed to update manifest: ${error.message}`, "red");
  }
}

function buildMSIX() {
  try {
    log("🔨 Building Windows MSIX package...", "blue");

    // First build the Windows app
    log("📦 Building Windows app first...", "yellow");
    execSync("npx electron-builder --win --config.win.target=portable", {
      stdio: "inherit",
    });

    // Check if we're on Windows
    if (process.platform !== "win32") {
      log(
        "⚠️  MSIX build requires Windows. Building portable instead.",
        "yellow"
      );
      log("✅ Windows portable build completed!", "green");
      return;
    }

    // Create MSIX package using makeappx (Windows only)
    log("🎯 Creating MSIX package...", "yellow");
    const winUnpackedPath = path.join("dist", "win-arm64-unpacked");
    const msixOutputPath = path.join("dist", "wankr.msix");

    if (!fs.existsSync(winUnpackedPath)) {
      throw new Error("Windows unpacked directory not found");
    }

    // Copy manifest to the unpacked directory
    const manifestDest = path.join(winUnpackedPath, "AppxManifest.xml");
    fs.copyFileSync("appxmanifest.xml", manifestDest);

    // Create MSIX package
    const makeappxCommand = `makeappx pack /d "${winUnpackedPath}" /p "${msixOutputPath}"`;
    execSync(makeappxCommand, { stdio: "inherit" });

    log("✅ MSIX package created successfully!", "green");
  } catch (error) {
    log(`❌ MSIX build failed: ${error.message}`, "red");
    log("⚠️  Falling back to portable build...", "yellow");

    try {
      execSync("npx electron-builder --win --config.win.target=portable", {
        stdio: "inherit",
      });
      log("✅ Windows portable build completed!", "green");
    } catch (fallbackError) {
      log(`❌ Fallback build also failed: ${fallbackError.message}`, "red");
      process.exit(1);
    }
  }
}

function main() {
  log("🚀 WANKR MSIX Build Script", "bright");
  log("==========================", "cyan");

  const version = updateVersion("patch");
  updateManifestVersion(version);
  buildMSIX();

  log("🎉 MSIX build process completed!", "green");
}

main();
