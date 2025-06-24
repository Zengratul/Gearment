import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Environment variables will be available at build time
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Ensure environment variables are available at runtime
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
