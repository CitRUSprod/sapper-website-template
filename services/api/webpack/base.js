const path = require("path")
const nodeExternals = require("webpack-node-externals")
const { ESBuildPlugin } = require("esbuild-loader")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const paths = {
    src: path.join(__dirname, "../src"),
    dist: path.join(__dirname, "../dist")
}

module.exports = {
    target: "node",
    entry: {
        main: path.join(paths.src, "main.ts")
    },
    output: {
        filename: "[name].js",
        path: paths.dist
    },
    externals: [nodeExternals()],
    stats: {
        all: false,
        version: false,
        errors: true,
        errorDetails: true,
        builtAt: true
    },
    resolve: {
        extensions: [".mjs", ".js", ".ts", ".json"],
        alias: {
            "@": paths.src
        }
    },
    plugins: [new ESBuildPlugin(), new CleanWebpackPlugin()],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "esbuild-loader"
            },
            {
                test: /\.ts$/,
                loader: "ts-loader"
            }
        ]
    }
}
