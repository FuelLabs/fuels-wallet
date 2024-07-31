// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { join } from 'path';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import baseConfig from './vite-utils/vite.base.config';

const plugins = [
  [
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
];

if (process.env.VITE_SENTRY_AUTH) {
  plugins.push(
    sentryVitePlugin({
      org: 'fuel-labs',
      project: 'fuel-wallet',
      authToken: process.env.VITE_SENTRY_AUTH,
      sourcemaps: {
        filesToDeleteAfterUpload: ['*.js.map'],
      },
    })
  );
}

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  plugins,
});
