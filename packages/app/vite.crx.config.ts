import { crx } from '@crxjs/vite-plugin';
import { defineConfig } from 'vite';

import manifest from './manifest.config';
import baseConfig from './vite-utils/vite.base.config';
import { zipBuildPlugin } from './vite-utils/zip-build.plugin';

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  base: '/',
  build: {
    ...baseConfig.build,
    outDir: process.env.CRX_OUT || 'dist-crx',
  },
  plugins: baseConfig.plugins?.concat([
    crx({
      manifest,
    }),
    zipBuildPlugin({
      inDir: 'dist-crx',
      outDir: baseConfig.build?.outDir,
      outFileName: 'fuel-wallet.zip',
      excludeFiles: /.map$/,
    }),
  ]),
});
