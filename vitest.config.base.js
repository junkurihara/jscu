import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Node.js tests configuration
    environment: "node",
    include: ["**/test/**/*.spec.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.ts"],
      exclude: ["test/**/*", "**/*.d.ts", "**/*.spec.ts"],
      reportsDirectory: "coverage/vitest",
    },
    // Global test timeout
    testTimeout: 30000,
  },
  esbuild: {
    target: "node14",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
});
