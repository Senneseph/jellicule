import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default [
  // UMD build (for browsers)
  {
    input: 'src/index.js',
    output: {
      name: 'jellicule',
      file: 'dist/jellicule.js',
      format: 'umd',
      sourcemap: true
    },
    plugins: [
      nodeResolve()
    ]
  },
  // Minified UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'jellicule',
      file: 'dist/jellicule.min.js',
      format: 'umd',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      terser()
    ]
  },
  // ESM build (for modern bundlers)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/jellicule.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      nodeResolve()
    ]
  }
];
