const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  cache: {},
  devServer: {
    hot: true,
    contentBase: ['./test', './dist'],
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      LOCAL: true,
      EMBED_HOST: process.env.EMBED_HOST,
      CUSTOM_ENV: process.env.CUSTOM_ENV,
      NODE_ENV: process.env.NODE_ENV || 'development'
    })
  ],
  output: {
    publicPath: '/'
  }
})
