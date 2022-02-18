const typescript = require("rollup-plugin-typescript2")
const localtypescript = require("typescript")
const {nodeResolve} = require("@rollup/plugin-node-resolve")
const commonjs = require("@rollup/plugin-commonjs")
const externals = require("rollup-plugin-node-externals")
const createStyledComponentsTransformer = require("typescript-plugin-styled-components").default

const styledComponentsTransformer = pkg =>
    createStyledComponentsTransformer({
        ssr: true, // this is not needed as it defaults to true
        minify: true,
        displayName: true, // this is not needed as it defaults to true
        getDisplayName: (_filename, bindingName) =>
            `${pkg.name.substring(pkg.name.lastIndexOf("/") + 1)}-${bindingName}`, // this is not really needed as it defaults to this exact function (leaving it here in we want to change it)
    })
    
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
module.exports = (pkg, isProd = false) => ({
    input: "src/index.tsx",
    output: [
        {
            file: pkg.main,
            format: "cjs",
        },
        {
            file: pkg.module,
            format: "es",
        },
    ],
    plugins: [
        externals({
            deps: isProd,
            peerDeps: true,
        }),
        typescript({
            clean: true,
            typescript: localtypescript,
            tsconfig: "./tsconfig.json",
            transformers: [
                () => ({
                    before: [styledComponentsTransformer(pkg)],
                }),
            ],
        }),
        nodeResolve(),
        commonjs(),
    ],
})
