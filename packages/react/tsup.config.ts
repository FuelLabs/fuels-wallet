import type { Options } from 'tsup';

const options: Options = {
  sourcemap: true,
  shims: true,
  treeshake: true,
  splitting: false,
  dts: true,
  format: ['cjs', 'esm'],
  minify: true,
  entry: ['src/index.ts'],
};

export default options;
