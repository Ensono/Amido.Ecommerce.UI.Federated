const typescript = require("rollup-plugin-typescript2")
const localtypescript = require("typescript")
const resolve = require("@rollup/plugin-node-resolve")
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
            tsconfig: "./tsconfig.build.json",
            transformers: [
                () => ({
                    before: [styledComponentsTransformer(pkg)],
                }),
            ],
        }),
        resolve(),
        commonjs(),
    ],
})
