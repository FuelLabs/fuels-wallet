import type { Options } from 'tsup';

const options: Options = {
  sourcemap: true,
  shims: true,
  treeshake: true,
  splitting: false,
  dts: true,
  format: ['cjs', 'esm'],
  minify: process.env.NODE_ENV === 'production',
  entry: ['src/index.ts'],
};

export default options;
