const path = require("path")
const { HotModuleReplacementPlugin, DefinePlugin } = require("webpack")
const sveltePreprocess = require("svelte-preprocess")
const { ESBuildPlugin } = require("esbuild-loader")
const config = require("sapper/config/webpack")
const dotenv = require("dotenv")
const pkg = require("./package.json")

const mode = process.env.NODE_ENV
const dev = mode === "development"

if (dev) {
    dotenv.config({
        path: path.resolve("../../.env")
    })
}

const alias = {
    "@": path.resolve("src"),
    svelte: path.resolve("node_modules", "svelte")
}

const extensions = [".mjs", ".js", ".ts", ".json", ".svelte", ".html"]
const mainFields = ["svelte", "module", "browser", "main"]

const preprocess = sveltePreprocess({
    scss: {
        includePaths: ["src/theme"]
    }
})

const styleLoaders = [
    "style-loader",
    {
        loader: "css-loader",
        options: {
            sourceMap: true,
            importLoaders: 1
        }
    },
    {
        loader: "postcss-loader",
        options: {
            sourceMap: true,
            postcssOptions: {
                plugins: [
                    require("autoprefixer")({
                        overrideBrowserslist: ["> 1%", "last 2 version"]
                    }),
                    require("cssnano")
                ]
            }
        }
    }
]

module.exports = {
    client: {
        entry: { main: config.client.entry().main.replace(/\.js$/, ".ts") },
        output: config.client.output(),
        resolve: { alias, extensions, mainFields },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "esbuild-loader"
                },
                {
                    test: /\.ts$/,
                    loader: "esbuild-loader",
                    options: {
                        loader: "ts"
                    }
                },
                {
                    test: /\.css$/,
                    use: styleLoaders
                },
                {
                    test: /\.scss$/,
                    use: [
                        ...styleLoaders,
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                },
                {
                    test: /\.(svelte|html)$/,
                    use: {
                        loader: "svelte-loader-hot",
                        options: {
                            dev,
                            hydratable: true,
                            preprocess,
                            hotReload: true
                        }
                    }
                },
                {
                    test: /\.(eot|otf|ttf|woff2?|svg)$/,
                    use: {
                        loader: "file-loader",
                        options: {
                            name: "fonts/[name].[ext]"
                        }
                    }
                }
            ]
        },
        mode,
        plugins: [
            ...(dev ? [new HotModuleReplacementPlugin()] : []),
            new DefinePlugin({
                "process.browser": true,
                "process.env.NODE_ENV": JSON.stringify(mode)
            }),
            new ESBuildPlugin()
        ],
        devtool: dev && "inline-source-map"
    },
    server: {
        entry: { server: config.server.entry().server.replace(/\.js$/, ".ts") },
        output: config.server.output(),
        target: "node",
        resolve: { alias, extensions, mainFields },
        externals: Object.keys(pkg.dependencies).concat("encoding"),
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "esbuild-loader"
                },
                {
                    test: /\.ts$/,
                    loader: "esbuild-loader",
                    options: {
                        loader: "ts"
                    }
                },
                {
                    test: /\.(svelte|html)$/,
                    use: {
                        loader: "svelte-loader-hot",
                        options: {
                            css: false,
                            generate: "ssr",
                            hydratable: true,
                            preprocess,
                            dev
                        }
                    }
                }
            ]
        },
        mode,
        plugins: [new ESBuildPlugin()]
    }
}
