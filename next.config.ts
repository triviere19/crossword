import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle this library, require it at runtime
      config.externals.push("crossword-layout-generator");
      config.externals.push(
        "@crossword-composer-ts/core", 
        "@crossword-composer-ts/core-darwin-x64",
        "@crossword-composer-ts/core-linux-x64-gnu",
        "@crossword-composer-ts/core-linux-x64-musl",
        "@crossword-composer-ts/core-linux-arm64-gnu",
        "@crossword-composer-ts/core-linux-arm-gnueabihf",
        "@crossword-composer-ts/core-darwin-arm64",
        "@crossword-composer-ts/core-android-arm64",
        "@crossword-composer-ts/core-freebsd-x64",
        "@crossword-composer-ts/core-linux-arm64-musl",
        "@crossword-composer-ts/core-android-arm-eabi",
        "@crossword-composer-ts/core-wasm32-wasi",
      );
    }
    return config;
  },
};

export default nextConfig;
