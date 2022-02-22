module.exports = {
    presets: ["react-app"],
    plugins: [
        [
            "styled-components",
            {
                ssr: true,
                displayName: true,
                preprocess: true,
            },
        ],
        "@babel/plugin-proposal-logical-assignment-operators",
        "@babel/plugin-proposal-nullish-coalescing-operator",
        "@babel/plugin-proposal-optional-chaining",
    ],
}
