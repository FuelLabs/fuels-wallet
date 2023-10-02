import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import './load.envs.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT),
    strictPort: true,
  },
});
