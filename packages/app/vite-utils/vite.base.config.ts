import react from '@vitejs/plugin-react';
import path from 'node:path';
import type { UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { getVersion } from './getVersion';

process.env.VITE_APP_VERSION = getVersion();

// https://vitejs.dev/config/
const baseConfig: UserConfig = {
  base: process.env.BASE_URL || '/',
  build: {
    target: 'es2020',
    outDir: process.env.APP_DIST || 'dist',
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
  plugins: [react(), tsconfigPaths()],
  server: {
    port: process.env.NODE_ENV === 'test' ? 3001 : 3000,
  },
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
      alias: {
        '@fuel-ui/react': path.resolve(
          __dirname,
          '../node_modules/@fuel-ui/react/dist/index.mjs'
        ),
        '@fuel-ui/css': path.resolve(
          __dirname,
          '../node_modules/@fuel-ui/css/dist/index.mjs'
        ),
        '@fuel-ui/config': path.resolve(
          __dirname,
          '../node_modules/@fuel-ui/config/dist/index.mjs'
        ),
        '@fuel-ui/test-utils': path.resolve(
          __dirname,
          '../node_modules/@fuel-ui/test-utils/dist/index.mjs'
        ),
      },
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
