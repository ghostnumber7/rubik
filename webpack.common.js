const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const fs = require('fs')
// const babel = fs.readFileSync(path.join(__dirname, '.babelrc'))
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')

const devMode = process.env.NODE_ENV !== 'production'

const HTMLTemplate = fs.readFileSync(path.resolve(__dirname, 'src', 'public', 'index.html')).toString()

let lastProgress = 0

module.exports = {
  context: __dirname,
  entry: './src/client/index.jsx',
  // entry: {
  //   // player: './src/api/player.js',
  //   client: './src/client/index.jsx'
  // },
  bail: true,
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: ['html-loader'],
        // include: __dirname,
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        use: [ 'babel-loader' ],
        // include: __dirname,
        exclude: /node_modules/
      },
      // {
      //   test: /\.(c|le)ss$/,
      //   exclude: /node_modules/,
      //   use: [
      //     // devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
      //     {
      //       loader: './src/view/styleLoader.js',
      //       options: {
      //         transform: './src/view/styleOverride.js'
      //       }
      //     },
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         sourceMap: false,
      //         modules: true,
      //         localIdentName: '[local]'
      //       }
      //     },
      //     {
      //       loader: 'less-loader',
      //       options: {
      //         strictMath: true,
      //         noIeCompat: true
      //       }
      //     }
      //   ]
      // },
      // {
      //   test: /\.(sa|sc)ss$/,
      //   exclude: /node_modules/,
      //   use: [
      //     {
      //       loader: './src/view/styleLoader.js',
      //       options: {
      //         transform: './src/view/styleOverride.js'
      //       }
      //     },
      //     // devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         sourceMap: false,
      //         modules: true,
      //         localIdentName: '[local]'
      //       }
      //     },
      //     {
      //       loader: 'sass-loader',
      //       options: {
      //         implementation: require('sass')
      //       }
      //     }
      //   ]
      // },
      // {
      //   test: /\.svg$/,
      //   use: [
      //     'babel-loader',
      //     {
      //       loader: 'react-svg-loader',
      //       options: {
      //         jsx: true
      //       }
      //     }
      //   ]
      // },
      // {
      //   test: /\.(pdf|jpg|png|gif|ico)$/,
      //   use: [
      //     {
      //       loader: 'url-loader'
      //     }
      //   ]
      // }
    ]
  },
  // resolveLoader: {
  //   modules: [
  //       path.join(__dirname, 'node_modules')
  //   ]
  // },
  resolve: {
    // modules: [
    //   path.join(__dirname, 'node_modules')
    // ],
    extensions: ['.js', '.jsx', '.html'],
    alias: {
      Helper: path.resolve(__dirname, 'src/client/helpers'),
      Context: path.resolve(__dirname, 'src/client/context'),
  // //     // components: path.resolve(__dirname, 'src/helper/components/')
    }
  },
  optimization: {
    usedExports: true,
    mangleWasmImports: true
  },
  output: {
    chunkFilename: 'cube_[id].js',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    pathinfo: false,
    crossOriginLoading: 'anonymous',
    globalObject: 'this'
    // pathinfo: false,
    // crossOriginLoading: 'anonymous',
    // globalObject: 'this'
  },
  plugins: [
    // new CopyPlugin([
    //   { from: './src/public', to: 'dest' }
    // ]),
    new HTMLWebpackPlugin({
      templateContent: HTMLTemplate, //'src/public/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // Remove moments.js locales
    // new MiniCssExtractPlugin({
    //   // Options similar to the same options in webpackOptions.output
    //   // both options are optional
    //   filename: devMode ? '[name].css' : '[name].css',
    //   chunkFilename: devMode ? '[id].css' : '[id].css'
    // }),
    // // new webpack.optimize.ModuleConcatenationPlugin(),
    // new webpack.optimize.AggressiveMergingPlugin({
    //   minSize: 30000,
    //   maxSize: 50000
    // }),
    // // devMode
    // //   ? new webpack.NamedModulesPlugin()
    // //   : new webpack.HashedModuleIdsPlugin(),
    // new webpack.ProgressPlugin((percent, message) => {
    //   const currentProgress = parseInt(percent * 100)
    //   if (lastProgress !== currentProgress) {
    //     lastProgress = currentProgress
    //     console.log('BUILDING: ', currentProgress, '%')
    //   }
    // }),
    // new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.BannerPlugin({ entryOnly: true, raw: true, banner: 'typeof window !== "undefined" &&' }) // SSR/Node.js guard
    // // new webpack.optimize.LimitChunkCountPlugin({ // build for node in one single file
    // //   maxChunks: 1
    // // })
  ]
}
