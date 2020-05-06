const merge = require('webpack-merge')
const common = require('./webpack.common.js')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
// const webpack = require('webpack')
const minify = require('./webpack.minify')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
// const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new LodashModuleReplacementPlugin(),
    // new CleanWebpackPlugin(['dist'], {
    //   exclude: [
    //     '.git_keep'
    //   ]
    // }),
    // new webpack.EnvironmentPlugin({
    //   LOCAL: false,
    //   EMBED_HOST: process.env.EMBED_HOST,
    //   CUSTOM_ENV: process.env.CUSTOM_ENV,
    //   NODE_ENV: process.env.NODE_ENV || 'production',
    //   SERVICE_WORKER_PATH: `https://player.cdn.mdstrm.com${process.env.BASE_PATH || '/player/develop'}/`
    // })
    // new WorkboxPlugin.GenerateSW({
    //   // these options encourage the ServiceWorkers to get in there fast
    //   // and not allow any straggling "old" SWs to hang around
    //   clientsClaim: true,
    //   skipWaiting: true
    // })
    // new JavaScriptObfuscator({
    //   rotateUnicodeArray: true
    // })
  ],
  optimization: {
    minimize: true
    // minimizer: minify
    // splitChunks: {
    //   // Apply optimizations to all chunks, even initial ones (not just the
    //   // ones that are lazy-loaded).
    //   chunks: 'all'
    // },
    // runtimeChunk: 'single'
  },
  output: {
    publicPath: '/'
    // TODO: Get host from ENV
    // publicPath: `https://player.cdn.mdstrm.com${process.env.BASE_PATH || '/player/develop'}/`
  }
})
