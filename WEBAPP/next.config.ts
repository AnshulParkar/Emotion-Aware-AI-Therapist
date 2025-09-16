import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable if needed
  },
  images: {
    domains: [], // Add any external image domains you're using
  },
  // Optimize for production
  poweredByHeader: false,
  compress: true,
  // Configure for Netlify deployment
  trailingSlash: false,
};

export default nextConfig;
