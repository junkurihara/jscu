#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("Fixing prepare.ts files for browser compatibility...\n");

// Get all package directories
const packagesDir = path.join(__dirname, "..", "packages");
const packageDirs = fs.readdirSync(packagesDir).filter((dir) => {
  const preparePath = path.join(packagesDir, dir, "test", "prepare.ts");
  return fs.existsSync(preparePath);
});

packageDirs.forEach((packageName) => {
  const preparePath = path.join(packagesDir, packageName, "test", "prepare.ts");

  console.log(`Processing: ${packageName}`);

  let content = fs.readFileSync(preparePath, "utf8");

  // Remove webpack.config.base require and replace with a simple check
  content = content.replace(/const base = require\('\.\.\/webpack\.config\.base'\);\s*/g, "");

  // Replace webpack base.libName usage with a fallback
  content = content.replace(/\(\<any\>window\)\[base\.libName\]/g, "(<any>window)[getLibraryName()]");

  // Add a simple library name getter function
  if (content.includes("getLibraryName()")) {
    const functionDef = `
// Get library name from package name
function getLibraryName() {
  const packageName = '${packageName}';
  // Convert package name to library name (e.g., js-crypto-hash -> jscu)
  return 'jscu'; // Default library name
}

`;
    content = content.replace(/export const getTestEnv/, functionDef + "export const getTestEnv");
  }

  fs.writeFileSync(preparePath, content);
  console.log(`  ✓ Fixed browser compatibility`);
});

console.log("\n✅ All prepare.ts files updated for browser compatibility!");
