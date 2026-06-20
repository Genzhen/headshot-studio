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
      AWS_REGION: process.env.AWS_REGION || "us-east-1",
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "test-access-key-id",
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "test-secret-access-key",
      AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || "test-bucket",
    },
  },
  resolve: {
    alias: {
      "@headshot-studio/env": path.resolve(__dirname, "../env/src"),
      "@headshot-studio/db": path.resolve(__dirname, "../db/src"),
    },
  },
});
