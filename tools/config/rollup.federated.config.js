const typescript = require('rollup-plugin-typescript2')
const localtypescript = require('typescript')
// const {nodeResolve} = require('@rollup/plugin-node-resolve')
// const commonjs = require('@rollup/plugin-commonjs')
const {externals} = require('rollup-plugin-node-externals')
const del = require('rollup-plugin-delete')
/**
 * This is the rollup configuration to package up in cjs and esm format,
 * from typescript source files. it refers to an inherent UI component.
 * @remarks
 *
 * This should be used when bundling a package which source files are .tsx although it might
 * not produce an actual JSX UI component.
 *
 * * This should not be used for explicit UI components, config packages and common packages.
 *
 *
 * please note that we need to build esm and cjs (plus types) for the following reason:
 * * esm to import in your consumer application's source code
 * * types to support typescript consumers
 * * cjs to support Jest runs (which do support only cjs)
 *
 *
 * @internal
 */
module.exports = (pkg, isProd = false) => ({
  // the mounting pointt of the package
  input: 'src/index.tsx',
  // the output formats
  output: [
    {
      // the actual file as per package.json description
      file: pkg.main,
      format: 'cjs',
      sourcemap: !isProd,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: !isProd,
    },
  ],
  plugins: [
    // this line is for deleting the output folder before any build.
    del({targets: 'lib/*'}),
    //
    externals({
      // we always want the deps and peerDeps not to be bundled in,
      // the consumer will import at build time and npm will install all the deps from the consumer's build
      deps: true,
      peerDeps: true,
    }),
    typescript({
      clean: true,
      typescript: localtypescript,
      tsconfig: './tsconfig.json',
      sourcemap: !isProd,
    }),
  ],
})
