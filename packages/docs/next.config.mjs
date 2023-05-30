/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/naming-convention */
import path from 'node:path';
import * as url from 'url';

const linkDeps = process.env.LINK_DEPS?.trim().split(' ').filter(Boolean) || [];
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

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
  trailingSlash: true,
  webpack(config) {
    const depsAlias = resolveLinkDeps();
    config.resolve.alias = {
      ...config.resolve.alias,
      ...depsAlias?.resolve?.alias,
    };
    return config;
  },
};

export default nextConfig;
