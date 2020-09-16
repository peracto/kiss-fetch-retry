import typescript from 'rollup-plugin-typescript2';

export default ((name) => ({
  input: `lib/${name}.ts`,
  plugins: [typescript()],
  output: [
    {
      file: `dist/${name}-cjs.js`,
      format: 'cjs'
    }, {
      file: `dist/${name}.mjs`,
      format: 'es'
    }, {
      file: `dist/${name}-amd.js`,
      format: 'amd',
    }
  ]
}))(
    "kiss-fetch-retry"
)
