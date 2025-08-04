import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mars.nasa.gov',
        pathname: '/mer/gallery/**',
      },
      {
        protocol: 'https',
        hostname: 'mars.jpl.nasa.gov',
        pathname: '/msl-raw-images/**',
      }
    ],
  },
};

export default nextConfig;
