import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Browser tests configuration
    browser: {
      enabled: true,
      name: "chromium",
      provider: "playwright",
      headless: true,
      screenshotOnFailure: false,
    },
    include: ["**/test/**/*.spec.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.ts"],
      exclude: ["test/**/*", "**/*.d.ts", "**/*.spec.ts"],
      reportsDirectory: "coverage/vitest-browser",
    },
    // Global test timeout
    testTimeout: 30000,
    // Setup files for browser environment
    setupFiles: ["./test/setup-browser.ts"],
  },
  resolve: {
    // Ensure proper module resolution for browser environment
    conditions: ["browser", "default"],
  },
});
