import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "ogl"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "lijrxbzotmoikyvjiipv.supabase.co" },
      { protocol: "https", hostname: "wccrxgczldiviilkfsuj.supabase.co" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "d8j0ntlcm91z4.cloudfront.net" },
    ],
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
