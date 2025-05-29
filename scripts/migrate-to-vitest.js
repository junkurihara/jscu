#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Function to strip JSON comments for parsing
function parseJsonWithComments(content) {
  // Remove single-line comments
  content = content.replace(/\/\/.*$/gm, "");
  // Remove multi-line comments
  content = content.replace(/\/\*[\s\S]*?\*\//g, "");
  // Remove trailing commas
  content = content.replace(/,(\s*[}\]])/g, "$1");
  return JSON.parse(content);
}

// Get all package directories
const packagesDir = path.join(__dirname, "..", "packages");
const packageDirs = fs.readdirSync(packagesDir).filter((dir) => {
  const packageJsonPath = path.join(packagesDir, dir, "package.json");
  return fs.existsSync(packageJsonPath);
});

console.log("Migrating packages to Vitest and Node.js 24 support...\n");

packageDirs.forEach((packageName) => {
  const packagePath = path.join(packagesDir, packageName);
  const packageJsonPath = path.join(packagePath, "package.json");

  console.log(`Processing: ${packageName}`);

  // Update package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  // Add Node.js 24 engine requirement
  packageJson.engines = {
    node: ">=24.0.0",
  };

  // Update scripts
  if (packageJson.scripts) {
    // Replace karma scripts with vitest
    if (packageJson.scripts.karma) {
      packageJson.scripts.vitest = "vitest run --config ../../vitest.config.base.js";
      delete packageJson.scripts.karma;
    }

    if (packageJson.scripts["karma:window"]) {
      packageJson.scripts["vitest:browser"] = "vitest run --config ../../vitest.browser.config.js";
      delete packageJson.scripts["karma:window"];
    }
  }

  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");

  // Update tsconfig.json if it exists
  const tsconfigPath = path.join(packagePath, "tsconfig.json");
  if (fs.existsSync(tsconfigPath)) {
    try {
      const tsconfigContent = fs.readFileSync(tsconfigPath, "utf8");
      const tsconfig = parseJsonWithComments(tsconfigContent);

      if (tsconfig.compilerOptions && tsconfig.compilerOptions.types) {
        // Replace jest with vitest
        const types = tsconfig.compilerOptions.types;
        const jestIndex = types.indexOf("jest");
        if (jestIndex !== -1) {
          types[jestIndex] = "vitest/globals";
        }
      }

      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + "\n");
    } catch (error) {
      console.log(`  ⚠️  Could not parse tsconfig.json: ${error.message}`);
    }
  }

  // Create browser setup file if it doesn't exist
  const testDir = path.join(packagePath, "test");
  if (fs.existsSync(testDir)) {
    const setupBrowserPath = path.join(testDir, "setup-browser.ts");
    if (!fs.existsSync(setupBrowserPath)) {
      const setupContent = `// Browser environment setup for ${packageName}
// This file sets up the browser environment for testing

// Ensure crypto API is available (modern browsers have this by default)
if (typeof globalThis.crypto === 'undefined') {
  console.warn('WebCrypto API not available in test environment');
}

// Set up any global test utilities if needed
(globalThis as any).TEST_ENV = 'browser';

// Make this file a module
export {};
`;
      fs.writeFileSync(setupBrowserPath, setupContent);
    }
  }

  console.log(`  ✓ Updated package.json and tsconfig.json`);
  console.log(`  ✓ Added browser setup file`);
});

console.log("\n✅ Migration completed!");
console.log("\nNext steps:");
console.log("1. Run: npm install (or yarn install)");
console.log("2. Run Node.js tests: npm run test");
console.log("3. Run browser tests: npm run vitest:browser");
console.log("4. Remove karma.conf.js files manually if desired");
