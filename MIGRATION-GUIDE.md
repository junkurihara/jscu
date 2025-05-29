# Migration to Node.js 24 and Vitest

This document outlines the migration from Karma to Vitest for browser testing and updating the project to support Node.js 24.

## Changes Made

### 1. Node.js 24 Support
- Updated all packages to require Node.js 24+ via `engines` field
- Updated TypeScript to latest version (5.8.3)
- Updated `@types/node` to support newer Node.js versions

### 2. Browser Testing Migration: Karma → Vitest

#### Why Vitest?
- **Modern & Fast**: Built on Vite, significantly faster than Karma
- **Better DX**: Excellent TypeScript support and debugging experience
- **Browser Testing**: Native browser testing support with `@vitest/browser`
- **Jest Compatible**: Easy migration path with compatible APIs
- **Active Development**: Modern, well-maintained testing framework

#### New Dependencies
- `vitest`: Core testing framework
- `@vitest/browser`: Browser testing support
- `@vitest/ui`: Web UI for test results
- `playwright`: Browser automation for testing

#### Removed Dependencies
- `karma` and all karma-related packages
- `jasmine-core` (Vitest has built-in assertion library)

### 3. Configuration Files

#### New Vitest Configurations
- `vitest.config.base.js`: Base configuration for Node.js tests
- `vitest.browser.config.js`: Configuration for browser tests

#### Updated Scripts
Each package now has:
- `vitest`: Run Node.js tests with Vitest
- `vitest:browser`: Run browser tests with Vitest
- Removed `karma` and `karma:window` scripts

### 4. Browser Test Setup
- Each package now has `test/setup-browser.ts` for browser environment setup
- Updated tsconfig.json files to use `vitest/globals` instead of `jest`

## Usage

### Running Tests

#### Node.js Tests (Individual Package)
```bash
cd packages/js-crypto-utils
pnpm vitest
```

#### Browser Tests (Individual Package)
```bash
cd packages/js-crypto-utils
pnpm vitest:browser
```

#### All Packages (Root Level)
```bash
# Node.js tests
pnpm test

# Browser tests
pnpm vitest:browser
```

### Development Mode
```bash
# Watch mode for Node.js tests
pnpm vitest --watch

# Watch mode for browser tests
pnpm vitest:browser --watch

# With UI
pnpm vitest --ui
```

## Migration Benefits

1. **Performance**: Vitest is significantly faster than Karma
2. **Modern Tooling**: Better debugging, HMR, and development experience
3. **Unified Testing**: Same framework for both Node.js and browser tests
4. **Future-Proof**: Active development and modern ecosystem
5. **Node.js 24**: Latest Node.js features and performance improvements

## Compatibility

- **Node.js**: Requires 24.0.0 or higher
- **Browsers**: Chrome, Firefox, Safari (via Playwright)
- **TypeScript**: Latest version with improved support
- **Tests**: Existing Jest-style tests should work with minimal changes

## Next Steps

1. Install dependencies: `yarn install`
2. Run Node.js tests: `yarn test`
3. Run browser tests: `yarn vitest:browser`
4. Remove old karma.conf.js files if desired
5. Update CI/CD pipelines to use new test commands
