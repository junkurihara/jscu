#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("Final fix for all prepare.ts files...\n");

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

  // Check if it already has the correct structure
  if (
    content.includes('console.log(typeof process !== "undefined" ? process.env.TEST_ENV : "browser");') &&
    content.includes("if (typeof process !== \"undefined\" && process.env.TEST_ENV === 'window')")
  ) {
    console.log(`  ✓ Already fixed`);
    return;
  }

  // Create the complete fixed prepare.ts content
  const fixedContent = `/**
 * prepare.ts
 */

// Get library name from package name
function getLibraryName() {
  const packageName = '${packageName}';
  // Convert package name to library name (e.g., js-crypto-hash -> jscu)
  return 'jscu'; // Default library name
}

export const getTestEnv = async () => {
  let envName;
  let message;
  let library;
  console.log(typeof process !== "undefined" ? process.env.TEST_ENV : "browser");

  if (typeof process !== "undefined" && process.env.TEST_ENV === 'window'){
    if(typeof window !== 'undefined' && typeof (<any>window)[getLibraryName()] !== 'undefined'){
      envName = 'Window';
      library = (<any>window)[getLibraryName()];
      message = '**This is a test with a library imported from window.**';
    }
    else throw new Error('The library is not loaded in window object.');
  }
  else {
    envName = 'Source';
    library = await import('../src/index');
    message = '**This is a test with source codes in src.**';
  }

  return {library, envName, message};
};
`;

  fs.writeFileSync(preparePath, fixedContent);
  console.log(`  ✓ Fixed and standardized`);
});

console.log("\n✅ All prepare.ts files standardized!");
