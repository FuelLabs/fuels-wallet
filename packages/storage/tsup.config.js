export default {
  format: ['cjs', 'esm'],
  splitting: false,
  sourcemap: true,
  clean: false,
  minify: process.env.NODE_ENV === 'production',
  entry: ['src/index.ts'],
};
