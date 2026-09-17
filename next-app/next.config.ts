import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
};

export default nextConfig;
