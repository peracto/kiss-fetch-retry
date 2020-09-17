import typescript from 'rollup-plugin-typescript2';

export default {
  input: `lib/index.ts`,
  plugins: [typescript()],
  output: [
    {
      file: `dist/index.cjs.js`,
      format: 'cjs'
    }, {
      file: `dist/index.mjs`,
      format: 'es'
    }, {
      file: `dist/index.amd.js`,
      format: 'amd',
    }
  ]
}
