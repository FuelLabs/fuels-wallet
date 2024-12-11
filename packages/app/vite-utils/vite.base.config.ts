import path from 'node:path';
import react from '@vitejs/plugin-react';
import type { PluginOption, UserConfig } from 'vite';
import cleanPlugin from 'vite-plugin-clean';
import { Mode, plugin as viteMdPlugin } from 'vite-plugin-markdown';
import tsconfigPaths from 'vite-tsconfig-paths';

import '../load.envs.cts';

const linkDeps = process.env.LINK_DEPS?.trim().split(' ').filter(Boolean) || [];

export function resolveLinkDeps() {
  return (
    !!linkDeps.length && {
      resolve: {
        alias: linkDeps.reduce((obj, dep) => {
          // remove TS SDK as it's not needed to resolve alias anymore.
          if (!/^fuels?|@fuel-ts/.test(dep)) {
            obj[dep] = path.resolve(
              __dirname,
              `../node_modules/${dep}/dist/index.mjs`
            );
          }
          return obj;
        }, {}),
      },
    }
  );
}

// https://vitejs.dev/config/
const baseConfig: UserConfig = {
  base: process.env.BASE_URL || '/',
  build: {
    target: 'esnext',
    sourcemap: true,
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
    // proxy: {
    //   '/public': 'http://localhost:3000',
    // }
    watch: {
      ignored: ['**/playwright*/**'], // Ignore changes in any 'playwright' folder
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
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
    viteMdPlugin({
      mode: [Mode.REACT],
    }),
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
  ...resolveLinkDeps(),
  /**
   * Need because of this issue:
   * https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
   */
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
};

export default baseConfig;
