const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = [
  // new UglifyJsPlugin({
  //   sourceMap: false,
  //   parallel: false,
  //   cache: true,
  //   // test: /\.js/,
  //   // chunkFilter: chunk => {
  //   //   return !/vendors/.test(chunk.chunkReason || '')
  //   // },
  //   uglifyOptions: {
  //     nameCache: {},
  //     keep_quoted: true,
  //     evaluate: false,
  //     sequences: false,
  //     builtins: false,
  //     domprops: false,
  //     compress: false,
  //     toplevel: true,
  //     mangle: {
  //       toplevel: true,
  //       properties: {
  //         regex: /^_[a-z]/,
  //         keep_quoted: true,
  //         reserved: require('uglify-js/tools/domprops')
  //       }
  //     }
  //   }
  // }),
  new UglifyJsPlugin({
    // sourceMap: false,
    // parallel: false,
    // cache: true,
    // // test: /.*(?!\.min\.js).{7}($|\?)/,
    // uglifyOptions: {
    //   // warnings: true,
    //   evaluate: true,
    //   sequences: true,
    //   builtins: false,
    //   domprops: false,
    //   toplevel: true,
    //   nameCache: {},
    //   compress: {
    //     comparisons: true,
    //     conditionals: true,
    //     booleans: true,
    //     loops: true,
    //     sequences: true,
    //     join_vars: true,
    //     negate_iife: true,
    //     evaluate: true,
    //     dead_code: true,
    //     unused: true,
    //     inline: true,
    //     keep_fnames: true,
    //     keep_infinity: true,
    //     properties: true,
    //     reduce_funcs: true,
    //     toplevel: true,
    //     passes: 1 // Breaks wavesurfer if using more
    //   },
    //   mangle: false,
    //   output: {
    //     comments: false,
    //     beautify: false
    //   }
    // }
  })
]
