import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // We ignore build errors because Next.js attempts to type-check 
    // the 'functions' directory which has its own independent dependencies.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Same for ESLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
