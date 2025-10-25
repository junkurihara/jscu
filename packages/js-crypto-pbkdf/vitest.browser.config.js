import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

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
  }
});
