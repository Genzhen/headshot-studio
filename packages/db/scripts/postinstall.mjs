import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
});

if (!process.env.DATABASE_URL) {
  console.warn(
    "[packages/db] Skipping `prisma generate` during postinstall because DATABASE_URL is not set yet.",
  );
  process.exit(0);
}

const require = createRequire(import.meta.url);
const prismaCliPath = require.resolve("prisma/build/index.js");
const result = spawnSync(process.execPath, [prismaCliPath, "generate"], {
  stdio: "inherit",
  cwd: process.cwd(),
  env: process.env,
});

process.exit(result.status ?? 1);
