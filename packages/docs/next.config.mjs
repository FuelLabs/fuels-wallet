import { readFileSync } from 'node:fs';
import path from 'node:path';
import * as url from 'url';

const linkDeps = process.env.LINK_DEPS?.trim().split(' ').filter(Boolean) || [];
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// inject app version on the docs
const appPackage = JSON.parse(readFileSync('../app/package.json', 'utf8'));
process.env.NEXT_PUBLIC_APP_VERSION = appPackage.version;

function resolveLinkDeps() {
  return (
    !!linkDeps.length && {
      resolve: {
        alias: linkDeps.reduce((obj, dep) => {
          // remove TS SDK as it's not needed to resolve alias anymore.
          if (/@fuel-ui/.test(dep)) {
            obj[dep] = path.resolve(
              __dirname,
              `./node_modules/${dep}/dist/index.mjs`
            );
          }
          return obj;
        }, {}),
      },
    }
  );
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  basePath: process.env.DOCS_BASE_URL || '',
  experimental: {
    esmExternals: false,
    externalDir: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  trailingSlash: true,
  webpack(config) {
    const depsAlias = resolveLinkDeps();
    config.resolve.alias = {
      ...config.resolve.alias,
      ...depsAlias?.resolve?.alias,
    };
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
