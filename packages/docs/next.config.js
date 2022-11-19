/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  basePath: process.env.DOCS_BASE_URL || '',
  experimental: {
    esmExternals: false,
    externalDir: true,
    appDir: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
