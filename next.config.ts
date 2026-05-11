import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "standalone",
  images: { unoptimized: true },
  turbopack: {
    // Pin workspace root to THIS package's directory. Without this,
    // Turbopack walks up to /Users/.../grounded/ (which has its own
    // package.json + node_modules/typescript) and fails to resolve
    // `next` from that level.
    root: here,
  },
};

export default nextConfig;
