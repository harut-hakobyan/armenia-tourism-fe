import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  agentRules: false,
  experimental: {
    // Keep development responsive without allowing Next.js to consume every core.
    cpus: 2,
    workerThreads: false,
    webpackMemoryOptimizations: true,
    webpackBuildWorker: false,
  },
};

export default nextConfig;
