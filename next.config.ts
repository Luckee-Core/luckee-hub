import type { NextConfig } from "next";
import path from "path";

const appRoot = path.join(__dirname);

/**
 * Next locks `.next/dev` for the whole repo. A fallback port skips that lock
 * so `npm run dev` can bind the next free port while another dev server is up.
 */
const skipDistLock = process.env.LUCKEE_HUB_SKIP_DIST_LOCK === "1";

const nextConfig: NextConfig = {
  ...(skipDistLock ? { experimental: { lockDistDir: false } } : {}),
  turbopack: {
    root: appRoot,
  },
  outputFileTracingRoot: appRoot,
};

export default nextConfig;
