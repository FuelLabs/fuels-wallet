import path from 'path';

export default {
  sourcemap: true,
  shims: true,
  treeshake: true,
  format: ['cjs', 'esm'],
  minify: process.env.NODE_ENV === 'production',
  entry: ['src/index.ts'],
  inject: [path.resolve(__dirname, './react-imports.js')],
};
