import path from "node:path";
import { fileURLToPath } from "node:url";

import "@headshot-studio/env/web";
import type { NextConfig } from "next";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  outputFileTracingRoot: path.join(currentDir, "../.."),
};

export default nextConfig;
