import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

// one value per build, kept in process.env so the build workers share it
process.env.PDF_VERSION ||= process.env.VERCEL_GIT_COMMIT_SHA
  ? process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 12)
  : Date.now().toString(36);

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_PDF_VERSION: process.env.PDF_VERSION,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
    ],
    unoptimized: true,
  },
  webpack: (config) => {
    // pdf.js names the Node canvas package on its server path; the browser never uses it
    config.resolve.alias.canvas = false;
    return config;
  },
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: './src/lib/empty-module.js',
      },
    },
  },
};

export default withNextIntl(nextConfig);
