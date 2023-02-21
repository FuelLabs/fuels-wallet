import react from '@vitejs/plugin-react';
import path from 'node:path';
import type { PluginOption, UserConfig } from 'vite';
import cleanPlugin from 'vite-plugin-clean';
import tsconfigPaths from 'vite-tsconfig-paths';

import '../load.envs.js';

const linkDeps = process.env.LINK_DEPS?.trim().split(' ') || [];

// https://vitejs.dev/config/
const baseConfig: UserConfig = {
  base: process.env.BASE_URL || '/',
  build: {
    target: 'es2020',
    outDir: process.env.APP_DIST || 'dist',
    rollupOptions: {
      input: {
        index: 'index.html',
        e2e: 'e2e.html',
      },
    },
  },
  server: {
    port: Number(process.env.PORT),
    strictPort: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      supported: {
        bigint: true,
      },
      define: {
        global: 'globalThis',
      },
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    {
      ...cleanPlugin({
        targetFiles: ['dist', 'dist-crx'],
      }),
      apply: 'serve',
    } as PluginOption,
  ],
  ...(Boolean(process.env.CI) && {
    logLevel: 'silent',
  }),
  /**
   * Need because of this issue:
   * https://github.com/vitejs/vite/issues/1973
   * Avoid "proccess is not defined" when compiling in Cypress side
   */
  define: {
    'process.env': {},
  },
  ...(process.env.WITH_PNPM_LINKS && {
    resolve: {
      alias: linkDeps.reduce((obj, dep) => {
        // eslint-disable-next-line no-param-reassign
        obj[dep] = path.resolve(
          __dirname,
          `../node_modules/${dep}/dist/index.mjs`
        );
        return obj;
      }, {}),
    },
  }),
  /**
   * Need because of this issue:
   * https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
   */
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
};

export default baseConfig;
