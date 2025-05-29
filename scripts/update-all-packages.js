#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Get all package directories
const packagesDir = path.join(__dirname, "..", "packages");
const packageDirs = fs.readdirSync(packagesDir).filter((dir) => {
  const packageJsonPath = path.join(packagesDir, dir, "package.json");
  return fs.existsSync(packageJsonPath);
});

console.log("Updating all packages for Node.js 24 + Vitest...\n");

packageDirs.forEach((packageName) => {
  const packagePath = path.join(packagesDir, packageName);
  const packageJsonPath = path.join(packagePath, "package.json");

  console.log(`Processing: ${packageName}`);

  // 1. Update package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  // Ensure Node.js 24 engine requirement
  packageJson.engines = {
    node: ">=24.0.0",
  };

  // Update scripts for consistency
  if (packageJson.scripts) {
    // Ensure vitest scripts are present
    packageJson.scripts.vitest = "vitest run";
    packageJson.scripts["vitest:browser"] = "vitest run --config ./vitest.browser.config.js";
    packageJson.scripts["vitest:watch"] = "vitest";
    packageJson.scripts["vitest:ui"] = "vitest --ui";
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");

  // 2. Create individual Vitest config for Node.js tests
  const vitestConfigPath = path.join(packagePath, "vitest.config.js");
  const vitestConfig = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/test/**/*.spec.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['test/**/*', '**/*.d.ts', '**/*.spec.ts'],
      reportsDirectory: 'coverage/vitest'
    }
  }
});
`;
  fs.writeFileSync(vitestConfigPath, vitestConfig);

  // 3. Create individual Vitest browser config
  const vitestBrowserConfigPath = path.join(packagePath, "vitest.browser.config.js");
  const vitestBrowserConfig = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
      headless: true,
      screenshotOnFailure: false
    },
    include: ['**/test/**/*.spec.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['test/**/*', '**/*.d.ts', '**/*.spec.ts'],
      reportsDirectory: 'coverage/vitest-browser'
    },
    testTimeout: 30000,
    setupFiles: ['./test/setup-browser.ts']
  },
  resolve: {
    conditions: ['browser', 'default']
  }
});
`;
  fs.writeFileSync(vitestBrowserConfigPath, vitestBrowserConfig);

  // 4. Create browser setup file if it doesn't exist
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

  console.log(`  ✓ Updated package.json`);
  console.log(`  ✓ Created vitest.config.js`);
  console.log(`  ✓ Created vitest.browser.config.js`);
  console.log(`  ✓ Ensured browser setup file exists`);
});

console.log("\n✅ All packages updated successfully!");
console.log("\nPackages are now configured for:");
console.log("- Node.js 24+ support");
console.log("- Vitest for both Node.js and browser testing");
console.log("- Individual and Lerna-managed test execution");
