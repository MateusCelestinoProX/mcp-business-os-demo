import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  reactStrictMode: true,
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "ogl"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    config.output.hashFunction = "xxhash64";
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/effects/:path*',
        destination: '/comunidade/effects/:path*',
      },
      {
        source: '/public/assets/:path*',
        destination: '/comunidade/public/assets/:path*',
      },
      {
        source: '/src/data/:path*',
        destination: '/comunidade/src/data/:path*',
      },
    ];
  },
};

export default nextConfig;
