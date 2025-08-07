import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apod.nasa.gov',
        pathname: '/apod/**',
      },
      {
        protocol: 'http',
        hostname: 'apod.nasa.gov',
        pathname: '/apod/**',
      },
      {
        protocol: 'https',
        hostname: 'mars.nasa.gov',
        pathname: '/**',
      },
       {
        protocol: 'http',
        hostname: 'mars.nasa.gov',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mars.nasa.gov',
        pathname: '/mer/gallery/**',
      },
       {
        protocol: 'http',
        hostname: 'mars.nasa.gov',
        pathname: '/mer/gallery/**',
      },
      {
        protocol: 'https',
        hostname: 'mars.jpl.nasa.gov',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'mars.jpl.nasa.gov',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images-assets.nasa.gov',
        pathname: '/image/**',
      },
      {
        protocol: 'http',
        hostname: 'images-assets.nasa.gov',
        pathname: '/image/**',
      },
    ],
  },
};

export default nextConfig;
