import { defineConfig } from 'vitest/config';

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
