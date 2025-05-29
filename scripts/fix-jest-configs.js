#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Get all package directories
const packagesDir = path.join(__dirname, "..", "packages");
const packageDirs = fs.readdirSync(packagesDir).filter((dir) => {
  const jestConfigPath = path.join(packagesDir, dir, "jest.config.js");
  return fs.existsSync(jestConfigPath);
});

console.log('Fixing Jest configurations to remove invalid "name" property...\n');

packageDirs.forEach((packageName) => {
  const packagePath = path.join(packagesDir, packageName);
  const jestConfigPath = path.join(packagePath, "jest.config.js");

  console.log(`Processing: ${packageName}`);

  let configContent = fs.readFileSync(jestConfigPath, "utf8");

  // Remove the name property line
  configContent = configContent.replace(/\s*name:\s*['"][^'"]*['"],?\s*\n/g, "\n");

  // Clean up any extra commas that might be left
  configContent = configContent.replace(/,(\s*})/g, "$1");

  fs.writeFileSync(jestConfigPath, configContent);
  console.log(`  ✓ Fixed jest.config.js`);
});

console.log("\n✅ All Jest configurations fixed!");
