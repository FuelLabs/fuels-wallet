import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { getPublicEnvs } from './load.envs.js';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.PUBLIC_URL || '/',
  build: {
    target: 'es2020',
    outDir: process.env.BUILD_PATH || 'dist',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      supported: { bigint: true },
    },
  },
  plugins: [react(), tsconfigPaths()],
  server: {
    port: process.env.NODE_ENV === 'test' ? 3001 : 3000,
  },
  define: {
    'process.env': getPublicEnvs(),
  },
  resolve: {
    /**
     * We need this to get right build script and use PNPM link correctly
     */
    alias: {
      '@fuel-ui/react': resolve(__dirname, './node_modules/@fuel-ui/react/dist/index.mjs'),
      '@fuel-ui/css': resolve(__dirname, './node_modules/@fuel-ui/css/dist/index.mjs'),
    },
  },
  ...(Boolean(process.env.CI) && {
    logLevel: 'silent',
  }),
  /**
   * Need because of this issue:
   * https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
   */
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
});
