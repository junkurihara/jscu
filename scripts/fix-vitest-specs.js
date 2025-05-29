#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const glob = require("glob");

console.log("Fixing test spec files for async getTestEnv...\n");

// Find all .spec.ts files in test directories
const specFiles = glob.sync("packages/*/test/*.spec.ts");

specFiles.forEach((filePath) => {
  console.log(`Processing: ${filePath}`);

  let content = fs.readFileSync(filePath, "utf8");

  // Check if it uses getTestEnv pattern
  if (!content.includes("getTestEnv()") && !content.includes("getTestEnv();")) {
    console.log(`  → Skipped (doesn't use getTestEnv)`);
    return;
  }

  // Skip if already has beforeAll with getTestEnv
  if (content.includes("await getTestEnv()")) {
    console.log(`  → Skipped (already fixed)`);
    return;
  }

  // Extract the pattern to determine variable names
  const envMatch = content.match(
    /const env = getTestEnv\(\);?\s*const (\w+) = env\.library;\s*const (\w+) = env\.envName;/
  );
  if (!envMatch) {
    console.log(`  → Skipped (different pattern)`);
    return;
  }

  const libraryVar = envMatch[1];
  const envNameVar = envMatch[2];

  // Replace the synchronous pattern with async beforeAll pattern
  content = content.replace(
    /import \{getTestEnv\} from '\.\/prepare';\s*const env = getTestEnv\(\);?\s*const \w+ = env\.library;\s*const \w+ = env\.envName;\s*/,
    `import {getTestEnv} from './prepare';\n\n`
  );

  // Update describe block to remove envName interpolation and add beforeAll
  content = content.replace(/describe\(`\$\{envName\}:\s*([^`]+)`\s*,\s*\(\)\s*=>\s*\{/, (match, testDescription) => {
    return `describe('${testDescription}', () => {
  let ${libraryVar}: any;
  let ${envNameVar}: string;

  beforeAll(async () => {
    const env = await getTestEnv();
    ${libraryVar} = env.library;
    ${envNameVar} = env.envName;
  });
`;
  });

  fs.writeFileSync(filePath, content);
  console.log(`  ✓ Fixed async getTestEnv pattern`);
});

console.log("\n✅ All test spec files updated!");
