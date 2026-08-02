import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this folder. The parent repo still has the old static
  // site (and its own lockfile), which would otherwise confuse Turbopack's inference.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
