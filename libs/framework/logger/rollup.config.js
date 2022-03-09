const typescript = require('rollup-plugin-typescript2')
const localtypescript = require('typescript')
const {nodeResolve} = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const externals = require('rollup-plugin-node-externals')
const del = require('rollup-plugin-delete')

/**
 * What is the class's single responsibility?
 * @remarks
 *
 * When should use use the class? What performance benefits, functionality, or other magical power does it confer upon you?
 *
 * * When shouldn't you use the class?
 *
 * * What states does this class furnish?
 *
 * * What behaviors does this class furnish?
 *
 * * Can you inject dependencies into this class?
 *
 * * Are there any situations where it makes sense to extend this class, rather than inject dependencies into it?
 *
 * * How does the code in this class work?
 *
 * @example
 * ```typescript
 *    //example of how to use this class here
 * ```
 *
 * @alpha @beta @eventProperty @experimental @internal @override @packageDocumentation @public @readonly @sealed @virtual
 */
module.exports = pkg => [
  {
    input: 'src/server.ts',
    output: [
      {
        file: 'lib/server/index.js',
        format: 'cjs',
      },
    ],
    plugins: [
      del({targets: 'lib/server/*'}),
      externals({
        deps: true,
        peerDeps: true,
      }),
      typescript({
        clean: true,
        typescript: localtypescript,
        tsconfig: './tsconfig.json',
        exclude: ['**/*.test.*'],
      }),
      nodeResolve(),
      commonjs(),
    ],
  },
  {
    input: 'src/client.ts',
    output: [
      {
        file: 'lib/client/index.js',
        format: 'cjs',
      },
      {
        file: 'lib/client/index.es.js',
        format: 'es',
      },
    ],
    plugins: [
      del({targets: 'lib/client/*'}),
      externals({
        deps: true,
        peerDeps: true,
      }),
      typescript({
        clean: true,
        typescript: localtypescript,
        tsconfig: './tsconfig.json',
        exclude: ['**/*.test.*'],
      }),
      nodeResolve(),
      commonjs(),
    ],
  },
]
