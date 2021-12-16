const typescript = require("rollup-plugin-typescript2")
const localtypescript = require("typescript")
const resolve = require("@rollup/plugin-node-resolve")
const commonjs = require("@rollup/plugin-commonjs")
const externals = require("rollup-plugin-node-externals")

module.exports = (pkg, isProd = false) => ({
    input: "src/index.ts",
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
            typescript: localtypescript,
            tsconfig: "./tsconfig.build.json",
        }),
        resolve(),
        commonjs(),
    ],
})
