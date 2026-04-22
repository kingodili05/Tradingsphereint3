/** @type {import('next').NextConfig} */ 
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // skip ESLint errors during build
  },
  typescript: {
    ignoreBuildErrors: true, // skip ALL TypeScript errors during build
  },
  optimizeFonts: false,
  images: { 
    unoptimized: true,
    domains: ['images.unsplash.com', 'via.placeholder.com']
  },
  // Disable service worker in development
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP']
  },
  // Optimize webpack cache
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    // Stub out @react-email/render so resend (if cached) doesn't break the build
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-email/render': false,
    };
    return config;
  },
};

module.exports = nextConfig;
