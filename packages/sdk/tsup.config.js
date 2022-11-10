import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['cjs', 'esm'],
  splitting: false,
  sourcemap: true,
  clean: false,
  minify: process.env.NODE_ENV === 'production',
  entry: ['src/index.ts'],
  define: {
    'process.env': '{}',
  },
});
