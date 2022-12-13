import react from '@vitejs/plugin-react';
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
  /**
   * Need because of this issue:
   * https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
   */
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
};

export default baseConfig;
