const typescript = require('rollup-plugin-typescript2')
const localtypescript = require('typescript')
const {nodeResolve} = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const {externals} = require('rollup-plugin-node-externals')
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default
const del = require('rollup-plugin-delete')

const styledComponentsTransformer = pkg =>
  createStyledComponentsTransformer({
    ssr: true, // this is not needed as it defaults to true
    minify: true,
    displayName: true, // this is not needed as it defaults to true
    getDisplayName: (_filename, bindingName) => `${pkg.name.substring(pkg.name.lastIndexOf('/') + 1)}-${bindingName}`, // this is not really needed as it defaults to this exact function (leaving it here in we want to change it)
  })

/**
 * This is the rollup configuration to package up UI components in cjs and esm format,
 * from typescript source files. it refers to an explicit UI component.
 * @remarks
 *
 * This should be used when bundling a package which source files are .tsx
 *
 * * This should be used for explicit UI components only.
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
module.exports = pkg => ({
  // the mounting pointt of the package
  input: 'src/index.tsx',
  // the output formats
  output: [
    {
      // the actual file as per package.json description
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
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
    }),
    // nodeResolve will traverse the node_modules tree and bundle all deps that are not external (see above)
    nodeResolve(),
    // commonjs will transpile cjs dependencies into esm for sharing purposes
    commonjs(),
  ],
})
