import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    // Add quality options to support 75, 85, and 90
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
  },
  // Turbopack configuration for Next.js 16
  experimental: {
    turbo: {
      resolveAlias: {
        // Ignore problematic .d.mts files by aliasing them
        '@jridgewell/sourcemap-codec/types/sourcemap-codec.d.mts': false,
      },
    },
  },
  // Fallback webpack config (only used if --webpack flag is used)
  webpack: (config, { isServer }) => {
    // Ignore .d.mts type definition files
    config.module.rules.push({
      test: /\.d\.mts$/,
      type: 'asset/source',
    });
    
    // Handle .mts files properly
    config.module.rules.push({
      test: /\.mts$/,
      exclude: /\.d\.mts$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });
    
    // Ignore sourcemap-codec type definitions
    config.resolve.alias = {
      ...config.resolve.alias,
      '@jridgewell/sourcemap-codec/types/sourcemap-codec.d.mts': false,
    };
    
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
