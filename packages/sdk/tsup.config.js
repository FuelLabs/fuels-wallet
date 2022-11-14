import { defineConfig } from 'tsup';
import { getPublicEnvs } from './load.envs';

export default defineConfig({
  format: ['cjs', 'esm'],
  splitting: false,
  sourcemap: true,
  clean: false,
  minify: process.env.NODE_ENV === 'production',
  entry: ['src/index.ts'],
  define: {
    'process.env': JSON.stringify(getPublicEnvs()),
  },
});
