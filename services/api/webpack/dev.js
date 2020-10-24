const path = require("path")
const NodemonPlugin = require("nodemon-webpack-plugin")
const { merge } = require("webpack-merge")
const dotenv = require("dotenv")

const baseConfig = require("./base")

dotenv.config({
    path: path.join(__dirname, "../../../.env")
})

const devConfig = merge(baseConfig, {
    mode: "development",
    devtool: "inline-source-map",
    watch: true,
    plugins: [new NodemonPlugin()]
})

const entry = Object.entries(devConfig.entry).reduce((acc, [key, value]) => {
    acc[key] = ["source-map-support/register", value]
    return acc
}, {})

devConfig.entry = entry

module.exports = devConfig
