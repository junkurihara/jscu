#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("Fixing prepare.ts files for browser process variable...\n");

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

  // Replace process.env access with safe browser-compatible checks
  content = content.replace(
    /console\.log\(process\.env\.TEST_ENV\);/g,
    'console.log(typeof process !== "undefined" ? process.env.TEST_ENV : "browser");'
  );

  content = content.replace(
    /if \(process\.env\.TEST_ENV === 'window'\)/g,
    'if (typeof process !== "undefined" && process.env.TEST_ENV === "window") {\n    // In browser environment, try to get library from window\n  } else if (typeof window !== "undefined")'
  );

  // Fix the window library access logic
  content = content.replace(
    /if \(typeof process !== "undefined" && process\.env\.TEST_ENV === "window"\) \{\s*\/\/ In browser environment, try to get library from window\s*\} else if \(typeof window !== "undefined"\)\{\s*if\(typeof window !== 'undefined' && typeof \(\<any\>window\)\[getLibraryName\(\)\] !== 'undefined'\)\{/g,
    'if (typeof window !== "undefined" && typeof (<any>window)[getLibraryName()] !== "undefined") {'
  );

  fs.writeFileSync(preparePath, content);
  console.log(`  ✓ Fixed process variable for browser`);
});

console.log("\n✅ All prepare.ts files updated for browser process compatibility!");
