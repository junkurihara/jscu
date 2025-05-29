#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("Updating package.json test scripts to use Vitest...\n");

// Get all package directories
const packagesDir = path.join(__dirname, "..", "packages");
const packageDirs = fs.readdirSync(packagesDir).filter((dir) => {
  const packageJsonPath = path.join(packagesDir, dir, "package.json");
  return fs.existsSync(packageJsonPath);
});

packageDirs.forEach((packageName) => {
  const packageJsonPath = path.join(packagesDir, packageName, "package.json");

  console.log(`Processing: ${packageName}`);

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    // Update the test script to use vitest instead of jest
    if (packageJson.scripts && packageJson.scripts.test) {
      if (packageJson.scripts.test.includes("jest")) {
        packageJson.scripts.test = "vitest run";
        console.log(`  ✓ Updated test script from Jest to Vitest`);

        // Write back the updated package.json
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
      } else {
        console.log(`  - Test script already updated or not using Jest`);
      }
    } else {
      console.log(`  - No test script found`);
    }
  } catch (error) {
    console.log(`  ✗ Error processing ${packageName}: ${error.message}`);
  }
});

console.log("\n✅ All package.json test scripts updated!");
