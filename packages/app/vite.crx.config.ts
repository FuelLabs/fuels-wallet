import { crx } from '@crxjs/vite-plugin';
import { defineConfig } from 'vite';

import manifest from './manifest.config';
import { fixCRXBuildPlugin } from './vite-utils/fix-build-crx.plugin';
import baseConfig from './vite-utils/vite.base.config';
import { zipBuildPlugin } from './vite-utils/zip-build.plugin';

const OUT_DIT = process.env.CRX_OUT || 'dist-crx';
const APP_VERSION = process.env.VITE_APP_VERSION;
const APP_VERSION_POSTFIX = process.env.APP_VERSION_POSTFIX || '';

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  base: '/',
  build: {
    ...baseConfig.build,
    outDir: OUT_DIT,
  },
  plugins: baseConfig.plugins?.concat([
    crx({
      manifest,
    }),
    fixCRXBuildPlugin({
      outDir: OUT_DIT,
    }),
    zipBuildPlugin({
      inDir: OUT_DIT,
      outDir: baseConfig.build?.outDir,
      outFileName: `fuel-wallet-${APP_VERSION}${APP_VERSION_POSTFIX}.zip`,
      excludeFiles: /.map$/,
    }),
  ]),
});
