const externals = require("rollup-plugin-node-externals")

module.exports = (pkg, isProd = false) => ({
    input: "src/index.ts",
    output: [
        {
            file: pkg.main,
            format: "cjs",
        },
    ],
    plugins: [
        externals({
            deps: isProd,
            peerDeps: true,
        }),
    ],
})
