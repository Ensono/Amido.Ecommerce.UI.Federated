const externals = require("rollup-plugin-node-externals")

module.exports = (pkg) => ({
    input: "src/index.ts",
    output: [
        {
            file: pkg.main,
            format: "cjs",
        },
    ],
    plugins: [
        externals({
            deps: true,
            peerDeps: true,
        }),
    ],
})
