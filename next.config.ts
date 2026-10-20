import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "ogl"],
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "lijrxbzotmoikyvjiipv.supabase.co" },
      { protocol: "https", hostname: "wccrxgczldiviilkfsuj.supabase.co" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "d8j0ntlcm91z4.cloudfront.net" },
    ],
  },
  async redirects() {
    return [
      {
        source: '/politica-de-privacidade',
        destination: '/privacidade',
        permanent: true,
      },
      {
        source: '/termos-de-uso',
        destination: '/termos',
        permanent: true,
      },
    ];
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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
