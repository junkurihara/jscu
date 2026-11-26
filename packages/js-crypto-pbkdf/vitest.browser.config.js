import { readFileSync, readdirSync } from 'fs';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

// Workspace packages are linked from the sibling directories (pnpm linkWorkspacePackages) and
// ship CommonJS in dist/. Vite does not pre-bundle linked packages, so the browser would get raw
// CommonJS ("exports is not defined"); list them explicitly to have them converted to ESM.
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const workspacePackages = readdirSync(new URL('..', import.meta.url));
const linkedWorkspaceDeps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })
  .filter((name) => workspacePackages.includes(name));

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        {
          browser: 'chromium',
        }
      ],
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
  },
  optimizeDeps: {
    include: linkedWorkspaceDeps
  }
});
