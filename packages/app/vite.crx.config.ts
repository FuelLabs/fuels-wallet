import { crx } from '@crxjs/vite-plugin';
import { defineConfig } from 'vite';
import zipPack from 'vite-plugin-zip-pack';

import manifest from './manifest.config';
import baseConfig from './vite-utils/vite.base.config';

// Inject CRX variable on the process
process.env.VITE_CRX = 'true';

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  base: '/',
  build: {
    ...baseConfig.build,
    outDir: 'dist-crx',
    rollupOptions: {
      input: {
        index: 'index.html',
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      ...baseConfig.optimizeDeps?.esbuildOptions,
      plugins: [],
    },
  },
  plugins: baseConfig.plugins?.concat([
    crx({
      manifest,
    }),
    zipPack({
      inDir: 'dist-crx',
      outDir: baseConfig.build?.outDir,
      outFileName: 'fuel-wallet.zip',
    }),
  ]),
});
