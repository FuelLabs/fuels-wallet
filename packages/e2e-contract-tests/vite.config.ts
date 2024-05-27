import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import './load.envs.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT),
  },
  build: {
    target: ['es2020'],
    outDir: process.env.BUILD_PATH || 'dist',
  },
});
