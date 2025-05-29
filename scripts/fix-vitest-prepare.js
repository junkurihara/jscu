#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Get all package directories
const packagesDir = path.join(__dirname, "..", "packages");
const packageDirs = fs.readdirSync(packagesDir).filter((dir) => {
  const preparePath = path.join(packagesDir, dir, "test", "prepare.ts");
  return fs.existsSync(preparePath);
});

console.log("Fixing prepare.ts files for Vitest compatibility...\n");

packageDirs.forEach((packageName) => {
  const preparePath = path.join(packagesDir, packageName, "test", "prepare.ts");

  if (packageName === "js-crypto-random" || packageName === "js-crypto-hash") {
    console.log(`✓ ${packageName} - Already fixed`);
    return;
  }

  console.log(`Processing: ${packageName}`);

  let content = fs.readFileSync(preparePath, "utf8");

  // Make getTestEnv async
  content = content.replace(/export const getTestEnv = \(\) => {/g, "export const getTestEnv = async () => {");

  // Replace require with dynamic import
  content = content.replace(/library = require\('\.\.\/src\/index'\);/g, "library = await import('../src/index');");

  fs.writeFileSync(preparePath, content);
  console.log(`  ✓ Fixed prepare.ts`);
});

console.log("\n✅ All prepare.ts files updated for async imports!");
