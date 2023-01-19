import { join } from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import baseConfig from './vite-utils/vite.base.config';

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  build: {
    ...baseConfig.build,
    rollupOptions: {
      input: {
        index: 'index.html',
        e2e: 'e2e.html',
      },
    },
  },
  plugins: [
    ...baseConfig.plugins,
    viteStaticCopy({
      targets: [
        {
          src: join(baseConfig.build.outDir, 'index.html'),
          dest: './',
          rename: '404.html',
        },
      ],
    }),
  ],
});
