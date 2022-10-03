import GlobalPolyFill from '@esbuild-plugins/node-globals-polyfill';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import type { UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { getVersion } from './getVersion';

process.env.VITE_APP_VERSION = getVersion();

// https://vitejs.dev/config/
const baseConfig: UserConfig = {
  base: process.env.BASE_URL || '/',
  build: {
    target: 'es2020',
    outDir: process.env.BUILD_PATH || 'dist',
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
      plugins: [
        GlobalPolyFill({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
  plugins: [react(), tsconfigPaths()],
  server: {
    port: process.env.NODE_ENV === 'test' ? 3001 : 3000,
  },
  resolve: {
    /**
     * We need this to get right build script and use PNPM link correctly
     */
    alias: {
      '@fuel-ui/react': resolve(
        __dirname,
        '../node_modules/@fuel-ui/react/dist/index.mjs'
      ),
      '@fuel-ui/css': resolve(
        __dirname,
        '../node_modules/@fuel-ui/css/dist/index.mjs'
      ),
      process: 'process/browser',
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
      util: 'util',
    },
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
  /**
   * Need because of this issue:
   * https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
   */
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
};

export default baseConfig;
