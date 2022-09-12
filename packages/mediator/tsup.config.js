import path from 'path';
export default {
  format: ['cjs', 'esm'],
  splitting: false,
  sourcemap: true,
  clean: false,
  minify: process.env.NODE_ENV === 'production',
  entry: ['src/index.ts'],
  inject: [path.resolve(__dirname, './react-imports.js')],
};
