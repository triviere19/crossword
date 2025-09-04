import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle this library, require it at runtime
      config.externals.push("crossword-layout-generator");
    }
    return config;
  },
};

export default nextConfig;
