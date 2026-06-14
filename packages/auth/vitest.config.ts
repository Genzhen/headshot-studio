import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    env: {
      DATABASE_URL: process.env.DATABASE_URL || "postgresql://test:test@localhost:5432/test",
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "test-secret-key-at-least-32-chars-long",
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
      CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3001",
    },
  },
  resolve: {
    alias: {
      "@headshot-studio/env": path.resolve(__dirname, "../env/src"),
      "@headshot-studio/db": path.resolve(__dirname, "../db/src"),
    },
  },
});
