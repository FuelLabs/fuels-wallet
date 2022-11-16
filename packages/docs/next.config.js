/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  basePath: process.env.DOCS_BASE_URL || '',
  experimental: {
    esmExternals: true,
  },
};

module.exports = nextConfig;
