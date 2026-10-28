import { crx } from '@crxjs/vite-plugin';
import { defineConfig } from 'vite';
import type { PluginOption } from 'vite';

import manifest from './manifest.config.js';
import { iconSpriteSubsetPlugin } from './vite-utils/icon-sprite-subset.plugin.js';
import baseConfig from './vite-utils/vite.base.config.js';
import { zipBuildPlugin } from './vite-utils/zip-build.plugin.js';

const OUT_DIR = process.env.CRX_OUT || 'dist-crx';
const APP_VERSION = process.env.VITE_APP_VERSION;
const APP_VERSION_POSTFIX = process.env.APP_VERSION_POSTFIX || '';
const IS_TEST = process.env.NODE_ENV === 'test';
const BROWSER = process.env.CRX_BROWSER === 'firefox' ? 'firefox' : 'chrome';

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  base: '/',
  build: {
    ...baseConfig.build,
    outDir: OUT_DIR,
    rollupOptions: {
      ...baseConfig.build?.rollupOptions,
      input: {
        index: 'index.html',
        ...(IS_TEST && { e2e: 'e2e.html' }),
      },
    },
  },
  plugins: [
    ...(baseConfig.plugins || []),
    crx({
      manifest,
      browser: BROWSER,
    }) as PluginOption,
    iconSpriteSubsetPlugin({ outDir: OUT_DIR }),
    zipBuildPlugin({
      inDir: OUT_DIR,
      outDir: baseConfig.build?.outDir,
      outFileName: `fuel-wallet-${APP_VERSION}${APP_VERSION_POSTFIX}${BROWSER === 'firefox' ? '-firefox' : ''}.zip`,
      excludeFiles: /(\.map|^mockServiceWorker\.js|^e2e\.html|^\.vite)$/,
    }),
  ],
  legacy: {
    skipWebSocketTokenCheck: true,
  },
  server: {
    ...baseConfig.server,
    allowedHosts: true,
    cors: true,
    hmr: {
      protocol: 'ws',
      clientPort: Number(process.env.PORT),
      host: 'localhost',
    },
  },
});
