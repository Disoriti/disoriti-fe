import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false,
  },
  // Disable image optimization for favicon to prevent errors
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
