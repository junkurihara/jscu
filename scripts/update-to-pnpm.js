#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Get all package directories
const packagesDir = path.join(__dirname, "..", "packages");
const packageDirs = fs.readdirSync(packagesDir).filter((dir) => {
  const packageJsonPath = path.join(packagesDir, dir, "package.json");
  return fs.existsSync(packageJsonPath);
});

console.log("Updating all packages to use pnpm instead of yarn...\n");

packageDirs.forEach((packageName) => {
  const packagePath = path.join(packagesDir, packageName);
  const packageJsonPath = path.join(packagePath, "package.json");

  console.log(`Processing: ${packageName}`);

  // Update package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  // Update scripts to use pnpm instead of yarn
  if (packageJson.scripts) {
    Object.keys(packageJson.scripts).forEach((scriptName) => {
      if (packageJson.scripts[scriptName].includes("yarn ")) {
        packageJson.scripts[scriptName] = packageJson.scripts[scriptName].replace(/yarn /g, "pnpm ");
      }
    });
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
  console.log(`  ✓ Updated scripts to use pnpm`);
});

console.log("\n✅ All packages updated to use pnpm!");
