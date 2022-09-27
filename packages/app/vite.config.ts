import { defineConfig } from 'vite';

import { htmlTemplate } from './vite-utils/htmlTemplate';
import baseConfig from './vite-utils/vite.base.config';

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    htmlTemplate({
      pagesDir: './pages',
      indexPage: './pages/index.html',
    }),
  ],
});
