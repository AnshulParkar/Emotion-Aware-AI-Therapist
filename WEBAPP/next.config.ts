import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable if needed
  },
  images: {
    domains: [], // Add any external image domains you're using
    unoptimized: false, // Enable Next.js image optimization
  },
  // Optimize for production
  poweredByHeader: false,
  compress: true,
  // Configure for deployment
  trailingSlash: false,
  // Environment-specific optimizations
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
