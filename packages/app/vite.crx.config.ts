import { crx } from '@crxjs/vite-plugin';
import { defineConfig } from 'vite';

import manifest from './manifest.config.js';
import baseConfig from './vite-utils/vite.base.config.js';
import { zipBuildPlugin } from './vite-utils/zip-build.plugin.js';

const OUT_DIR = process.env.CRX_OUT || 'dist-crx';
const APP_VERSION = process.env.VITE_APP_VERSION;
const APP_VERSION_POSTFIX = process.env.APP_VERSION_POSTFIX || '';

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  base: '/',
  build: {
    ...baseConfig.build,
    outDir: OUT_DIR,
  },
  plugins: baseConfig.plugins?.concat([
    crx({
      manifest,
    }),
    zipBuildPlugin({
      inDir: OUT_DIR,
      outDir: baseConfig.build?.outDir,
      outFileName: `fuel-wallet-${APP_VERSION}${APP_VERSION_POSTFIX}.zip`,
      excludeFiles: /.map$/,
    }),
  ]),
});
